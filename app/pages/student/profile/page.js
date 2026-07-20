"use client";

import { useState, useEffect } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  UserOutlined,
  StarFilled,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import MainLayout from "@/app/MainLayout";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    major: "",
    university: "",
    courseYear: "",
    phone: "",
    email: "",
    gpa: "",
    bio: "",
    resume: "",
    skills: "",
    languages: "",
    teacherName: "",
    teacherPhone: "",
  });

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem("studentReviews")) || [];

    // Restore browser-persisted reviews after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(savedReviews);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const [profileResponse, userResponse] = await Promise.all([
          fetch("/api/students/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/auth/me", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);
        const data = await profileResponse.json().catch(() => ({}));
        const me = await userResponse.json().catch(() => ({}));

        if (!profileResponse.ok) {
          throw new Error(data.message || "Профайл уншихад алдаа гарлаа");
        }

        if (!cancelled) {
          const profileData = data.profile || data.student || data.data || data;
          const userData =
            profileData.user || profileData.student?.user || me.user || me;
          const teacher = profileData.teacher || profileData.advisor || {};
          const skills = profileData.skills || profileData.skillNames;
          const languages = profileData.languages || profileData.languageNames;
          const firstName =
            profileData.firstName || userData.firstName || "";
          const lastName = profileData.lastName || userData.lastName || "";
          const combinedName = [firstName, lastName]
            .filter(Boolean)
            .join(" ");

          setProfile((current) => ({
            ...current,
            firstName,
            lastName,
            fullName:
              combinedName ||
              profileData.fullName ||
              profileData.name ||
              userData.fullName ||
              userData.name ||
              "",
            major:
              profileData.major?.name ||
              profileData.major ||
              profileData.majorName ||
              "",
            university: profileData.university || "",
            courseYear: profileData.courseYear ?? "",
            phone:
              profileData.phone ||
              profileData.phoneNumber ||
              userData.phone ||
              userData.phoneNumber ||
              "",
            email: profileData.email || userData.email || "",
            gpa: profileData.gpa ?? profileData.GPA ?? "",
            bio:
              profileData.shortBio ||
              profileData.bio ||
              profileData.description ||
              "",
            resume:
              profileData.resume?.fileName ||
              profileData.resume ||
              profileData.resumeFileName ||
              "",
            skills: Array.isArray(skills)
              ? skills.map((item) => item.name || item).join(", ")
              : skills || "",
            languages: Array.isArray(languages)
              ? languages.map((item) => item.name || item).join(", ")
              : languages || "",
            teacherName:
              profileData.teacherName ||
              teacher.fullName ||
              teacher.name ||
              "",
            teacherPhone:
              profileData.teacherPhone ||
              teacher.phone ||
              teacher.phoneNumber ||
              "",
          }));
        }
      } catch (error) {
        if (!cancelled) message.error(error.message);
      }
    }

    loadProfile();
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

  const handleSave = async () => {
    try {
      const userResponse = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      const userData = await userResponse.json().catch(() => ({}));

      if (!userResponse.ok) {
        throw new Error(userData.message || "Нэвтрэх хугацаа дууссан байна.");
      }

      const user = userData.data ?? userData.user ?? userData;

      if (user.role && user.role !== "STUDENT") {
        throw new Error("Зөвхөн оюутны эрхээр профайл засах боломжтой.");
      }

      const response = await fetch("/api/students/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          major: profile.major,
          university: profile.university,
          courseYear: Number(profile.courseYear),
          gpa: Number(profile.gpa),
          phone: Number(profile.phone),
          shortBio: profile.bio,
          skills: profile.skills.split(",").map((item) => item.trim()).filter(Boolean),
          languages: profile.languages.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Профайл шинэчлэхэд алдаа гарлаа");
      }

      const fullName = [profile.firstName, profile.lastName]
        .filter(Boolean)
        .join(" ");
      const updatedProfile = { ...profile, fullName };
      setProfile(updatedProfile);
      localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
      setIsEditing(false);
      message.success("Профайл амжилттай шинэчлэгдлээ");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <MainLayout role="student">
      <Content className={styles.content}>
        <h1 className={styles.pageTitle}>Профайл</h1>

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

              <Title level={3}>{profile.fullName}</Title>

              <Text type="secondary">{profile.major}</Text>

              <div className={styles.tags}>
                <Tag color="blue">GPA {profile.gpa}</Tag>
              </div>
            </div>

            <div className={styles.contact}>
              <p>
                <MailOutlined /> {profile.email}
              </p>

              <p>
                <PhoneOutlined /> {profile.phone}
              </p>

              <p>
                <FileTextOutlined /> {profile.resume || "Resume байхгүй"}
              </p>
            </div>

            <div className={styles.contact} style={{ marginTop: 16 }}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Хариуцсан багш
              </Text>

              <p>
                <UserOutlined /> {profile.teacherName}
              </p>

              <p>
                <PhoneOutlined /> {profile.teacherPhone}
              </p>
            </div>
          </Card>

          <Card className={styles.rightCard}>
            <div className={styles.profileHeader}>
              <Title level={4}>Хувийн мэдээлэл</Title>

              {isEditing ? (
                <Button type="primary" onClick={handleSave}>
                  Хадгалах
                </Button>
              ) : (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
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
                      firstName: e.target.value,
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
                      major: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <label>Сургууль</label>
                <Input
                  disabled={!isEditing}
                  value={profile.university}
                  onChange={(e) =>
                    setProfile({ ...profile, university: e.target.value })
                  }
                />
              </Col>
              <Col span={12}>
                <label>Курс</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={profile.courseYear}
                  onChange={(e) =>
                    setProfile({ ...profile, courseYear: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <label>Утас</label>

                <Input
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                />
              </Col>

              <Col span={12}>
                <label>GPA</label>

                <Input
                  disabled={!isEditing}
                  value={profile.gpa}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      gpa: e.target.value,
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
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.bio}>
              <label>Resume (PDF)</label>

              {isEditing ? (
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf"
                  onChange={({ fileList }) => {
                    if (fileList.length > 0) {
                      setProfile({
                        ...profile,
                        resume: fileList[0].name,
                      });
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Resume сонгох</Button>
                </Upload>
              ) : (
                <p>
                  <FileTextOutlined /> {profile.resume || "Resume байхгүй"}
                </p>
              )}
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

            <div className={styles.skillSection}>
              <label>Чадварууд</label>

              {isEditing ? (
                <Input
                  value={profile.skills || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      skills: e.target.value,
                    })
                  }
                />
              ) : (
                <div className={styles.tags}>
                  {(profile.skills || "")
                    .split(",")
                    .filter((item) => item.trim())
                    .map((skill, index) => (
                      <Tag key={index}>{skill.trim()}</Tag>
                    ))}
                </div>
              )}
            </div>

            <div className={styles.skillSection}>
              <label>Хэл</label>

              {isEditing ? (
                <Input
                  value={profile.languages || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      languages: e.target.value,
                    })
                  }
                />
              ) : (
                <div className={styles.tags}>
                  {(profile.languages || "")
                    .split(",")
                    .filter((item) => item.trim())
                    .map((lang, index) => (
                      <Tag key={index}>{lang.trim()}</Tag>
                    ))}
                </div>
              )}
            </div>
          </Card>
        </div>

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
            <Text type="secondary">Одоогоор сэтгэгдэл байхгүй.</Text>
          ) : (
            reviews.map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 15 }}>
                <Tag color={item.from === "Багш" ? "blue" : "green"}>
                  {item.from}
                </Tag>
                <div style={{ margin: "10px 0" }}>
                  <Rate disabled value={item.rate} />
                </div>
                <Text>{item.comment}</Text>
                <br />
                <Text type="secondary">{item.date}</Text>
              </Card>
            ))
          )}
        </Card>
      </Content>
    </MainLayout>
  );
}
