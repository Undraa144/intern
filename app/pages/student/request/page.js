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

const {  Content,  } = Layout;
const { Title, Text } = Typography;

export default function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadRequests() {
      try {
        const [response, postingsResponse] = await Promise.all([
          fetch("/api/students/application", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/postings", { cache: "no-store" }),
        ]);
        const result = await response.json().catch(() => ({}));
        const postingsResult = await postingsResponse.json().catch(() => ([]));

        if (!response.ok) {
          throw new Error(result.message || "Хүсэлтийн жагсаалтыг авч чадсангүй.");
        }

        const applications = Array.isArray(result)
          ? result
          : result.data ?? result.applications ?? result.content ?? [];
        const postings = Array.isArray(postingsResult)
          ? postingsResult
          : postingsResult.data ??
            postingsResult.postings ??
            postingsResult.content ??
            [];
        const postingsById = new Map(
          (Array.isArray(postings) ? postings : []).map((posting) => [
            String(posting.internshipPostId ?? posting.postingId ?? posting.id),
            posting,
          ])
        );

        const requestsWithPosting = await Promise.all(
          (Array.isArray(applications) ? applications : []).map(
            async (application) => {
              const listPosting = postingsById.get(
                String(
                  application.internshipPostId ??
                    application.postingId ??
                    application.internshipPost?.internshipPostId ??
                    application.posting?.internshipPostId
                )
              );

              if (application.applicationId == null) {
                return {
                  ...application,
                  posting: listPosting ?? application.posting,
                  title: listPosting?.title ?? application.title,
                  company:
                    listPosting?.organizationName ?? application.company,
                };
              }

              try {
                const detailResponse = await fetch(
                  `/api/students/application/${encodeURIComponent(application.applicationId)}`,
                  { cache: "no-store" }
                );
                const detailResult = await detailResponse.json().catch(() => ({}));

                if (!detailResponse.ok) {
                  return {
                    ...application,
                    posting: listPosting ?? application.posting,
                    title: listPosting?.title ?? application.title,
                    company:
                      listPosting?.organizationName ?? application.company,
                  };
                }

                const detail =
                  detailResult.data ?? detailResult.application ?? detailResult;

                return {
                  ...application,
                  ...detail,
                  posting: listPosting ?? detail.posting ?? application.posting,
                  title:
                    detail.title ??
                    detail.internshipTitle ??
                    detail.internshipPostTitle ??
                    detail.postTitle ??
                    detail.internshipPost?.title ??
                    detail.posting?.title ??
                    listPosting?.title,
                  company:
                    detail.organizationName ??
                    detail.companyName ??
                    detail.company ??
                    detail.internshipPost?.organizationName ??
                    detail.internshipPost?.organization?.organizationName ??
                    detail.posting?.organizationName ??
                    listPosting?.organizationName,
                };
              } catch {
                return {
                  ...application,
                  posting: listPosting ?? application.posting,
                  title: listPosting?.title ?? application.title,
                  company:
                    listPosting?.organizationName ?? application.company,
                };
              }
            }
          )
        );

        if (isActive) {
          setRequests(requestsWithPosting);
        }
      } catch (error) {
        console.error("Student applications fetch failed:", error);
        if (isActive) setRequests([]);
      }
    }

    loadRequests();
    return () => {
      isActive = false;
    };
  }, []);

  const getStatus = (item) => {
    const status = String(
      item.status ?? item.applicationStatus ?? "pending"
    ).toLowerCase();

    if (["approved", "accepted"].includes(status)) return "approved";
    if (["rejected", "declined"].includes(status)) return "rejected";
    return "pending";
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("mn-MN");
  };

  const normalizeList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const getPostingId = (item) =>
    item?.internshipPostId ??
    item?.postingId ??
    item?.internshipPost?.internshipPostId ??
    item?.internshipPost?.id ??
    item?.posting?.internshipPostId ??
    item?.posting?.id;

  const openRequestDetail = async (item) => {
    setSelectedRequest(item);
    setIsDetailLoading(true);

    try {
      const internshipPostId = item.internshipPostId;
      const response = await fetch(
        `/api/students/application/${encodeURIComponent(item.applicationId)}`,
        { cache: "no-store" }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Хүсэлтийн дэлгэрэнгүйг авч чадсангүй.");
      }

      const detail = result.data ?? result.application ?? result;
      const application = {
        ...item,
        ...detail,
        posting: {
          ...(item.internshipPost ?? {}),
          ...(item.posting ?? {}),
          ...(detail.internshipPost ?? {}),
          ...(detail.posting ?? {}),
        },
      };
      const postingId = internshipPostId ?? getPostingId(detail) ?? getPostingId(item);

      if (postingId == null) {
        setSelectedRequest(application);
        return;
      }

      const postingResponse = await fetch(
        `/api/postings/${encodeURIComponent(postingId)}`,
        { cache: "no-store" }
      );
      const postingResult = await postingResponse.json().catch(() => ({}));

      if (!postingResponse.ok) {
        setSelectedRequest(application);
        return;
      }

      const posting = postingResult.data ?? postingResult.posting ?? postingResult;
      setSelectedRequest({
        ...application,
        internshipPostId: postingId,
        posting: {
          ...application.posting,
          ...posting,
        },
      });
    } catch (error) {
      console.error("Student application detail fetch failed:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const approvedCount = requests.filter(
    (item) => getStatus(item) === "approved"
  ).length;

  const pendingCount = requests.filter(
    (item) => getStatus(item) === "pending"
  ).length;

  const rejectedCount = requests.filter(
    (item) => getStatus(item) === "rejected"
  ).length;



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

          {requests.map((item, index) => (
            <Card
              key={item.id ?? item.applicationId ?? index}
              className={styles.requestCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <button
                      type="button"
                      className={styles.titleButton}
                      onClick={() => openRequestDetail(item)}
                    >
                      {item.title ??
                        item.internshipTitle ??
                        item.internshipPostTitle ??
                        item.postTitle ??
                        item.internshipPost?.title ??
                        item.posting?.title ??
                        `Дадлагын зар #${item.internshipPostId}`}
                    </button>
                  </h3>
                  <Link
                    className={styles.companyLink}
                    href={{
                      pathname: "/pages/student/company",
                      query: {
                        organizationId:
                          item.posting?.organizationId ??
                          item.internshipPost?.organizationId ??
                          item.organizationId ??
                          "",
                        organizationName:
                          item.company ??
                          item.organizationName ??
                          item.internshipPost?.organizationName ??
                          item.internshipPost?.organization?.organizationName ??
                          item.posting?.organizationName ??
                          "",
                        industry:
                          item.posting?.industry ??
                          item.internshipPost?.industry ??
                          item.industry ??
                          "",
                        city:
                          item.posting?.city ??
                          item.internshipPost?.city ??
                          item.city ??
                          "",
                      },
                    }}
                  >
                    {item.company ??
                      item.organizationName ??
                      item.internshipPost?.organizationName ??
                      item.internshipPost?.organization?.organizationName ??
                      item.posting?.organizationName ??
                      `Хүсэлт #${item.applicationId}`}
                  </Link>
                </div>

                <Tag
                  color={
                    getStatus(item) === "approved"
                      ? "success"
                      : getStatus(item) === "rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {getStatus(item) === "approved"
                    ? "Зөвшөөрөгдсөн"
                    : getStatus(item) === "rejected"
                    ? "Татгалзсан"
                    : "Хүлээгдэж буй"}
                </Tag>
              </div>

              <p className={styles.description}>
                {item.description ?? item.coverLetter}
              </p>

              <div className={styles.dateRow}>
                <span>
                  Илгээсэн: {formatDate(
                    item.submittedAt ??
                      item.sentDate ??
                      item.appliedAt ??
                      item.createdAt
                  )}
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
