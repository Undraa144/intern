import { cookies } from "next/headers";

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

async function uploadFile(token, formData) {
  return fetch(`${API_BASE}/api/reports/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getBearerToken(token)}`,
    },
    body: formData,
    cache: "no-store",
  });
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

export async function POST(request) {
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("auth_token")?.value);

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
        { message: "Тайлангийн файл сонгоно уу." },
        { status: 400 }
      );
    }

    const createFormData = () => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return formData;
    };

    let response = await uploadFile(token, createFormData());

    if (response.status === 401) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("auth_token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна." },
          { status: 401 }
        );
      }

      token = getBearerToken(refreshedToken);
      cookieStore.set("auth_token", token, cookieOptions);
      response = await uploadFile(token, createFormData());
    }

    if (response.status === 401) {
      cookieStore.delete("auth_token");
      return Response.json(
        { message: "Нэвтрэх эрх хүчингүй байна. Дахин нэвтэрнэ үү." },
        { status: 401 }
      );
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
