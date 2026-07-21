"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import {
  toStudentJob,
  withStudentJobDetail,
} from "../../../utils/student-job.mjs";
import {
  createApplicationPayload,
  getStudentIdFromResponse,
} from "../../../utils/application-payload.mjs";
import { parseResponseBody } from "../../../utils/response-body.mjs";

const { TextArea } = Input;
const { Title, Text } = Typography;

// Fix: Define API_BASE fallback or read environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function SHome({ searchText = "" }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [hasDetailLoadError, setHasDetailLoadError] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const detailRequestIdRef = useRef(0);

  useEffect(() => {
    let isSubscribed = true;

    const loadJobs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/postings`);

        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const postings = await response.json();
        if (isSubscribed) {
          setJobs(Array.isArray(postings) ? postings.map(toStudentJob) : []);
        }
      } catch (error) {
        console.error("Unable to load internship postings:", error);
        if (isSubscribed) {
          setHasLoadError(true);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job?.company?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleApply = async (job) => {
    const requestId = detailRequestIdRef.current + 1;
    detailRequestIdRef.current = requestId;

    setSelectedJob(job);
    setOpen(true);
    setIsDetailLoading(true);
    setHasDetailLoadError(false);

    try {
      const response = await fetch(`${API_BASE}/api/postings/${job.id}`);

      if (!response.ok) {
        throw new Error(`Unable to load posting detail: ${response.status}`);
      }

      const detail = await response.json();
      setSelectedJob((currentJob) =>
        currentJob?.id === job.id
          ? withStudentJobDetail(currentJob, detail)
          : currentJob
      );
    } catch (error) {
      console.error("Unable to load internship posting detail:", error);
      if (detailRequestIdRef.current === requestId) {
        setHasDetailLoadError(true);
      }
    } finally {
      if (detailRequestIdRef.current === requestId) {
        setIsDetailLoading(false);
      }
    }
  };

  const handleApplicationSubmit = async () => {
    function getCookie(name) {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
    }

    const token = getCookie("token");

    if (!token) {
      alert("Хүсэлт илгээхийн тулд эхлээд нэвтэрнэ үү.");
      return;
    }

    if (!selectedJob) {
      alert("Сонгосон зар олдсонгүй.");
      return;
    }

    setIsApplying(true);

    try {
      const idResponse = await fetch(`${API_BASE}/api/auth/myId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const idData = await parseResponseBody(idResponse);

      if (!idResponse.ok) {
        alert(idData?.message || "Оюутны ID авч чадсангүй.");
        return;
      }

      const studentId = getStudentIdFromResponse(idData);
      const payload = createApplicationPayload({
        coverLetter,
        studentId,
      });
      const applicationResponse = await fetch(
        `${API_BASE}/api/applications/${selectedJob.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const applicationData = await parseResponseBody(applicationResponse);

      if (!applicationResponse.ok) {
        alert(applicationData?.message || "Хүсэлт илгээж чадсангүй.");
        return;
      }

      alert("Хүсэлт амжилттай илгээгдлээ.");
      setCoverLetter("");
      setOpen(false);
    } catch (error) {
      console.error("Application submission failed:", error);
      alert("Хүсэлт илгээх үед алдаа гарлаа.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Санал болгох ажил</h1>

      <div className={styles.grid}>
        {!isLoading &&
          !hasLoadError &&
          filteredJobs.map((job) => (
            <div key={job.id} className={styles.card}>
              <div
                className={styles.top}
                style={{ backgroundColor: job.color || "#ece9ff" }}
              >
                <Image
                  src={job.image || "/company.jpeg"}
                  alt={job.company || "Company"}
                  width={50}
                  height={50}
                  className={styles.logo}
                />

<<<<<<< HEAD
                <h3>{job.title}</h3>
                <Link href="/pages/student/company">
                  <p>{job.company}</p>
                </Link>
=======
              <h3>{job.title}</h3> 
              {job.organizationId ? (
                <Link
                  href={{
                    pathname: "/pages/student/company",
                    query: { organizationId: job.organizationId },
                  }}
                >
                  <p>{job.company}</p>
                </Link>
              ) : (
                <p>{job.company}</p>
              )}
>>>>>>> origin/saina

                <div className={styles.tags}>
                  <span>Part Time</span>
                  <span>Internship</span>
                </div>
              </div>

              <div className={styles.bottom}>
                <span>{job.salary || "Цалин тодорхойгүй"}</span>

                <Button onClick={() => handleApply(job)}>
                  Дэлгэрэнгүй харах
                </Button>
              </div>
            </div>
          ))}
      </div>

      {isLoading && (
        <h3 className={styles.empty}>Ажлын зар ачаалж байна...</h3>
      )}

      {hasLoadError && (
        <h3 className={styles.empty}>Ажлын зарыг ачаалж чадсангүй</h3>
      )}

      {!isLoading && !hasLoadError && filteredJobs.length === 0 && (
        <h3 className={styles.empty}>Илэрц олдсонгүй</h3>
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

            {isDetailLoading && (
              <div>
                <Text type="secondary">Дэлгэрэнгүй мэдээлэл ачаалж байна...</Text>
              </div>
            )}

            {hasDetailLoadError && (
              <div>
                <Text type="danger">
                  Дэлгэрэнгүй мэдээллийг ачаалж чадсангүй.
                </Text>
              </div>
            )}

            <Card
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
                  <Text strong>{selectedJob.location || "Мэдээлэл байхгүй"}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <ClockCircleOutlined /> Цаг
                  </Text>
                  <br />
                  <Text strong>{selectedJob.duration || "Мэдээлэл байхгүй"}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <DollarOutlined /> Цалин
                  </Text>
                  <br />
                  <Text strong>{selectedJob.salary || "Мэдээлэл байхгүй"}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <BookOutlined /> GPA
                  </Text>
                  <br />
                  <Text strong>{selectedJob.gpa || "Мэдээлэл байхгүй"}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <TeamOutlined /> Орон тоо
                  </Text>
                  <br />
                  <Text strong>{selectedJob.vacancies || "Мэдээлэл байхгүй"}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <CalendarOutlined /> Эцсийн хугацаа
                  </Text>
                  <br />
                  <Text strong>{selectedJob.deadline || "Мэдээлэл байхгүй"}</Text>
                </Col>
              </Row>
            </Card>

            <Title level={5}>Тайлбар</Title>
            <Text>{selectedJob.description || "Мэдээлэл байхгүй"}</Text>

            <Divider />

            <Title level={5}>Шаардлагатай мэргэжил</Title>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {selectedJob.majors && selectedJob.majors.length > 0 ? (
                selectedJob.majors.map((item) => <Tag key={item}>{item}</Tag>)
              ) : (
                <Text type="secondary">Мэдээлэл байхгүй</Text>
              )}
            </div>

            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <>
                <Title level={5}>Шаардлагатай чадвар</Title>
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
              </>
            )}

            {selectedJob.languages && selectedJob.languages.length > 0 && (
              <>
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
              </>
            )}

            <Divider />

            <Title level={5}>Өргөдлийн захидал</Title>
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
              <Button onClick={() => setOpen(false)}>Хаах</Button>
              <Button
                type="primary"
                onClick={handleApplicationSubmit}
                loading={isApplying}
                disabled={isApplying}
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