const formatMoney = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat("en-US").format(value);
};

const formatSalary = (minimum, maximum) => {
  const minimumSalary = formatMoney(minimum);
  const maximumSalary = formatMoney(maximum);

  return minimumSalary && maximumSalary
    ? `${minimumSalary} - ${maximumSalary} ₮`
    : null;
};

const toStringList = (values) =>
  Array.isArray(values)
    ? values.filter((value) => typeof value === "string")
    : [];

const formatGpa = (gpa) =>
  typeof gpa === "number" && Number.isFinite(gpa) ? gpa.toFixed(2) : null;

const formatDeadline = (deadline) =>
  typeof deadline === "string" ? deadline.split("T")[0] : null;

export function toStudentJob(posting) {
  return {
    id: posting.internshipPostId,
    company: posting.organizationName || "Мэдээлэл байхгүй",
    industry: posting.industry || null,
    title: posting.title || "Мэдээлэл байхгүй",
    image: "/company.jpeg",
    location: posting.city || null,
    salary: formatSalary(posting.salaryMin, posting.salaryMax),
    majors: toStringList(posting.requiredMajor),
    status: posting.status || null,
    duration: null,
    gpa: null,
    vacancies: null,
    deadline: null,
    description: null,
    skills: [],
    languages: [],
  };
}

export function withStudentJobDetail(job, detail) {
  const detailSalary = formatSalary(detail.salaryMin, detail.salaryMax);
  const detailMajors = toStringList(detail.requiredMajors);
  const detailSkills = toStringList(detail.requiredSkills);

  return {
    ...job,
    id: detail.internshipPostId ?? job.id,
    title: detail.title || job.title,
    description: detail.description || null,
    duration: detail.duration ?? job.duration,
    majors: detailMajors.length > 0 ? detailMajors : job.majors,
    gpa: formatGpa(detail.minGpa),
    skills: detailSkills,
    salary: detailSalary || job.salary,
    vacancies: detail.vacancyCount ?? null,
    deadline: formatDeadline(detail.deadline),
    status: detail.status || job.status,
  };
}
