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

function getTeacherProfile(token) {
  return fetch(`${API_BASE}/api/teacher/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

function updateTeacherProfile(token) {
  return fetch(`${API_BASE}/api/teacher/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
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

export async function GET() {
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    let response = await getTeacherProfile(token);

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
      response = await getTeacherProfile(token);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Teacher profile request failed:", error);
    return Response.json(
      { message: "Багшийн профайлыг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}

export async function PUT() {
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    let response = await updateTeacherProfile(token);

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
      response = await updateTeacherProfile(token);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Teacher profile update failed:", error);
    return Response.json(
      { message: "Багшийн профайлыг серверт хадгалж чадсангүй." },
      { status: 502 }
    );
  }
}
