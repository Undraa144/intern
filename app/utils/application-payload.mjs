const toPositiveInteger = (value) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  return Number.isInteger(numericValue) && numericValue > 0
    ? numericValue
    : null;
};

export function getStudentIdFromResponse(response) {
  if (response && typeof response === "object") {
    return toPositiveInteger(response.studentId ?? response.id);
  }

  return toPositiveInteger(response);
}

export function createApplicationPayload({
  coverLetter,
  studentId,
}) {
  const normalizedCoverLetter = coverLetter.trim();
  const normalizedStudentId = toPositiveInteger(studentId);

  if (!normalizedCoverLetter) {
    throw new Error("A cover letter is required.");
  }

  if (!normalizedStudentId) {
    throw new Error("A valid student ID is required.");
  }

  return {
    coverLetter: normalizedCoverLetter,
    studentId: normalizedStudentId,
  };
}
