"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Card,
  Tag,
  Modal,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
} from "antd";
import MainLayout from "@/app/MainLayout";
import {parseResponseBody} from "@/app/utils/response-body.mjs";

const {  Content,  } = Layout;
const { Title, Text } = Typography;

export default function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const API_BASE = process.env.BASE || "http://localhost:8088";
    //status тоог авах холболтыг функц
    const loadStatus = async () => {
      try {
        function getCookie(name) {
          return document.cookie
              .split("; ")
              .find(row => row.startsWith(name + "="))
              ?.split("=")[1];
        }

        const token = getCookie("token");

        const response = await fetch(`${API_BASE}/api/applications/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await parseResponseBody(response);

        setApprovedCount(data.accepted);
        setRejectedCount(data.rejected);
        setPendingCount(data.pending);
      } catch (error) {
        alert("status авах холболт дээр алдаа гарлаа "+error);
      }
    };
    //application авах холболт
    const loadApp = async () => {
      try {
        function getCookie(name) {
          return document.cookie
              .split("; ")
              .find(row => row.startsWith(name + "="))
              ?.split("=")[1];
        }

        const token = getCookie("token");
        const response = await fetch(`${API_BASE}/api/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await parseResponseBody(response);
        setRequests(data);
      }
      catch (e) {
        console.log("application авах холболт дээр алдаа гарлаа ",e);
      }
    }
    loadStatus();
    loadApp();

  }, []);

  return (
    <MainLayout role="student">
      <Content>
        <div className={styles.content}
        >
          <h1 className={styles.pageTitle}>
            Миний хүсэлтүүд
          </h1>

          <div className={styles.stats}>
            <div className={styles.approvedCard}>
              <div>
                <h2>{approvedCount}</h2>
                <p>Зөвшөөрөгдсөн</p>
              </div>

              <div className={styles.iconBox}>
                <CheckCircleOutlined />
              </div>
            </div>

            <div className={styles.pendingCard}>
              <div>
                <h2>{pendingCount}</h2>
                <p>Хүлээгдэж буй</p>
              </div>

              <div className={styles.iconBox}>
                <ClockCircleOutlined />
              </div>
            </div>

            <div className={styles.rejectedCard}>
              <div>
                <h2>{rejectedCount}</h2>
                <p>Татгалзсан</p>
              </div>

              <div className={styles.iconBox}>
                <CloseCircleOutlined />
              </div>
            </div>
          </div>

          {requests.map(( item, index) => (
            <Card
              key={item.id ?? item.applicationId ?? index}
              className={styles.requestCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3>{item.postTitle}</h3>
                  <p>{item.company}</p>
                </div>

                <Tag
                  color={
                    item.status === "ACCEPTED"
                      ? "success"
                      : item.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                >
                  {item.status === "ACCEPTED"
                    ? "Зөвшөөрөгдсөн"
                    : item.status === "REJECTED"
                    ? "Татгалзсан"
                    : "Хүлээгдэж буй"}
                </Tag>
              </div>

              <p className={styles.description}>
                {item.description ?? item.coverLetter}
              </p>

              <div className={styles.dateRow}>
                <span>
                  Илгээсэн: {item.submittedAt}
                </span>
              </div>
            </Card>
          ))}

          {requests.length === 0 && (
            <Card>
              <h3>Одоогоор хүсэлт илгээгээгүй байна.</h3>
            </Card>
          )}

          <Modal
            open={Boolean(selectedRequest)}
            title={null}
            footer={null}
            onCancel={() => setSelectedRequest(null)}
            width={800}
          >
            {isDetailLoading ? (
              <div className={styles.detailLoading}>
                <Spin />
              </div>
            ) : (
              selectedRequest && (() => {
                const posting = {
                  ...selectedRequest,
                  ...(selectedRequest.internshipPost ?? {}),
                  ...(selectedRequest.posting ?? {}),
                };
                const status = getStatus(selectedRequest);
                const salary = posting.isSalaryUnspecified
                  ? "Тохиролцоно"
                  : posting.salaryMin != null || posting.salaryMax != null
                    ? `${posting.salaryMin ?? 0} - ${posting.salaryMax ?? 0} ₮`
                    : posting.salary ?? selectedRequest.salary ?? "-";
                const majors = normalizeList(
                  posting.requiredMajor ?? posting.requiredMajors ?? posting.majors ?? selectedRequest.requiredMajor
                );
                const skills = normalizeList(
                  posting.requiredSkills ?? posting.skills ?? selectedRequest.requiredSkills
                );
                const languages = normalizeList(posting.languages ?? selectedRequest.languages);

                return <>
                  <Title level={3}>
                    {posting.title ?? selectedRequest.title ?? selectedRequest.internshipTitle ?? "Хүсэлтийн дэлгэрэнгүй"}
                  </Title>
                  <Link
                    className={styles.companyLink}
                    href={{
                      pathname: "/pages/student/company",
                      query: {
                        organizationId:
                          posting.organizationId ?? selectedRequest.organizationId ?? "",
                        organizationName:
                          posting.organizationName ?? selectedRequest.company ?? selectedRequest.organizationName ?? "",
                        industry: posting.industry ?? selectedRequest.industry ?? "",
                        city: posting.city ?? selectedRequest.city ?? "",
                      },
                    }}
                  >
                    {posting.organizationName ?? posting.companyName ?? posting.organization?.organizationName ?? selectedRequest.company ?? selectedRequest.organizationName ?? "-"}
                  </Link>

                  <Card className={styles.jobInfoCard}>
                    <Row gutter={[24, 24]}>
                      <Col xs={12} md={8}><Text type="secondary"><EnvironmentOutlined /> Байршил</Text><br /><Text strong>{posting.city ?? selectedRequest.posting?.city ?? selectedRequest.internshipPost?.city ?? selectedRequest.city ?? posting.location ?? selectedRequest.location ?? "-"}</Text></Col>
                      <Col xs={12} md={8}><Text type="secondary"><ClockCircleOutlined /> Цаг</Text><br /><Text strong>{posting.duration ?? selectedRequest.duration ?? "-"}</Text></Col>
                      <Col xs={12} md={8}><Text type="secondary"><DollarOutlined /> Цалин</Text><br /><Text strong>{salary}</Text></Col>
                      <Col xs={12} md={8}><Text type="secondary"><BookOutlined /> GPA</Text><br /><Text strong>{posting.minGpa ?? posting.gpa ?? selectedRequest.minGpa ?? "-"}</Text></Col>
                      <Col xs={12} md={8}><Text type="secondary"><TeamOutlined /> Орон тоо</Text><br /><Text strong>{posting.vacancyCount ?? posting.vacancies ?? selectedRequest.vacancyCount ?? "-"}</Text></Col>
                      <Col xs={12} md={8}><Text type="secondary"><CalendarOutlined /> Эцсийн хугацаа</Text><br /><Text strong>{formatDate(posting.deadline ?? selectedRequest.deadline)}</Text></Col>
                    </Row>
                  </Card>

                  <Title level={5}>Тайлбар</Title>
                  <Text>{posting.description ?? selectedRequest.jobDescription ?? selectedRequest.description ?? "-"}</Text>
                  <Divider />

                  <Title level={5}>Шаардлагатай мэргэжил</Title>
                  <div className={styles.detailTags}>{majors.length ? majors.map((item) => <Tag key={item}>{item}</Tag>) : <Text>-</Text>}</div>
                  <Title level={5}>Шаардлагатай чадвар</Title>
                  <div className={styles.detailTags}>{skills.length ? skills.map((item) => <Tag color="blue" key={item}>{item}</Tag>) : <Text>-</Text>}</div>
                  <Title level={5}>Хэл</Title>
                  <div className={styles.detailTags}>{languages.length ? languages.map((item) => <Tag color="green" key={item}>{item}</Tag>) : <Text>-</Text>}</div>
                  <Divider />

                  <Card className={styles.applicationInfoCard}>
                    <Row gutter={[24, 20]}>
                      <Col xs={24} sm={12}>
                        <Text type="secondary">Хүсэлтийн төлөв</Text><br />
                        <Tag color={status === "approved" ? "success" : status === "rejected" ? "error" : "warning"}>
                          {status === "approved" ? "Зөвшөөрөгдсөн" : status === "rejected" ? "Татгалзсан" : "Хүлээгдэж буй"}
                        </Tag>
                      </Col>
                      <Col xs={24} sm={12}><Text type="secondary">Илгээсэн огноо</Text><br /><Text strong>{formatDate(selectedRequest.submittedAt ?? selectedRequest.sentDate ?? selectedRequest.appliedAt ?? selectedRequest.createdAt)}</Text></Col>
                      <Col span={24}><Text type="secondary">Cover letter</Text><p className={styles.coverLetter}>{selectedRequest.coverLetter ?? "-"}</p></Col>
                      {selectedRequest.rejectionNote && <Col span={24}><Text type="secondary">Татгалзсан шалтгаан</Text><p className={styles.coverLetter}>{selectedRequest.rejectionNote}</p></Col>}
                    </Row>
                  </Card>
                </>;
              })()
            )}
          </Modal>
        </div>
      </Content>
    </MainLayout>

  );
}
