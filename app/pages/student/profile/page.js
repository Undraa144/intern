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
  Upload,
} from "antd";

import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  UserOutlined,
  StarFilled,
  UploadOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import MainLayout from "@/app/MainLayout";
import { parseResponseBody } from "@/app/utils/response-body.mjs";
import { getStudentIdFromResponse } from "@/app/utils/application-payload.mjs";
import {
  updateStudentProfile,
  uploadStudentResume,
} from "@/app/utils/student-profile-api.mjs";
import { buildStudentProfilePayload } from "@/app/utils/student-profile-payload.mjs";


const { Content } = Layout;
const { Title, Text } = Typography;
<<<<<<< HEAD
const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";
=======
function formatListForInput(value) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function getReviewList(payload) {
  const value = payload?.data ?? payload?.reviews ?? payload?.content ?? payload;
  const list = Array.isArray(value)
    ? value
    : value?.content ?? value?.reviews ?? [];

  return Array.isArray(list) ? list : [];
}

function normalizeReview(review) {
  return {
    name:
      review.name ??
      review.organizationName ??
      review.companyName ??
      "Нэргүй",
    rate: Number(review.rate ?? review.score ?? review.rating ?? 0),
    comment: review.Comment ?? review.comment ?? "",
    createdAt: review.createdAt ?? review.date ?? "",
  };
}

function getAverageRate(payload) {
  const value =
    payload?.data ??
    payload?.averageRate ??
    payload?.avgRate ??
    payload?.average ??
    payload;
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
}
>>>>>>> origin/saina

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [reviews, setReviews] = useState([]);
<<<<<<< HEAD
  const [averageRate, setAverageRate] = useState();
=======
  const [averageRate, setAverageRate] = useState(0);
>>>>>>> origin/saina
  const [profile, setProfile] = useState({
    fullName: "Батболдын Тэмүүлэн",
    major: "Програм хангамж",
    phone: "99112233",
    email: "temuulen@example.mn",
    school: "МУИС",
    gpa: "3.65",
    level: "3",
    bio: "Гуравдугаар курсын програм хангамжийн оюутан.",
    resume: "Resume.pdf",
    skills: "React, Next.js, JavaScript, Python, SQL",
    languages: "Монгол, English",
    teacherName: "",
    teacherPhone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
<<<<<<< HEAD
        function getCookie(name) {
          return document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
        }

        const token = getCookie("token");
        const response = await fetch(`${BASE_API}/api/students/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
=======
        const response = await fetch("/api/students/profile", {
          credentials: "include",
          cache: "no-store",
>>>>>>> origin/saina
        });
        const data = await parseResponseBody(response);

        if (!response.ok || !data) {
<<<<<<< HEAD
          alert("Profile request failed");
          return;
=======
          throw new Error(data?.message || "Profile request failed");
>>>>>>> origin/saina
        }

        const student = data.data ?? data.student ?? data.profile ?? data;
        const user = student.user ?? {};
        const teacher = student.teacher ?? {};
        const firstName = student.firstName ?? user.firstName ?? "";
        const lastName = student.lastName ?? user.lastName ?? "";

        setProfile({
<<<<<<< HEAD
          fullName: data.fullName || "Батболдын Тэмүүлэн",
          major: data.major || "Програм хангамж",
          phone: data.phone || "99112233",
          email: data.email || "temuulen@example.mn",
          school: data.school || "",
          gpa: data.gpa || "3.65",
          level: data.levle || "3",
          bio: data.bio || "Гуравдугаар курсын програм хангамжийн оюутан.",
          resume: data.resume || "Resume.pdf",
          skills: data.skills || "React, Next.js, JavaScript, Python, SQL",
          languages: data.languages || "Монгол, English",
          teacherName: data.teacherName || "",
          teacherPhone: data.teacherPhone || "",
=======
          fullName:
            student.fullName ??
            user.fullName ??
            [firstName, lastName].filter(Boolean).join(" "),
          major: student.major?.name ?? student.major ?? "",
          university: student.university?.name ?? student.university ?? "",
          courseYear: student.courseYear ?? "",
          phone: student.phone ?? user.phone ?? "",
          email: student.email ?? user.email ?? "",
          gpa: student.gpa ?? "",
          bio: student.shortBio ?? student.bio ?? "",
          resume: student.resume ?? student.resumeUrl ?? "",
          skills: formatListForInput(student.skills),
          languages: formatListForInput(student.language),
          teacherName:
            student.teacherName ??
            [teacher.firstName, teacher.lastName].filter(Boolean).join(" "),
          teacherPhone: student.teacherPhone ?? teacher.phone ?? "",
>>>>>>> origin/saina
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
<<<<<<< HEAD

=======
    const loadStudentId = async () => {
      const response = await fetch("/api/auth/myId", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await parseResponseBody(response);

      if (!response.ok) {
        throw new Error(data?.message || "Оюутны ID авч чадсангүй.");
      }

      const studentId = getStudentIdFromResponse(data);

      if (!studentId) {
        throw new Error("Оюутны ID буруу байна.");
      }

      return studentId;
    };

    const loadReview = async (studentId) =>{
      try {
        const response = await fetch(`/api/studentReview/${studentId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await parseResponseBody(response);

        if (!response.ok || !data) {
          alert(data?.message || "review хүсэлт дээр алдаа гарлаа");
          return;
        }

        setReviews(getReviewList(data).map(normalizeReview));
      }
      catch (e){
        alert("хэрэглэгчийн сэтгэгдэлийг авах холболт дээр алдаа гарлаа "+e);
      }
    };

    const loadAvgRate = async (studentId) =>{
      try {
        const response = await fetch(`/api/studentReview/avg/${studentId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await parseResponseBody(response);

        if (!response.ok || data === null) {
          alert(data?.message || "үнэлгээний голч авах хүсэлт дээр алдаа гарлаа");
          return;
        }

        setAverageRate(getAverageRate(data));

      }
      catch (e){
        alert("үнэлгэгэний голч дээр алдаа гарлаа "+e);
      }
    };

    const loadReviewData = async () => {
      try {
        const studentId = await loadStudentId();

        await Promise.all([
          loadReview(studentId),
          loadAvgRate(studentId),
        ]);
      } catch (error) {
        alert(error.message || "Сэтгэгдлийн мэдээллийг авч чадсангүй.");
      }
    };

    loadReviewData();
>>>>>>> origin/saina
    loadProfile();
  }, []);

  const handleSave = async () => {
    let payload;

    try {
      payload = buildStudentProfilePayload(profile);
    } catch (error) {
      alert(error.message);
      return;
    }

    setIsSaving(true);

    try {
<<<<<<< HEAD
      function getCookie(name) {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith(name + "="))
          ?.split("=")[1];
      }

      const token = getCookie("token");
=======
>>>>>>> origin/saina
      await updateStudentProfile({
        payload,
      });

      if (resumeFile) {
        await uploadStudentResume({ file: resumeFile });
        setProfile((currentProfile) => ({
          ...currentProfile,
          resume: resumeFile.name,
        }));
        setResumeFile(null);
      }

      setIsEditing(false);
      alert("Профайлын мэдээлэл амжилттай хадгалагдлаа.");
    } catch {
      alert("Профайлын мэдээллийг хадгалж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout role="student">
      <Content className={styles.content}>
        <h1 className={styles.pageTitle}>Профайл</h1>

        <div className={styles.profileGrid}>
          <Card className={styles.leftCard}>
            <div className={styles.avatarSection}>
              <Avatar size={100}>{profile.fullName}</Avatar>
              <Title level={3}>{profile.fullName}</Title>
              <Text type="secondary">{profile.major}</Text>

              <div className={styles.tags}>
                <Tag color="green">Сургууль : {profile.school}</Tag>
                <Tag color="yellow">Курс : {profile.level}</Tag>
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
                <Button type="primary" loading={isSaving} onClick={handleSave}>
                  Хадгалах
                </Button>
              ) : (
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  Засах
                </Button>
              )}
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <label>Овог, нэр</label>
                <Input
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      fullName: e.target.value,
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
                      major: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <label>Утас</label>
                <Input
                  inputMode="numeric"
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
                <label>Сургууль</label>
                <Input
                  disabled={!isEditing}
                  value={profile.school}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      school: e.target.value, 
                    })
                  }
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>

              <Col span={12}>
                <label>Курс</label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  disabled={!isEditing}
                  value={profile.level}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      gpa: e.target.value,
                    })
                  }
                />
              </Col>
              
              <Col span={12}>
                <label>GPA</label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
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

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <label>Имэйл</label>
                <Input disabled value={profile.email} />
              </Col>
            </Row>

            <div className={styles.bio}>
              <label>Resume (PDF)</label>
<<<<<<< HEAD
              <p>
                <FileTextOutlined /> {profile.resume || "Resume байхгүй"}
              </p>
=======

              {isEditing ? (
                <Upload
                  accept="application/pdf,.pdf"
                  beforeUpload={(file) => {
                    setResumeFile(file);
                    return false;
                  }}
                  fileList={resumeFile ? [resumeFile] : []}
                  maxCount={1}
                  onRemove={() => {
                    setResumeFile(null);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Resume сонгох</Button>
                </Upload>
              ) : (
                <p>
                  <FileTextOutlined /> {profile.resume || "Resume байхгүй"}
                </p>
              )}
>>>>>>> origin/saina
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
<<<<<<< HEAD
                  Дундаж: {averageRate} <StarFilled style={{ color: "#fadb14" }} />
=======
                Дундаж: {averageRate.toFixed(1)} <StarFilled style={{ color: "#fadb14" }} />
>>>>>>> origin/saina
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
<<<<<<< HEAD
              <Card key={index} size="small" style={{ marginBottom: 15 }}>
                <Tag>{item.organizationName}</Tag>
                <div style={{ margin: "10px 0" }}>
                  <Rate disabled value={item.score} />
                </div>
                <br />
              </Card>
=======
            <Card key={index} size="small" style={{ marginBottom: 15 }}>
                <Tag>
                  {item.name}
                </Tag>
                <div style={{ margin: "10px 0" }}>
                <Rate disabled value={item.rate} />
                </div>
                <Text>{item.comment}</Text>
                <br />
                <Text type="secondary">{item.createdAt}</Text>
            </Card>
>>>>>>> origin/saina
            ))
          )}
        </Card>
      </Content>
    </MainLayout>
  );
}