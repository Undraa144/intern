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

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/api/postings`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Loading postings failed:", error);
    return Response.json(
      { message: "Заруудыг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}

async function createPosting(token, body) {
  return fetch(`${API_BASE}/api/postings`, {
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
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const body = await request.text();
    let response = await createPosting(token, body);

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
      response = await createPosting(token, body);
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
      },
    });
  } catch (error) {
    console.error("Posting creation failed:", error);
    return Response.json(
      { message: "Зарыг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}
