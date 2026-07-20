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

function createApplication(token, body, path = "applicatioins") {
  return fetch(`${API_BASE}/api/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
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

export async function POST(request) {
  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("auth_token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const body = await request.text();
    let response = await createApplication(token, body);

    if (response.status === 401 || response.status === 404) {
      const correctlySpelledResponse = await createApplication(
        token,
        body,
        "applications"
      );

      if (correctlySpelledResponse.status !== 404) {
        response = correctlySpelledResponse;
      }
    }

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
      response = await createApplication(token, body);

      if (response.status === 401 || response.status === 404) {
        const correctlySpelledResponse = await createApplication(
          token,
          body,
          "applications"
        );

        if (correctlySpelledResponse.status !== 404) {
          response = correctlySpelledResponse;
        }
      }
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Application creation failed:", error);
    return Response.json(
      { message: "Хүсэлтийг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}
