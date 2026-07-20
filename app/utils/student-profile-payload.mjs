function requireText(value, fieldName) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(`${fieldName} оруулна уу.`);
  }

  return text;
}

function splitCommaSeparatedValues(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildStudentProfilePayload(profile) {
  const nameParts = requireText(profile.fullName, "Овог нэр").split(/\s+/);

  if (nameParts.length < 2) {
    throw new Error("Овог нэрээ бүтнээр нь оруулна уу.");
  }

  const courseYear = Number(profile.courseYear);
  const gpa = Number(profile.gpa);
  const phoneText = String(profile.phone ?? "").trim();

  if (!Number.isInteger(courseYear) || courseYear < 1 || courseYear > 10) {
    throw new Error("Курсийн жил 1-10 хооронд байх ёстой.");
  }

  if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4) {
    throw new Error("GPA 0-4 хооронд байх ёстой.");
  }

  if (!/^\d{8}$/.test(phoneText)) {
    throw new Error("Утасны дугаар 8 оронтой байх ёстой.");
  }

  const [firstName, ...lastNameParts] = nameParts;

  return {
    firstName,
    lastName: lastNameParts.join(" "),
    major: requireText(profile.major, "Мэргэжил"),
    university: requireText(profile.university, "Сургууль"),
    courseYear,
    gpa,
    phone: Number(phoneText),
    shortBio: String(profile.bio ?? "").trim(),
    skills: splitCommaSeparatedValues(profile.skills),
    languages: splitCommaSeparatedValues(profile.languages),
  };
}
