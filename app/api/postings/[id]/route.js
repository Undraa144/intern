import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

function normalizeToken(value) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${API_BASE}/api/postings/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Loading posting details failed:", error);
    return Response.json(
      { message: "Зарын дэлгэрэнгүй мэдээллийг авч чадсангүй." },
      { status: 502 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(
      `${API_BASE}/api/postings/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
        cache: "no-store",
      }
    );
    const responseBody = await response.text();

    return new Response(responseBody || null, {
      status: response.status,
      headers: responseBody
        ? {
            "Content-Type":
              response.headers.get("content-type") || "text/plain",
          }
        : undefined,
    });
  } catch (error) {
    console.error("Posting update failed:", error);
    return Response.json(
      { message: "Зарыг шинэчилж чадсангүй." },
      { status: 502 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = normalizeToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const body = await request.text();
    const response = await fetch(
      `${API_BASE}/api/postings/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          ...(body ? { "Content-Type": "text/plain" } : {}),
          Authorization: `Bearer ${token}`,
        },
        ...(body ? { body } : {}),
        cache: "no-store",
      }
    );
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
      },
    });
  } catch (error) {
    console.error("Posting deletion failed:", error);
    return Response.json(
      { message: "Зарыг серверээс устгаж чадсангүй." },
      { status: 502 }
    );
  }
}
