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

async function createReview(organizationId, token, body) {
  return fetch(
    `${API_BASE}/api/reviews/${encodeURIComponent(organizationId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getBearerToken(token)}`,
      },
      body,
      cache: "no-store",
    }
  );
}

async function updateReview(organizationReviewId, token, body) {
  return fetch(`${API_BASE}/api/reviews/${encodeURIComponent(organizationReviewId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getBearerToken(token)}`,
    },
    body,
    cache: "no-store",
  });
}

async function deleteReview(organizationReviewId, token) {
  return fetch(`${API_BASE}/api/reviews/${encodeURIComponent(organizationReviewId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getBearerToken(token)}` },
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

async function getCurrentStudentId(token) {
  const response = await fetch(`${API_BASE}/api/auth/myId`, {
    headers: { Authorization: `Bearer ${getBearerToken(token)}` },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  const studentId = Number(
    payload?.studentId ?? payload?.data?.studentId ?? payload?.id ?? payload
  );

  return response.ok && Number.isInteger(studentId) && studentId > 0
    ? studentId
    : null;
}

async function ownsReview(token, organizationId, organizationReviewId) {
  if (!organizationId) return false;

  const [studentId, reviewsResponse] = await Promise.all([
    getCurrentStudentId(token),
    fetch(
      `${API_BASE}/api/reviews/org/${encodeURIComponent(organizationId)}`,
      { cache: "no-store" }
    ),
  ]);

  if (!studentId || !reviewsResponse.ok) return false;

  const payload = await reviewsResponse.json().catch(() => []);
  const reviews = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.reviews ?? [];

  return Array.isArray(reviews) && reviews.some((review) => {
    const reviewId = review.organizationReviewId ?? review.id;
    const ownerId = review.studentId ?? review.student?.studentId;

    return (
      String(reviewId) === String(organizationReviewId) &&
      Number(ownerId) === studentId
    );
  });
}

export async function POST(request, { params }) {
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json(
      { message: "Үнэлгээ өгөхийн тулд эхлээд нэвтэрнэ үү." },
      { status: 401 }
    );
  }

  try {
    const { organizationId } = await params;
    const payload = await request.json();
    const rating = Number(payload.rating);
    const comment = payload.comment?.trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      return Response.json(
        { message: "1-5 одны үнэлгээ болон сэтгэгдлээ оруулна уу." },
        { status: 400 }
      );
    }

    const body = JSON.stringify({
      rating,
      comment,
      isAnonymous: Boolean(payload.isAnonymous),
    });

    let response = await createReview(organizationId, token, body);

    if (response.status === 401 || response.status === 403) {
      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json(
          { message: "Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү." },
          { status: 401 }
        );
      }

      token = getBearerToken(refreshedToken);
      cookieStore.set("token", token, cookieOptions);
      response = await createReview(organizationId, token, body);
    }

    if (response.status === 401 || response.status === 403) {
      cookieStore.delete("token");
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
    console.error("Review creation failed:", error);
    return Response.json(
      { message: "Үнэлгээг серверт илгээж чадсангүй." },
      { status: 502 }
    );
  }
}

export async function PUT(request, { params }) {
  const { organizationId: organizationReviewId } = await params;
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const rating = Number(payload.rating);
    const comment = payload.comment?.trim();
    const organizationId = payload.organizationId;

    if (!organizationReviewId || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      return Response.json(
        { message: "Үнэлгээний ID, 1-5 од болон сэтгэгдэлээ оруулна уу." },
        { status: 400 }
      );
    }

    if (!(await ownsReview(token, organizationId, organizationReviewId))) {
      return Response.json(
        { message: "Зөвхөн өөрийн өгсөн үнэлгээг засах боломжтой." },
        { status: 403 }
      );
    }

    const body = JSON.stringify({
      rating,
      comment,
      isAnonymous: Boolean(payload.isAnonymous),
    });
    let response = await updateReview(organizationReviewId, token, body);

    if (response.status === 401 || response.status === 403) {
      const refreshedToken = await refreshAccessToken(token);
      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json({ message: "Нэвтрэх хугацаа дууссан байна." }, { status: 401 });
      }
      token = getBearerToken(refreshedToken);
      cookieStore.set("token", token, cookieOptions);
      response = await updateReview(organizationReviewId, token, body);
    }

    if (response.status === 401 || response.status === 403) {
      cookieStore.delete("token");
    }
    const responseBody = await response.text();
    const hasNoBody = [204, 205, 304].includes(response.status);

    return new Response(hasNoBody ? null : responseBody, {
      status: response.status,
      headers: hasNoBody
        ? undefined
        : {
            "Content-Type":
              response.headers.get("content-type") ||
              "text/plain; charset=utf-8",
          },
    });
  } catch (error) {
    console.error("Review update failed:", error);
    return Response.json({ message: "Үнэлгээг засаж чадсангүй." }, { status: 502 });
  }
}

export async function DELETE(request, { params }) {
  const { organizationId: organizationReviewId } = await params;
  const cookieStore = await cookies();
  let token = getBearerToken(cookieStore.get("token")?.value);

  if (!token) {
    return Response.json({ message: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const payload = await request.json().catch(() => ({}));

    if (
      !(await ownsReview(
        token,
        payload.organizationId,
        organizationReviewId
      ))
    ) {
      return Response.json(
        { message: "Зөвхөн өөрийн өгсөн үнэлгээг устгах боломжтой." },
        { status: 403 }
      );
    }

    let response = await deleteReview(organizationReviewId, token);

    if (response.status === 401 || response.status === 403) {
      const refreshedToken = await refreshAccessToken(token);
      if (!refreshedToken) {
        cookieStore.delete("token");
        return Response.json({ message: "Нэвтрэх хугацаа дууссан байна." }, { status: 401 });
      }
      token = getBearerToken(refreshedToken);
      cookieStore.set("token", token, cookieOptions);
      response = await deleteReview(organizationReviewId, token);
    }

    if (response.status === 401 || response.status === 403) {
      cookieStore.delete("token");
    }
    const responseBody = await response.text();
    const hasNoBody = [204, 205, 304].includes(response.status);

    return new Response(hasNoBody ? null : responseBody, {
      status: response.status,
      headers: hasNoBody
        ? undefined
        : {
            "Content-Type":
              response.headers.get("content-type") ||
              "text/plain; charset=utf-8",
          },
    });
  } catch (error) {
    console.error("Review delete failed:", error);
    return Response.json({ message: "Үнэлгээг устгаж чадсангүй." }, { status: 502 });
  }
}
