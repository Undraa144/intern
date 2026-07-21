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

function isValidId(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function getStudentAverageRate(token, studentId) {
  return fetch(
    `${API_BASE}/api/studentReview/avg/${encodeURIComponent(studentId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
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

function proxyResponse(response, body) {
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(_request, { params }) {
  const { studentId } = await params;

  if (!isValidId(studentId)) {
    return Response.json(
      { message: "Оюутны ID буруу байна." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  let token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    let response = await getStudentAverageRate(token, studentId);

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
      response = await getStudentAverageRate(token, studentId);
    }

    if (response.status === 401) {
      cookieStore.delete("token");
    }

    return proxyResponse(response, await response.text());
  } catch (error) {
    console.error("Student average rate request failed:", error);
    return Response.json(
      { message: "Оюутны үнэлгээний голчийг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}
