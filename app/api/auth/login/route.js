const API_BASE = process.env.API_BASE || "http://localhost:8088";

export async function POST(request) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Login backend request failed:", error);
    return Response.json(
      { message: "Backend сервертэй холбогдож чадсангүй." },
      { status: 502 }
    );
  }
}
