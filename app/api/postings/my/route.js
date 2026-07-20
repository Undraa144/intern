import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

function normalizeToken(value) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

async function getMyPostings(token) {
  return fetch(`${API_BASE}/api/postings/my`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = normalizeToken(cookieStore.get("auth_token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const response = await getMyPostings(token);
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Loading company postings failed:", error);
    return Response.json(
      { message: "Миний заруудыг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}
