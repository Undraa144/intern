export async function updateStudentProfile({
  payload,
  fetchImplementation = fetch,
}) {
  const response = await fetchImplementation("/api/students/profile", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Profile update failed");
  }

  return response;
}

export async function uploadStudentResume({
  file,
  fetchImplementation = fetch,
}) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetchImplementation("/api/students/profile/cv", {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Resume upload failed");
  }

  return response;
}
