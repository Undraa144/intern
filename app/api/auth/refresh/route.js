import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE || "http://localhost:8088";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return Response.json(
      { error: "Unauthorized", message: "Нэвтрэх шаардлагатай." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.token) {
      cookieStore.delete("auth_token");
      return Response.json(data, { status: response.status || 401 });
    }

    cookieStore.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Token refresh request failed:", error);
    return Response.json(
      { message: "Backend сервертэй холбогдож чадсангүй." },
      { status: 502 }
    );
  }
}
