"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Tag,
  Typography,
  message,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styles from "./home3.module.scss";

const { Title, Text } = Typography;
//
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

function normalizeMajors(value) {
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

export default function Home3({ searchText = "" }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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
        const postings = Array.isArray(payload) ? payload : [];
        let allPostings = [];

        if (searchText) {
          const allResponse = await fetch("/api/postings", {
            cache: "no-store",
          });
          const allData = await allResponse.json().catch(() => ({}));
          const allPayload = Array.isArray(allData)
            ? allData
            : allData.content ?? allData.postings ?? allData.data ?? [];
          allPostings = Array.isArray(allPayload) ? allPayload : [];
        }

        if (!cancelled) {
          setJobs(
            postings.map((posting, index) => {
              const postingId =
                posting.id ?? posting.postingId ?? posting.internshipPostId;
              const fullPosting = allPostings.find(
                (item) =>
                  (item.id ?? item.postingId ?? item.internshipPostId) ===
                  postingId
              );

              return {
              ...posting,
              id:
                postingId ?? index,
              company:
                posting.organizationName ??
                posting.companyName ??
                posting.company ??
                posting.organization?.organizationName ??
                posting.organization?.name ??
                fullPosting?.organizationName ??
                fullPosting?.companyName ??
                fullPosting?.company ??
                fullPosting?.organization?.organizationName ??
                fullPosting?.organization?.name ??
                "Байгууллагын нэр байхгүй",
              image: "/company.jpeg",
              color: cardColors[index % cardColors.length],
              majors: normalizeMajors(
                posting.requiredMajors ??
                  posting.majors ??
                  posting.majorNames ??
                  posting.requiredMajor
              ),
              skills: normalizeMajors(
                posting.requiredSkills ?? posting.skills
              ),
              location: posting.city ?? posting.location ?? "-",
              vacancies: posting.vacancyCount ?? posting.vacancies ?? "-",
              gpa: posting.minGpa ?? posting.gpa ?? "-",
              deadline: posting.deadline ?? "-",
              salary: posting.isSalaryUnspecified
                ? "Тохиролцоно"
                : `${posting.salaryMin ?? 0} - ${posting.salaryMax ?? 0} ₮`,
              };
            })
          );
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setJobs([]);
      }
    };

    loadPostings();
    return () => {
      cancelled = true;
    };
  }, [searchText]);

  const filteredJobs = jobs;

  const handleView = async (job) => {
    setSelectedJob(job);
    setOpen(true);
    setIsLoadingDetail(true);

    try {
      const response = await fetch(`/api/postings/${job.id}`, {
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
        id:
          detail.id ??
          detail.postingId ??
          detail.internshipPostId ??
          job.id,
        company:
          detail.organizationName ??
          detail.companyName ??
          detail.company ??
          detail.organization?.organizationName ??
          detail.organization?.name ??
          job.company,
        majors: normalizeMajors(
          detail.requiredMajors ??
            detail.majors ??
            detail.majorNames ??
            detail.requiredMajor ??
            job.majors
        ),
        skills: normalizeMajors(
          detail.requiredSkills ?? detail.skills ?? job.skills
        ),
        location: detail.city ?? detail.location ?? job.location,
        vacancies:
          detail.vacancyCount ?? detail.vacancies ?? job.vacancies,
        gpa: detail.minGpa ?? detail.gpa ?? job.gpa,
        deadline: detail.deadline ?? job.deadline,
        salary: detail.isSalaryUnspecified
          ? "Тохиролцоно"
          : detail.salaryMin != null || detail.salaryMax != null
            ? `${detail.salaryMin ?? 0} - ${detail.salaryMax ?? 0} ₮`
            : job.salary,
      });
    } catch (error) {
      message.error(error.message || "Зарын дэлгэрэнгүйг ачаалж чадсангүй.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Санал болгох ажил</h1>

      <div className={styles.grid}>
        {filteredJobs.map((job) => (
          <div key={job.id} className={styles.card}>
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

              <p>{job.company}</p>

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

              <Button onClick={() => handleView(job)}>
                Дэлгэрэнгүй харах
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>
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
            <Title level={3}>{selectedJob.title}</Title>
            <Text type="secondary">{selectedJob.company}</Text>

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
                  <Text strong>{selectedJob.location}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <DollarOutlined /> Цалин
                  </Text>
                  <br />
                  <Text strong>{selectedJob.salary}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <BookOutlined /> GPA
                  </Text>
                  <br />
                  <Text strong>{selectedJob.gpa}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <TeamOutlined /> Орон тоо
                  </Text>
                  <br />
                  <Text strong>{selectedJob.vacancies}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <CalendarOutlined /> Эцсийн хугацаа
                  </Text>
                  <br />
                  <Text strong>{selectedJob.deadline}</Text>
                </Col>
              </Row>
            </Card>

            <Title level={5}>Тайлбар</Title>
            <Text>{selectedJob.description || "Тайлбар оруулаагүй."}</Text>

            <Divider />
            <Title level={5}>Шаардлагатай мэргэжил</Title>
            <div className={styles.modalTags}>
              {selectedJob.majors.map((major) => (
                <Tag key={major}>{major}</Tag>
              ))}
            </div>

            {selectedJob.skills.length > 0 && (
              <>
                <Title level={5}>Шаардлагатай чадвар</Title>
                <div className={styles.modalTags}>
                  {selectedJob.skills.map((skill) => (
                    <Tag color="blue" key={skill}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </>
            )}

            <div className={styles.modalFooter}>
              <Button onClick={() => setOpen(false)}>Хаах</Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
