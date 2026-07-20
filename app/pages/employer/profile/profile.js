"use client";

import { useState, useEffect } from "react";

import {
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
  message,
} from "antd";

import {
  BankOutlined,
  GlobalOutlined,
  StarFilled ,
  EnvironmentOutlined,
} from "@ant-design/icons";

import styles from "./profile.module.scss"

const {  Content  } = Layout;
const { Title, Text } = Typography;

export default function Profile() {

const [isEditing, setIsEditing] = useState(false);
const [reviews, setReviews] = useState([]);

const [profile, setProfile] = useState({
  companyName: "ДатаТех Солюшнс",
  industry: "Мэдээллийн технологи",
  rate: 4.6,
  website: "datatech.mn",
  address: "Сүхбаатар дүүрэг, 1-р хороо",
  city: "Улаанбаатар",
  logoUrl: "",
  description:
    "Бид санхүү, банкны салбарт зориулсан програм хангамжийн шийдэл нийлүүлдэг.",
  verified: true,
});

useEffect(() => {
  const savedProfile = localStorage.getItem("studentProfile");
  if (savedProfile) {
    const data = JSON.parse(savedProfile);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile({
      companyName: data.companyName || "ДатаТех Солюшнс",
      industry: data.industry || "Мэдээллийн технологи",
      rate: data.rate || 4.6,
      website: data.website || "datatech.mn",
      address: data.address || "",
      description: data.description || "",
      verified: data.verified ?? true,
    });
  }

  const savedReviews = localStorage.getItem("companyReviews");
  if (savedReviews) {
    setReviews(JSON.parse(savedReviews));
  }
}, []);

useEffect(() => {
  let cancelled = false;

  const loadOrganizationProfile = async () => {
    try {
      const response = await fetch("/api/organization/profile", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Байгууллагын профайлыг ачаалж чадсангүй.");
      }

      const organization = data.data ?? data.organization ?? data;

      if (!cancelled) {
        setProfile((current) => ({
          ...current,
          companyName:
            organization.companyName ??
            organization.organizationName ??
            organization.name ??
            current.companyName,
          industry: organization.industry ?? current.industry,
          rate: organization.rate ?? organization.rating ?? current.rate,
          website: organization.site ?? organization.website ?? current.website,
          address: organization.address ?? current.address,
          city: organization.city ?? current.city,
          logoUrl: organization.logoUrl ?? current.logoUrl,
          description: organization.description ?? current.description,
          verified: organization.verified ?? current.verified,
        }));
      }
    } catch (error) {
      if (!cancelled) {
        message.error(
          error.message || "Байгууллагын профайлыг ачаалж чадсангүй."
        );
      }
    }
  };

  loadOrganizationProfile();

  return () => {
    cancelled = true;
  };
}, []);

const averageRate =
reviews.length > 0
? (
reviews.reduce((sum, item) => sum + item.rate, 0) / reviews.length
).toFixed(1)
: 0;

const mapQuery = encodeURIComponent(
  [profile.address, profile.city].filter(Boolean).join(", ")
);

const handleSave = async () => {
  try {
    const response = await fetch("/api/organization/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationName: profile.companyName,
        industry: profile.industry,
        address: profile.address,
        city: profile.city,
        site: profile.website,
        logoUrl: profile.logoUrl,
        description: profile.description,
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Байгууллагын профайлыг хадгалж чадсангүй.");
    }

    localStorage.setItem("companyProfile", JSON.stringify(profile));
    setIsEditing(false);
    message.success("Байгууллагын профайл шинэчлэгдлээ.");
  } catch (error) {
    message.error(
      error.message || "Байгууллагын профайлыг хадгалж чадсангүй."
    );
  }
};


  return (
    <Layout>

      <div className={styles.profilePage}>
  <div className={styles.header}>
    <div>
      <h1>Байгууллагын профайл</h1>
    </div>

  </div>

  <Card className={styles.companyCard}>
    <div className={styles.companyInfo}>
      <Avatar size={80} src={profile.logoUrl || undefined}>
        {profile.companyName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </Avatar>
    <Button className={styles.btn}
      type="primary"
      onClick={() =>
        isEditing
          ? handleSave()
          : setIsEditing(true)
      }
    >
      {isEditing ? "Хадгалах" : "Засварлах"}
    </Button>

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
  </Card>

  <Card className={styles.infoCard}>
    <Title level={4}>Үндсэн мэдээлэл</Title>

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
            {isEditing ? (
              <Input
                value={profile.website}
                placeholder="https://example.com"
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    website: event.target.value,
                  })
                }
              />
            ) : (
              <a
                href={
                  profile.website?.startsWith("http")
                    ? profile.website
                    : `https://${profile.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            )}
          </div>
        </Col>
    </Row>

    <Card className={styles.mapCard}>
      <Title level={4}>Байршил</Title>

      {isEditing && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              prefix={<EnvironmentOutlined />}
              value={profile.city}
              placeholder="Хот"
              onChange={(event) =>
                setProfile({
                  ...profile,
                  city: event.target.value,
                })
              }
            />
          </Col>
          <Col span={16}>
            <Input
              value={profile.address}
              placeholder="Дэлгэрэнгүй хаяг"
              onChange={(event) =>
                setProfile({
                  ...profile,
                  address: event.target.value,
                })
              }
            />
          </Col>
        </Row>
      )}

      <iframe
        src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
        title="Байгууллагын байршил"
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

    <div className={styles.description}>
      <label>Танилцуулга</label>

      <Input.TextArea
        rows={4}
        disabled={!isEditing}
        value={profile.description}
        onChange={(e) =>
          setProfile({
            ...profile,
            description: e.target.value,
          })
        }
      />
    </div>

    {profile.verified && (
      <Tag color="blue">
        Баталгаажсан байгууллага
      </Tag>
    )}
  </Card>
          <Card
          title={
            <span>
            Үнэлгээ, сэтгэгдэл{" "}
            {reviews.length > 0 && (
                <Tag color="gold" style={{ marginLeft: 10 }}>
                Дундаж: {averageRate} <StarFilled style={{ color: "#fadb14" }} />
                </Tag>
            )}
            </span>
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
</div>

    </Layout>
  );
}
