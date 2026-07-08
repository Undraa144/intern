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

} from "antd";

import {
  BankOutlined,
  GlobalOutlined,
  StarFilled ,
} from "@ant-design/icons";

import styles from "./profile.module.scss"

const {  Content  } = Layout;
const { Title, Text } = Typography;

export default function Profile() {

  const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({
  companyName: "ДатаТех Солюшнс",
  industry: "Мэдээллийн технологи",
  rating: 4.6,
  website: "datatech.mn",
  address: "Сүхбаатар дүүрэг, 1-р хороо",
  description:
    "Бид санхүү, банкны салбарт зориулсан програм хангамжийн шийдэл нийлүүлдэг.",
  verified: true,
});

useEffect(() => {
  const savedProfile =
    localStorage.getItem("studentProfile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    setProfile({
  companyName: data.companyName || "ДатаТех Солюшнс",
  industry: data.industry || "Мэдээллийн технологи",
  rating: data.rating || 4.6,
  website: data.website || "datatech.mn",
  address: data.address || "",
  description: data.description || "",
  verified: data.verified ?? true,
});
  }
}, []);

const handleSave = () => {
  localStorage.setItem(
    "studentProfile",
    JSON.stringify(profile)
  );

  setIsEditing(false);
};

  const onClick = (e) => {
    setCurrent(e.key);
  };


  return (
    <Layout>

      <div className={styles.profilePage}>
  <div className={styles.header}>
    <div>
      <h1>Байгууллагын профайл</h1>
    </div>

    <Button
      type="primary"
      onClick={() =>
        isEditing
          ? handleSave()
          : setIsEditing(true)
      }
    >
      {isEditing ? "Хадгалах" : "Засварлах"}
    </Button>
  </div>

  <Card className={styles.companyCard}>
    <div className={styles.companyInfo}>
      <Avatar size={80}>
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

        <div className={styles.rating}>
          <StarFilled  style={{color:"#f0bc00"}}/> {profile.rating} үнэлгээ
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
            <a
              href={`https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.website}
            </a>
          </div>
        </Col>
    </Row>

    <Card className={styles.mapCard}>
      <Title level={4}>Байршил</Title>

      <iframe
        src="https://maps.google.com/maps?q=47.9184,106.9177&z=15&output=embed"
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
</div>

    </Layout>
  );
}