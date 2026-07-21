import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/myId`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    console.error("Student ID request failed:", error);
    return Response.json({ message: "Оюутны ID-г авч чадсангүй." }, { status: 502 });
  }
}
