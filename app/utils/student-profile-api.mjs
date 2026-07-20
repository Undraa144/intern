export async function updateStudentProfile({
  baseApi,
  token,
  payload,
  fetchImplementation = fetch,
}) {
  const response = await fetchImplementation(`${baseApi}/api/students/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Profile update failed");
  }

  return response;
}
