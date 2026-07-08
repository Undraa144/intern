"use client";

import { useState, useEffect } from "react";

import {
  Button,
  Card,
  Avatar,
  Input,
  Row,
  Col,
  Typography,
} from "antd";

import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import MainLayout from "@/app/MainLayout";

const { Title, Text } = Typography;

export default function ProfilePage() {

  const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({
  fullName: "Батболдын Тэмүүлэн",
  major: "Програм хангамж",
  phone: "99112233",
  email: "temuulen@example.mn",
  bio: "Гуравдугаар курсын програм хангамжийн оюутан.",

});

useEffect(() => {
  const savedProfile =
    localStorage.getItem("studentProfile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    setProfile({
      fullName:
        data.fullName ||
        "Болор",

      major:
        data.major ||
        "IT",

      phone:
        data.phone ||
        "99112233",

      email:
        data.email ||
        "bolor@example.mn",


      bio:
        data.bio ||
        "F.ITM301 хичээлийн багш",


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


  return (
    <MainLayout role="teacher">
        <h1 className={styles.pageTitle}>
          Профайл
        </h1>

        <div className={styles.profileGrid}>
          <Card className={styles.leftCard}>
            <div className={styles.avatarSection}>
              <Avatar size={100}>
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Avatar>

              <Title level={3}>
                {profile.fullName}
              </Title>

              <Text type="secondary">
                {profile.major}
              </Text>

            </div>

            <div className={styles.contact}>
              <p>
                <MailOutlined /> {profile.email}
              </p>

              <p>
                <PhoneOutlined /> {profile.phone}
              </p>

            </div>
          </Card>

          <Card className={styles.rightCard}>
            <div className={styles.profileHeader}>
              <Title level={4}>
                Хувийн мэдээлэл
              </Title>

              {isEditing ? (
                <Button
                  type="primary"
                  onClick={handleSave}
                >
                  Хадгалах
                </Button>
              ) : (
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  Засах
                </Button>
              )}
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <label>Бүтэн нэр</label>

                <Input
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      fullName:
                        e.target.value,
                    })
                  }
                />
              </Col>

              <Col span={12}>
                <label>Мэргэжил</label>

                <Input
                  disabled={!isEditing}
                  value={profile.major}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      major:
                        e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row
              gutter={16}
              style={{ marginTop: 16 }}
            >
              <Col span={12}>
                <label>Утас</label>

                <Input
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone:
                        e.target.value,
                    })
                  }
                />
              </Col>

            </Row>

            <div className={styles.bio}>
              <label>Имэйл</label>

              <Input
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email:
                      e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.bio}>
              <label>
                Товч танилцуулга
              </label>

              <Input.TextArea
                rows={4}
                disabled={!isEditing}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio:
                      e.target.value,
                  })
                }
              />
            </div>
          </Card>
        </div>
    </MainLayout>

  );
}