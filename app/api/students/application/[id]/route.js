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

function getApplication(token, id) {
  return fetch(
    `${API_BASE}/api/students/application/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
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
  return response.ok ? normalizeToken(data.token) : null;
}

export async function GET(_request, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("auth_token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    let response = await getApplication(token, id);

    if (response.status === 401) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("auth_token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү." },
          { status: 401 }
        );
      }

      token = refreshedToken;
      cookieStore.set("auth_token", token, cookieOptions);
      response = await getApplication(token, id);
    }

    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Student application detail fetch failed:", error);
    return Response.json(
      { message: "Хүсэлтийн дэлгэрэнгүй мэдээллийг авч чадсангүй." },
      { status: 502 }
    );
  }
}
