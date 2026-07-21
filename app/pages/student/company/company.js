
"use client";
import { useState, useEffect } from "react";

import {
  Modal,
  Layout,
  Button,
  Card,
  Avatar,
  Tag,
  Input,
  Checkbox,
  Space,
  Row,
  Col,
  Typography,
  Rate,
} from "antd";

import {
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  StarFilled ,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import styles from "./company.module.scss"

const { TextArea } = Input;
const { Title, Text } = Typography

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";

const toWebsiteUrl = (website) =>
  website && /^https?:\/\//i.test(website) ? website : `https://${website}`;

const normalizeReview = (item, fallback = {}) => ({
  organizationReviewId:
    item?.organizationReviewId ?? fallback.organizationReviewId ?? Date.now(),
  studentId: item?.studentId ?? fallback.studentId,
  name: item?.studentName ?? fallback.name ?? "Нэргүй",
  rate: Number(item?.rating ?? fallback.rate) || 0,
  comment: item?.comment ?? fallback.comment ?? "",
  date: item?.createdAt ?? fallback.date ?? new Date().toISOString().slice(0, 10),
  isAnonymous: Boolean(item?.anonymous ?? fallback.isAnonymous),
});

const defaultProfile = {
  companyName: "ДатаТех Солюшнс",
  industry: "Мэдээллийн технологи",
  rate: 5,
  website: "datatech.mn",
  address: "Сүхбаатар дүүрэг, 1-р хороо",
  description:
    "Бид санхүү, банкны салбарт зориулсан програм хангамжийн шийдэл нийлүүлдэг.",
  verified: true,
};

export default function Profile() {
const [reviews, setReviews] = useState([]);
const [reviewOpen, setReviewOpen] = useState(false);
const [isAnonymous, setIsAnonymous] = useState(false);
const [rate, setRate] = useState(0);
const [comment, setComment] = useState("");
const [organizationId, setOrganizationId] = useState(null);
const [isSubmittingReview, setIsSubmittingReview] = useState(false);
const [editingReview, setEditingReview] = useState(null);
const [currentStudentId, setCurrentStudentId] = useState(null);
const [deletingReview, setDeletingReview] = useState(null);
const [isDeletingReview, setIsDeletingReview] = useState(false);


const [profile, setProfile] = useState(defaultProfile);
const [isLoading, setIsLoading] = useState(true);
const [loadError, setLoadError] = useState("");

useEffect(() => {
  let isActive = true;

  const loadProfile = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      if (isActive) {
        setLoadError("Байгууллагын ID олдсонгүй.");
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/organization/${organizationId}`);

      if (!response.ok) {
        throw new Error(`Organization profile request failed: ${response.status}`);
      }

      const organization = await response.json();

      if (!isActive) return;

      setOrganizationId(organizationId);
      setProfile({
        companyName:
          organization.organizationName ?? organization.companyName ?? organization.name ?? "Мэдээлэл байхгүй",
        industry: organization.industry ?? "Мэдээлэл байхгүй",
        rate: organization.rate ?? organization.rating ?? 0,
        website: organization.site ?? organization.website ?? "",
        address: organization.address ?? organization.city ?? "Мэдээлэл байхгүй",
        city: organization.city ?? "",
        logoUrl: organization.logoUrl ?? "",
        description: organization.description ?? "Мэдээлэл байхгүй",
        verified: organization.verified ?? false,
      });

      try {
        const reviewResponse = await fetch(`${API_BASE}/api/reviews/org/${organizationId}`);

        if (!reviewResponse.ok) {
          throw new Error(`Organization reviews request failed: ${reviewResponse.status}`);
        }

        const reviewData = await reviewResponse.json();

        if (!isActive) return;

        const normalizedReviews = Array.isArray(reviewData)
          ? reviewData.map((item) => normalizeReview(item))
          : [];

        setReviews(normalizedReviews);

        const idResponse = await fetch("/api/auth/my-id", { cache: "no-store" });
        if (idResponse.ok) {
          const idData = await idResponse.json();
          setCurrentStudentId(Number(idData?.studentId ?? idData?.id ?? idData));
        }
      } catch (reviewError) {
        console.error("Unable to load organization reviews:", reviewError);
        if (isActive) {
          setReviews([]);
        }
      }
    } catch (error) {
      console.error("Unable to load organization profile:", error);
      if (isActive) {
        setLoadError("Байгууллагын мэдээллийг ачаалж чадсангүй.");
      }
    } finally {
      if (isActive) {
        setIsLoading(false);
      }
    }
  };

  loadProfile();

  return () => {
    isActive = false;
  };
}, []);

const validateReview = () => {
  if (rate < 1) {
    alert("Үнэлгээгээ сонгоно уу.");
    return false;
  }

  if (!comment.trim()) {
    alert("Сэтгэгдлээ бичнэ үү.");
    return false;
  }

  return true;
};

const parseReviewResponse = async (response, fallbackMessage) => {
  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (!response.ok) throw new Error(responseText);
    }
  }

  if (!response.ok) {
    const backendMessage =
      data?.message ?? data?.detail ?? data?.error ?? data?.title;
    throw new Error(
      `${backendMessage || fallbackMessage} (HTTP ${response.status})`
    );
  }

  return data;
};

const closeReviewModal = () => {
  setReviewOpen(false);
  setEditingReview(null);
  setRate(0);
  setIsAnonymous(false);
  setComment("");
};

const handleCreateReview = async () => {
  if (!organizationId) {
    alert("Байгууллагын ID олдсонгүй.");
    return;
  }

  if (!validateReview()) return;
  setIsSubmittingReview(true);

  try {
    const response = await fetch(`/api/reviews/${organizationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rate,
        comment: comment.trim(),
        isAnonymous,
      }),
    });
    const createdReview = await parseReviewResponse(
      response,
      "Үнэлгээ илгээж чадсангүй."
    );
    const normalizedReview = normalizeReview(createdReview, {
      studentId: currentStudentId,
      rate,
      comment: comment.trim(),
      isAnonymous,
    });

    setReviews((currentReviews) => [...currentReviews, normalizedReview]);
    closeReviewModal();
  } catch (error) {
    alert(error.message || "Үнэлгээ илгээх үед алдаа гарлаа.");
  } finally {
    setIsSubmittingReview(false);
  }
};

const handleUpdateReview = async () => {
  const organizationReviewId = editingReview?.organizationReviewId;

  if (!organizationReviewId) {
    alert("Засах үнэлгээний ID олдсонгүй.");
    return;
  }

  if (!validateReview()) return;
  setIsSubmittingReview(true);

  try {
    const response = await fetch(
      `/api/reviews/${encodeURIComponent(organizationReviewId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: rate,
          comment: comment.trim(),
          isAnonymous,
        }),
      }
    );
    const updatedReview = await parseReviewResponse(
      response,
      "Үнэлгээг засаж чадсангүй."
    );
    const normalizedReview = normalizeReview(updatedReview, {
      organizationReviewId,
      studentId: editingReview.studentId,
      name: editingReview.name,
      rate,
      comment: comment.trim(),
      date: editingReview.date,
      isAnonymous,
    });

    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        item.organizationReviewId === organizationReviewId
          ? normalizedReview
          : item
      )
    );
    closeReviewModal();
  } catch (error) {
    alert(error.message || "Үнэлгээг засах үед алдаа гарлаа.");
  } finally {
    setIsSubmittingReview(false);
  }
};

const openNewReview = () => {
  setEditingReview(null);
  setRate(0);
  setComment("");
  setIsAnonymous(false);
  setReviewOpen(true);
};

const openEditReview = (review) => {
  setEditingReview(review);
  setRate(review.rate);
  setComment(review.comment);
  setIsAnonymous(review.isAnonymous);
  setReviewOpen(true);
};

const handleDeleteReview = (review) => {
  if (!review?.organizationReviewId) {
    Modal.warning({
      title: "Үнэлгээний ID олдсонгүй",
      content: "Устгах үнэлгээг дахин сонгоно уу.",
      okText: "Ойлголоо",
    });
    return;
  }

  setDeletingReview(review);
};

const handleConfirmDelete = async () => {
  const organizationReviewId = deletingReview?.organizationReviewId;

  if (!organizationReviewId) return;
  setIsDeletingReview(true);

  try {
    const response = await fetch(
      `/api/reviews/${encodeURIComponent(organizationReviewId)}`,
      { method: "DELETE" }
    );

    await parseReviewResponse(response, "Үнэлгээг устгаж чадсангүй.");

    setReviews((currentReviews) =>
      currentReviews.filter(
        (item) => item.organizationReviewId !== organizationReviewId
      )
    );
    setDeletingReview(null);
  } catch (error) {
    Modal.error({
      title: "Үнэлгээг устгаж чадсангүй",
      content: error.message || "Үнэлгээг устгах үед алдаа гарлаа.",
      okText: "Ойлголоо",
    });
  } finally {
    setIsDeletingReview(false);
  }
};

const averageRate =
reviews.length > 0
? (
reviews.reduce((sum, item) => sum + item.rate, 0) / reviews.length
).toFixed(1)
: 0;



  return (
    <Layout>

        <div className={styles.profilePage}>
        <div className={styles.header}>
            <div>
            <h1>Байгууллагын профайл</h1>
            </div>

        </div>

        {isLoading && <Text>Байгууллагын мэдээлэл ачаалж байна...</Text>}
        {loadError && <Text type="danger">{loadError}</Text>}

        {!isLoading && !loadError && <>
        <Card className={styles.companyCard}>
            <div className={styles.companyInfo}>
            <Avatar size={80} src={profile.logoUrl || undefined}>
                {profile.companyName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </Avatar>

            <div>
                <Title level={3}>
                {profile.companyName}
                </Title>

                <Text type="secondary">
                {profile.industry}
                </Text>

                <div className={styles.rate}>
                {reviews.length > 0 && (
                                <Tag color="gold" style={{ marginLeft: 10 }}>
                                Үнэлгээ: {averageRate} <StarFilled style={{ color: "#fadb14" }} />
                                </Tag>
                            )}               
                </div>
            </div>
            </div>
            <Button
              className={styles.button}
              onClick={openNewReview}
            >
              Үнэлгээ өгөх
            </Button>
        </Card>

        <Card className={styles.infoCard}>
            <Title level={4}>Үндсэн мэдээлэл</Title>

            <Title level={4}>Танилцуулга</Title>
            <Text level={3}>
                {profile.description}
            </Text>

            <Row gutter={[24, 24]}>
                <Col span={12}>
                <div className={styles.infoItem}>
                    <BankOutlined />
                    <span>{profile.industry}</span>
                </div>
                </Col>

                <Col span={12}>
                <div className={styles.infoItem}>
                    <GlobalOutlined />
                    {profile.website ? (
                      <a
                        href={toWebsiteUrl(profile.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <span>Мэдээлэл байхгүй</span>
                    )}
                </div>
                </Col>

                <Col span={24}>
                <div className={styles.infoItem}>
                    <EnvironmentOutlined />
                    <span>{profile.address}</span>
                </div>
                </Col>
            </Row>

            <Card className={styles.mapCard}>
            <Title level={4}>Байршил</Title>

            <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  [profile.address, profile.city].filter(Boolean).join(", ")
                )}&z=15&output=embed`}
                width="100%"
                height="350"
                style={{
                border: 0,
                borderRadius: "12px",
                }}
                allowFullScreen
                loading="lazy"
            />
            </Card>

            {profile.verified && (
            <Tag color="blue">
                Баталгаажсан байгууллага
            </Tag>
            )}
            

        </Card>

        <Modal
          title={editingReview ? "Үнэлгээгээ засах" : "Байгууллагад үнэлгээ өгөх"}
          open={reviewOpen}
          onCancel={() => setReviewOpen(false)}
          onOk={editingReview ? handleUpdateReview : handleCreateReview}
          confirmLoading={isSubmittingReview}
          okButtonProps={{ disabled: isSubmittingReview }}
          okText="Хадгалах"
          cancelText="Болих"
        >
          <p>Үнэлгээ</p>

          <Rate
            value={rate}
            onChange={(value) => setRate(value)}
          />

          <div style={{ marginTop: 20 }}>
            <Checkbox
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            >
              Нэрээ нууцлах уу?
            </Checkbox>
            <TextArea
              rows={4}
              style={{ marginTop: 12 }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Сэтгэгдлээ бичнэ үү..."
            />
          </div>
        </Modal>
        <Modal
          title="Үнэлгээг устгах уу?"
          open={Boolean(deletingReview)}
          onCancel={() => setDeletingReview(null)}
          onOk={handleConfirmDelete}
          confirmLoading={isDeletingReview}
          okButtonProps={{ danger: true }}
          okText="Устгах"
          cancelText="Болих"
          centered
        >
          <Text>Устгасан үнэлгээг сэргээх боломжгүй.</Text>
        </Modal>
        <Card
          title={<span>
            Үнэлгээ, сэтгэгдэл{" "}
            {reviews.length > 0 && (
                <Tag color="gold" style={{ marginLeft: 10 }}>
                Дундаж: {averageRate} <StarFilled style={{ color: "#fadb14" }} />
                </Tag>
            )}</span>
          }
          style={{ marginTop: 30 }}
        >
          {reviews.length === 0 ? (
            <Text type="secondary">
              Одоогоор сэтгэгдэл байхгүй.
            </Text>
          ) : (
            reviews.map((item) => (
              <Card
                key={item.organizationReviewId}
                size="small"
                style={{ marginBottom: 15 }}
              >
                <div style={{ marginTop: 10 }}>
                  {item.name || "Нэргүй"}
                </div>

                <Rate disabled value={item.rate} />

                <div style={{ marginTop: 10 }}>
                  {item.comment}
                </div>

                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: 8 }}
                >
                  {item.date}
                </Text>

                {Number(item.studentId) === currentStudentId && (
                  <Space style={{ marginTop: 12 }}>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => openEditReview(item)}
                    >
                      Засах
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteReview(item)}
                    >
                      Устгах
                    </Button>
                  </Space>
                )}
              </Card>
            ))
          )}
        </Card>

        </>}

        </div>

    </Layout>
  );
}
