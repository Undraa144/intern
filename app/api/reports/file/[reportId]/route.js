import { cookies } from "next/headers";
import { decodeBase64File } from "@/app/utils/base64-file.mjs";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function getBearerToken(value) {
  const token = value?.trim().replace(/^['"]|['"]$/g, "");
  return token?.replace(/^Bearer\s+/i, "").trim();
}

function requestReportFile(token, reportId, formData, method) {
  return fetch(
    `${API_BASE}/api/reports/file/${encodeURIComponent(reportId)}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${getBearerToken(token)}`,
      },
      body: formData,
      cache: "no-store",
    }
  );
}

async function refreshAccessToken(token) {
  const response = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  return response.ok ? data.token : null;
}

function getDownloadHeaders(fileName, fileType) {
  const safeFileName = fileName.replace(/["\\\r\n]/g, "_");
  const encodedFileName = encodeURIComponent(fileName);

  return {
    "Content-Type": fileType || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`,
  };
}

async function handleFileRequest(request, params, method) {
  const { reportId } = await params;
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  if (!reportId) {
    return Response.json(
      { message: "Тайлангийн дугаар шаардлагатай." },
      { status: 400 }
    );
  }

  try {
    let createFormData = () => undefined;

    if (method !== "GET" && method !== "DELETE") {
      const incomingFormData = await request.formData();
      const file = incomingFormData.get("file");

      if (!(file instanceof File) || file.size === 0) {
        return Response.json(
          { message: "Файл сонгоно уу." },
          { status: 400 }
        );
      }

      createFormData = () => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return formData;
      };
    }

    let response = await requestReportFile(
      token,
      reportId,
      createFormData(),
      method
    );

    if (response.status === 401 || response.status === 403) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна." },
          { status: 401 }
        );
      }

      token = getBearerToken(refreshedToken);
      cookieStore.set("token", token, cookieOptions);
      response = await requestReportFile(
        token,
        reportId,
        createFormData(),
        method
      );
    }

    if (response.status === 401) {
      cookieStore.delete("token");
      return Response.json(
        { message: "Нэвтрэх эрх хүчингүй байна. Дахин нэвтэрнэ үү." },
        { status: 401 }
      );
    }

    if (response.status === 403) {
      const responseBody = await response.text();

      return Response.json(
        {
          message:
            responseBody ||
            "Энэ тайлангийн файлыг устгах эрх backend серверээс олгогдсонгүй.",
        },
        { status: 403 }
      );
    }

    if (method === "GET" && response.ok) {
      const payload = await response.json().catch(() => null);
      const file = payload?.fileName
        ? payload
        : payload?.data ?? payload?.file ?? payload;

      if (!file?.fileName || !file?.data) {
        return Response.json(
          { message: "Тайлангийн файлын нэр эсвэл өгөгдөл хоосон байна." },
          { status: 404 }
        );
      }

      try {
        return new Response(decodeBase64File(file.data), {
          headers: getDownloadHeaders(file.fileName, file.fileType),
        });
      } catch {
        return Response.json(
          { message: "Тайлангийн файлын өгөгдөл буруу форматтай байна." },
          { status: 502 }
        );
      }
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Report file upload failed:", error);
    return Response.json(
      { message: "Тайлангийн файлыг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}

export async function GET(request, { params }) {
  return handleFileRequest(request, params, "GET");
}

export async function POST(request, { params }) {
  return handleFileRequest(request, params, "POST");
}

export async function PUT(request, { params }) {
  return handleFileRequest(request, params, "PUT");
}

export async function DELETE(request, { params }) {
  return handleFileRequest(request, params, "DELETE");
}
