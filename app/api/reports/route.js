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

async function getReports(token) {
  return fetch(`${API_BASE}/api/reports`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getBearerToken(token)}`,
    },
    cache: "no-store",
  });
}

async function createReport(token, body) {
  return fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getBearerToken(token)}`,
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

  return response.ok ? data.token : null;
}

export async function GET() {
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    let response = await getReports(token);

    if (response.status === 401) {
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
      response = await getReports(token);
    }

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Reports fetch failed:", error);
    return Response.json(
      { message: "Тайлангийн жагсаалтыг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();

    if (!payload.title?.trim() || !payload.description?.trim()) {
      return Response.json(
        { message: "Тайлангийн гарчиг болон тайлбарыг оруулна уу." },
        { status: 400 }
      );
    }

    const body = JSON.stringify({
      title: payload.title.trim(),
      description: payload.description.trim(),
    });

    let response = await createReport(token, body);

    if (response.status === 401) {
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
      response = await createReport(token, body);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
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
    console.error("Report creation failed:", error);
    return Response.json(
      { message: "Тайлангийн мэдээллийг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}
