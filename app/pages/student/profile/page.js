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
import { parseResponseBody } from "@/app/utils/response-body.mjs";
import { updateStudentProfile } from "@/app/utils/student-profile-api.mjs";
import { buildStudentProfilePayload } from "@/app/utils/student-profile-payload.mjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";

function formatListForInput(value) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRate,setAverageRate] = useState();
  const [profile, setProfile] = useState({
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

  useEffect(message => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_API}/api/students/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await parseResponseBody(response);

        if (!response.ok || !data) {
          alert("Profile request failed");
        }

        setProfile({
          fullName: [data.firstName, data.lastName].filter(Boolean).join(" "),
          major: data.major ?? "",
          university: data.university ?? "",
          courseYear: data.courseYear ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          gpa: data.gpa ?? "",
          bio: data.shortBio ?? data.bio ?? "",
          resume: data.resume ?? "",
          skills: formatListForInput(data.skills),
          languages: formatListForInput(data.languages),
          teacherName: data.teacherFirstName ?? "",
          teacherPhone: data.teacherPhone ?? "",
        });
      } catch {
        alert("Хэрэглэгчийн мэдээллийг авч чадсангүй. Дахин оролдоно уу.");
      }
    };
    const loadReview = async () =>{
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_API}/api/evaluations/student`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await parseResponseBody(response);
        if (!response.ok || !data) {
          alert("review хүсэлт алдааа гарлаа");
        }
        setReviews(data);
      }
      catch (e){
        alert("хэрэглэгчийн сэтгэгдэлийг авах холболт дээр алдаа гарлаа "+e);
      }
    }
    const loadAvgRate = async () =>{
      try {
        const token = localStorage.getItem("token");
        const response = fetch(`${BASE_API}/api/students/avg`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await parseResponseBody(response);
        console.log(data.toString());

      }
      catch (e){
        alert("үнэлгэгэний голч дээр алдаа гарлаа "+e);
      }
    }
    loadAvgRate();
    loadReview();
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
      const token = localStorage.getItem("token");
      await updateStudentProfile({
        baseApi: BASE_API,
        token,
        payload,
      });

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
              <Avatar size={100}>
                {profile.fullName}
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
                <Button type="primary" loading={isSaving} onClick={handleSave}>
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
                <label>Сургууль</label>

                <Input
                  disabled={!isEditing}
                  value={profile.university}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      university: e.target.value,
                    })
                  }
                />
              </Col>

              <Col span={12}>
                <label>Курс</label>

                <Input
                  type="number"
                  min="1"
                  max="10"
                  disabled={!isEditing}
                  value={profile.courseYear}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      courseYear: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <div className={styles.bio}>
              <label>Имэйл</label>

              <Input
                disabled
                value={profile.email}
              />
            </div>

            <div className={styles.bio}>
              <label>Resume (PDF)</label>

              <p>
                <FileTextOutlined /> {profile.resume || "Resume байхгүй"}
              </p>
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
                <Tag>
                  {item.organizationName}
                </Tag>
                <div style={{ margin: "10px 0" }}>
                <Rate disabled value={item.score} />
                </div>
                {/*<Text>{item.comment}</Text>*/}
                <br />
                {/*<Text type="secondary">{item.date}</Text>*/}
            </Card>
            ))
        )}
        </Card>
      </Content>
    </MainLayout>
  );
}
