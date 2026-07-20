"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Modal,
  Input,
  Button,
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  message,
} from "antd";

import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

import styles from "./shome.module.scss";

const { TextArea } = Input;
const { Title, Text } = Typography;

const cardColors = [
  "#ece9ff",
  "#e9faf6",
  "#fff0e6",
  "#fdf0f5",
  "#e8f6ff",
  "#fff0f8",
  "#f3f6fb",
  "#fff3d9",
];

function normalizeList(value) {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : value
        ? [value]
        : [];

  return items
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : item.name ?? item.majorName ?? item.title ?? ""
    )
    .filter(Boolean);
}

const jobs = [
    {
    company: "Instagram",
    title: "Marketing",
    image: "/company.jpeg",
    color: "#ece9ff",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Unitel",
    title: "IT engineer",
    image: "/company.jpeg",
    color: "#e9faf6",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "MSC",
    title: "Design",
    image: "/company.jpeg",
    color: "#fff0e6",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Khan Bank",
    title: "Finance",
    image: "/company.jpeg",
    color: "#fdf0f5",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Ub Даатгал ",
    title: "Human Resource",
    image: "/company.jpeg",
    color: "#e8f6ff",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },

  {
    company: "DataTex Солюшнс",
    title: "Data Analysis",
    image: "/company.jpeg",
    color: "#fff0f8",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
  {
    company: "Google",
    title: "Software Engineer ",
    image: "/company.jpeg",
    color: "#f3f6fb",
    location: "Улаанбаатар",
    duration: "30 цаг / 7 хоног",
    salary: "1,200,000 ₮",
    gpa: "3.00",
    vacancies: "2",
    deadline: "2026.08.01",
    description:
      "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
    majors: ["Програм хангамж"],
    skills: ["React", "Next.js", "Node.js"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Slack",
    title: "Project Manager ",
    image: "/company.jpeg",
    color: "#fff3d9",
    location: "Улаанбаатар",
    duration: "30 цаг / 7 хоног",
    salary: "1,200,000 ₮",
    gpa: "3.00",
    vacancies: "2",
    deadline: "2026.08.01",
    description:
      "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
    majors: ["Програм хангамж"],
    skills: ["React", "Next.js", "Node.js"],
    languages: ["Монгол", "Англи"],
  },
];

export default function SHome({ searchText = "" }) {
  
const router = useRouter();
const [coverLetter, setCoverLetter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [postings, setPostings] = useState(jobs);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPostings = async () => {
      try {
        const endpoint = searchText
          ? `/api/postings/search/${encodeURIComponent(searchText)}`
          : "/api/postings";
        const response = await fetch(endpoint, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Заруудыг ачаалж чадсангүй.");
        }

        const payload = Array.isArray(data)
          ? data
          : data.content ?? data.postings ?? data.data ?? [];
        const list = Array.isArray(payload) ? payload : [];

        if (!cancelled) {
          setPostings(
            list.map((posting, index) => ({
              ...posting,
              internshipPostId:
                posting.internshipPostId ??
                posting.postingId ??
                posting.id,
              id:
                posting.internshipPostId ??
                posting.postingId ??
                posting.id ??
                index,
              company:
                posting.organizationName ??
                posting.companyName ??
                posting.company ??
                posting.organization?.organizationName ??
                posting.organization?.name ??
                "Байгууллагын нэр байхгүй",
              image: "/company.jpeg",
              color: cardColors[index % cardColors.length],
              location: posting.city ?? posting.location ?? "-",
              salary: posting.isSalaryUnspecified
                ? "Тохиролцоно"
                : `${posting.salaryMin ?? 0} - ${posting.salaryMax ?? 0} ₮`,
              gpa: posting.minGpa ?? posting.gpa ?? "-",
              vacancies: posting.vacancyCount ?? posting.vacancies ?? "-",
              deadline: posting.deadline ?? "-",
              majors: normalizeList(
                posting.requiredMajor ??
                  posting.requiredMajors ??
                  posting.majors
              ),
              skills: normalizeList(
                posting.requiredSkills ?? posting.skills
              ),
              languages: normalizeList(posting.languages),
            }))
          );
        }
      } catch (error) {
        message.error(error.message || "Заруудыг ачаалж чадсангүй.");
      }
    };

    loadPostings();
    return () => {
      cancelled = true;
    };
  }, [searchText]);

  const filteredJobs = postings;

  const handleApply = async (job) => {
    setSelectedJob(job);
    setOpen(true);
    setIsLoadingDetail(true);

    try {
      const internshipPostId = job.internshipPostId ?? job.id;
      const response = await fetch(`/api/postings/${internshipPostId}`, {
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Зарын дэлгэрэнгүйг ачаалж чадсангүй.");
      }

      const detail = data.data ?? data.posting ?? data;
      setSelectedJob({
        ...job,
        ...detail,
        internshipPostId:
          detail.internshipPostId ??
          detail.postingId ??
          job.internshipPostId ??
          job.id,
        company:
          detail.organizationName ??
          detail.companyName ??
          detail.company ??
          detail.organization?.organizationName ??
          detail.organization?.name ??
          job.company,
        location: detail.city ?? detail.location ?? job.location,
        salary: detail.isSalaryUnspecified
          ? "Тохиролцоно"
          : detail.salaryMin != null || detail.salaryMax != null
            ? `${detail.salaryMin ?? 0} - ${detail.salaryMax ?? 0} ₮`
            : job.salary,
        gpa: detail.minGpa ?? detail.gpa ?? job.gpa,
        vacancies:
          detail.vacancyCount ?? detail.vacancies ?? job.vacancies,
        deadline: detail.deadline ?? job.deadline,
        majors: normalizeList(
          detail.requiredMajor ??
            detail.requiredMajors ??
            detail.majors ??
            job.majors
        ),
        skills: normalizeList(
          detail.requiredSkills ?? detail.skills ?? job.skills
        ),
        languages: normalizeList(detail.languages ?? job.languages),
      });
    } catch (error) {
      message.error(error.message || "Зарын дэлгэрэнгүйг ачаалж чадсангүй.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim()) {
      message.warning("Өргөдлийн захидлаа оруулна уу.");
      return;
    }

    setIsApplying(true);

    try {
      const userResponse = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      const userData = await userResponse.json().catch(() => ({}));

      if (!userResponse.ok) {
        throw new Error(userData.message || "Оюутны мэдээллийг авч чадсангүй.");
      }

      const user = userData.data ?? userData.user ?? userData;

      if (user.role && user.role !== "STUDENT") {
        throw new Error("Зөвхөн оюутны эрхээр хүсэлт илгээх боломжтой.");
      }

      let studentId = user.studentId ?? user.student?.id ?? "";

      if (!studentId) {
        const profileResponse = await fetch("/api/students/profile", {
          credentials: "include",
          cache: "no-store",
        });
        const profileData = await profileResponse.json().catch(() => ({}));

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Оюутны профайлын ID-г авч чадсангүй."
          );
        }

        const student =
          profileData.data ?? profileData.student ?? profileData.profile ?? profileData;
        studentId = student.studentId ?? student.id ?? "";
      }

      if (!studentId) {
        throw new Error("Оюутны ID олдсонгүй.");
      }

      const internshipPostId = selectedJob.internshipPostId ?? selectedJob.id;

      if (internshipPostId == null) {
        throw new Error("Дадлагын зарын ID олдсонгүй.");
      }

      const response = await fetch(
        `/api/applications/${encodeURIComponent(internshipPostId)}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coverLetter: coverLetter.trim(),
            studentId,
          }),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Хүсэлт илгээхэд алдаа гарлаа.");
      }

      message.success("Хүсэлт амжилттай илгээгдлээ.");
      setCoverLetter("");
      setOpen(false);
      router.push("/pages/student/request");
    } catch (error) {
      message.error(error.message || "Хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Санал болгох ажил</h1>

      <div className={styles.grid}>
        {filteredJobs.map((job) => (
          <div key={job.id ?? `${job.company}-${job.title}`} className={styles.card}>
            <div
              className={styles.top}
              style={{ backgroundColor: job.color }}
            >
              <Image
                src={job.image}
                alt={job.company}
                width={50}
                height={50}
                className={styles.logo}
              />

              <h3>{job.title}</h3> 
              <Link href="/pages/student/company"><p>{job.company}</p></Link>

              <div className={styles.tags}>
                {(job.majors.length > 0
                  ? job.majors.slice(0, 3)
                  : ["Мэргэжил заагаагүй"]
                ).map((major) => (
                  <span key={major}>{major}</span>
                ))}
              </div>
            </div>

            <div className={styles.bottom}>
              <span>{job.salary}</span>
              
              <Button 
              onClick={() => handleApply(job)}>
                Дэлэгрэнгүй харах
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <h3 className={styles.empty}>
          Илэрц олдсонгүй
        </h3>
      )}

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={800}
        title={null}
      >
        {selectedJob && (
          <>
            <Title level={3}>
              {selectedJob.title}
            </Title>

            <Text type="secondary">
              {selectedJob.company}
            </Text>

            <Card
              loading={isLoadingDetail}
              style={{
                marginTop: 20,
                marginBottom: 20,
                background: "#f7f9fc",
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={8}>
                  <Text type="secondary">
                    <EnvironmentOutlined /> Байршил
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.location}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <ClockCircleOutlined /> Цаг
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.duration}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <DollarOutlined /> Цалин
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.salary}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <BookOutlined /> GPA
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.gpa}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <TeamOutlined /> Орон тоо
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.vacancies}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <CalendarOutlined /> Эцсийн хугацаа
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.deadline}
                  </Text>
                </Col>
              </Row>
            </Card>

            <Title level={5}>Тайлбар</Title>

            <Text>
              {selectedJob.description}
            </Text>

            <Divider />

            <Title level={5}>
              Шаардлагатай мэргэжил
            </Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {selectedJob.majors.map((item) => (
                <Tag key={item}>
                  {item}
                </Tag>
              ))}
            </div>

            <Title level={5}>
              Шаардлагатай чадвар
            </Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {selectedJob.skills.map((item) => (
                <Tag color="blue" key={item}>
                  {item}
                </Tag>
              ))}
            </div>

            <Title level={5}>Хэл</Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {selectedJob.languages.map((item) => (
                <Tag color="green" key={item}>
                  {item}
                </Tag>
              ))}
            </div>

            <Divider />

            <Title level={5}>
              Өргөдлийн захидал
            </Title>

            <TextArea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Яагаад энэ дадлагад тохирох талаараа бичнэ үү..."
            />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 24,
                    }}
                  >
                    <Button onClick={() => setOpen(false)}>
                      Хаах
                    </Button>

            <Button
              type="primary"
              loading={isApplying}
              onClick={handleSubmitApplication}
            >
              Хүсэлт илгээх
            </Button>
                  </div>
                </>
              )}
      </Modal>
    </section>
  );
}
