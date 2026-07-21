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

function normalizeToken(value) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function uploadResume(token, file) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  return fetch(`${API_BASE}/api/students/profile/cv`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: "no-store",
  });
}

function downloadResume(token) {
  return fetch(`${API_BASE}/api/students/profile/cv`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

function getDownloadHeaders(fileName, fileType) {
  const safeFileName = fileName.replace(/["\\\r\n]/g, "_");
  const encodedFileName = encodeURIComponent(fileName);

  return {
    "Content-Type": fileType || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`,
  };
}

async function refreshAccessToken(token) {
  const response = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  return response.ok ? normalizeToken(data.token) : null;
}

export async function GET(request) {
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    let response = await downloadResume(token);

    if (response.status === 401) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү." },
          { status: 401 }
        );
      }

      token = refreshedToken;
      cookieStore.set("token", token, cookieOptions);
      response = await downloadResume(token);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
    }

    const contentType = response.headers.get("content-type");

    if (response.ok && contentType?.includes("application/json")) {
      const file = await response.json();

      if (new URL(request.url).searchParams.get("metadata") === "true") {
        return Response.json({
          fileId: file?.fileId ?? null,
          fileName: file?.fileName ?? "",
          fileType: file?.fileType ?? "",
          contentTypes: file?.contentTypes ?? "CV",
        });
      }

      if (!file?.fileName || !file?.data) {
        return Response.json(
          { message: "CV файлын нэр эсвэл өгөгдөл хоосон байна." },
          { status: 404 }
        );
      }

      try {
        return new Response(decodeBase64File(file.data), {
          headers: getDownloadHeaders(file.fileName, file.fileType),
        });
      } catch {
        return Response.json(
          { message: "CV файлын өгөгдөл буруу форматтай байна." },
          { status: 502 }
        );
      }
    }

    const headers = new Headers();
    const contentDisposition = response.headers.get("content-disposition");
    const contentLength = response.headers.get("content-length");

    if (contentType) headers.set("Content-Type", contentType);
    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    } else if (response.ok) {
      headers.set("Content-Disposition", "attachment");
    }
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Student resume download failed:", error);
    return Response.json(
      { message: "Resume файлыг татаж чадсангүй." },
      { status: 502 }
    );
  }
}

export async function PUT(request) {
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json(
        { message: "Resume файл сонгоно уу." },
        { status: 400 }
      );
    }

    let response = await uploadResume(token, file);

    if (response.status === 401) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү." },
          { status: 401 }
        );
      }

      token = refreshedToken;
      cookieStore.set("token", token, cookieOptions);
      response = await uploadResume(token, file);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
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
    console.error("Student resume upload failed:", error);
    return Response.json(
      { message: "Resume файлыг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}
