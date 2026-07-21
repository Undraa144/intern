import { cookies } from "next/headers";

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
