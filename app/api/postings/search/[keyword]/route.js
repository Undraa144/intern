const API_BASE = process.env.API_BASE || "http://localhost:8088";

export async function GET(_request, { params }) {
  const { keyword } = await params;

  try {
    const response = await fetch(
      `${API_BASE}/api/postings/search/${encodeURIComponent(keyword)}`,
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
    console.error("Searching postings failed:", error);
    return Response.json(
      { message: "Зарын хайлтыг серверээс авч чадсангүй." },
      { status: 502 }
    );
  }
}
