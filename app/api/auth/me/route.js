import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

async function getCurrentUser(token) {
  return fetch(`${API_BASE}/api/users/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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

  if (!response.ok || !data.token) {
    return null;
  }

  return data.token;
}

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json(
      { error: "Unauthorized", message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    let response = await getCurrentUser(token);

    if (response.status === 401) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("token");
        const data = await response.json().catch(() => ({}));
        return Response.json(data, { status: 401 });
      }

      token = refreshedToken;
      cookieStore.set("token", token, cookieOptions);
      response = await getCurrentUser(token);

      if (response.status === 401) {
        cookieStore.delete("token");
      }
    }

    const data = await response.json().catch(() => ({}));
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("User backend request failed:", error);
    return Response.json(
      { message: "Backend сервертэй холбогдож чадсангүй." },
      { status: 502 }
    );
  }
}
