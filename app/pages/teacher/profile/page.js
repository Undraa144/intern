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
  message,
} from "antd";

import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined ,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import MainLayout from "@/app/MainLayout";

const { Title, Text } = Typography;

export default function ProfilePage() {

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

const [profile, setProfile] = useState({
  fullName: "",
  firstName: "",
  lastName: "",
  major: "",
  phone: "",
  email: "",
  id: "",
  bio: "",

});

useEffect(() => {
  const savedProfile =
    localStorage.getItem("studentProfile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile({
      fullName:
        data.fullName ||
        "",

      firstName: data.firstName || "",
      lastName: data.lastName || "",

      major:
        data.major ||
        "",

      phone:
        data.phone ||
        "",

      email:
        data.email ||
        "",


      id:
        data.id ||
        "",

      bio: data.bio || "",

    });
  }
}, []);

useEffect(() => {
  let cancelled = false;

  const loadTeacherProfile = async () => {
    try {
      const response = await fetch("/api/teacher/profile", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Багшийн профайлыг ачаалж чадсангүй.");
      }

      const teacher = data.data ?? data.teacher ?? data.profile ?? data;
      const user = teacher.user ?? {};
      const firstName = teacher.firstName ?? user.firstName ?? "";
      const lastName = teacher.lastName ?? user.lastName ?? "";

      if (!cancelled) {
        setProfile((current) => ({
          ...current,
          fullName:
            teacher.fullName ??
            teacher.name ??
            user.fullName ??
            ([firstName, lastName].filter(Boolean).join(" ") ||
              current.fullName),
          firstName,
          lastName,
          major:
            teacher.major?.name ??
            teacher.major ??
            teacher.department ??
            teacher.specialization ??
            "",
          phone:
            teacher.phone ??
            teacher.phoneNumber ??
            user.phone ??
            user.phoneNumber ??
            "",
          email: teacher.email ?? user.email ?? current.email,
          id:
            teacher.teacherId ??
            teacher.id ??
            teacher.code ??
            current.id,
          bio: teacher.bio ?? teacher.description ?? "",
        }));
      }
    } catch (error) {
      if (!cancelled) {
        message.error(error.message || "Багшийн профайлыг ачаалж чадсангүй.");
      }
    }
  };

  loadTeacherProfile();
  return () => {
    cancelled = true;
  };
}, []);

const handleSave = async () => {
  setIsSaving(true);

  try {
    const response = await fetch("/api/teacher/profile", {
      method: "PUT",
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.message || "Багшийн профайлыг хадгалж чадсангүй.");
    }

    localStorage.setItem("studentProfile", JSON.stringify(profile));
    setIsEditing(false);
    message.success("Багшийн профайл шинэчлэгдлээ.");
  } catch (error) {
    message.error(error.message || "Багшийн профайлыг хадгалж чадсангүй.");
  } finally {
    setIsSaving(false);
  }
};

const displayName =
  [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
  profile.fullName;


  return (
    <MainLayout role="teacher">
        <h1 className={styles.pageTitle}>
          Профайл
        </h1>

        <div className={styles.profileGrid}>
          <Card className={styles.leftCard}>
            <div className={styles.avatarSection}>
              <Avatar size={100}>
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Avatar>

              <Title level={3}>
                {displayName}
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
              <p>
                <KeyOutlined /> {profile.id}
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
                  loading={isSaving}
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
              <Col span={8}>
                <label>Нэр</label>

                <Input
                  disabled={!isEditing}
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      firstName:
                        e.target.value,
                    })
                  }
                />
              </Col>

              <Col span={8}>
                <label>Овог</label>

                <Input
                  disabled={!isEditing}
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      lastName: e.target.value,
                    })
                  }
                />
              </Col>

              <Col span={8}>
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
              <label>Товч танилцуулга</label>

              <Input.TextArea
                rows={4}
                disabled={!isEditing}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
              />
            </div>
          </Card>
        </div>
    </MainLayout>

  );
}
