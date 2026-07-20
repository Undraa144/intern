import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

export async function POST(request) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    if (!data.token) {
      return Response.json(
        { message: "Login response-д token ирсэнгүй." },
        { status: 502 }
      );
    }

    const cookieStore = await cookies();
    const token = String(data.token)
      .trim()
      .replace(/^['"]|['"]$/g, "")
      .replace(/^Bearer\s+/i, "")
      .trim();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Login backend request failed:", error);
    return Response.json(
      { message: "Backend сервертэй холбогдож чадсангүй." },
      { status: 502 }
    );
  }
}
