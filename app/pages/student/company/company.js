
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
} from "@ant-design/icons";

import styles from "./company.module.scss"

const { TextArea } = Input;
const { Title, Text } = Typography

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";

const toWebsiteUrl = (website) =>
  website && /^https?:\/\//i.test(website) ? website : `https://${website}`;

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
const[ name, setName] =useState("")
const [rate, setRate] = useState(0);
const [comment, setComment] = useState("");


const [profile, setProfile] = useState(defaultProfile);
const [isLoading, setIsLoading] = useState(true);
const [loadError, setLoadError] = useState("");

useEffect(() => {
  let isActive = true;

  const loadProfile = async () => {
    const savedReviews = JSON.parse(localStorage.getItem("companyReviews")) || [];
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

      setReviews(savedReviews);
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
              onClick={() => setReviewOpen(true)}
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
          title="Байгууллагад үнэлгээ өгөх"
          open={reviewOpen}
          onCancel={() => setReviewOpen(false)}
          onOk={() => {
            const review = {
              rate,
              name,
              comment,
              date: new Date().toLocaleDateString(),
            };

            const oldReviews =
              JSON.parse(localStorage.getItem("companyReviews")) || [];

            const updatedReviews = [...oldReviews, review];

            localStorage.setItem(
              "companyReviews",
              JSON.stringify(updatedReviews)
            );

            setReviews(updatedReviews);

            setReviewOpen(false);
            setRate(0);
            setName("");
            setComment("");
          }}
          okText="Хадгалах"
          cancelText="Болих"
        >
          <p>Үнэлгээ</p>

          <Rate
            value={rate}
            onChange={(value) => setRate(value)}
          />

          <div style={{ marginTop: 20 }}>
            <TextArea
            rows={1}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Хүсвэл нэрээ бичнэ үү..."
              />
            <TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Сэтгэгдлээ бичнэ үү..."
            />
          </div>
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
            reviews.map((item, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 15 }}
              >
                <div style={{ marginTop: 10 }}>
                  {item.name}
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
              </Card>
            ))
          )}
        </Card>

        </>}

        </div>

    </Layout>
  );
}
