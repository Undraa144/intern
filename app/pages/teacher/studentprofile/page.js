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
  Modal ,
  Rate, 
} from "antd";

import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  FileTextOutlined,
  StarFilled,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import MainLayout from "@/app/MainLayout";

const { TextArea } = Input;
const {  Content,  } = Layout;
const { Title, Text } = Typography;

export default function StudentProfilePage() {

const [reviews, setReviews] = useState([]);
const [reviewOpen, setReviewOpen] = useState(false);
const [rate, setRate] = useState(0);
const [comment, setComment] = useState("");
const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({
  fullName: "Батболдын Тэмүүлэн",
  major: "Програм хангамж",
  phone: "99112233",
  email: "temuulen@example.mn",
  gpa: "3.65",
  bio: "Гуравдугаар курсын програм хангамжийн оюутан.",
  resume: "Resume.pdf",
  skills: "React, Next.js, JavaScript, Python, SQL",
  languages: "Монгол, English",
});

useEffect(() => {
  const savedProfile =
    localStorage.getItem("studentProfile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    setProfile({
      fullName:
        data.fullName ||
        "Батболдын Тэмүүлэн",

      major:
        data.major ||
        "Програм хангамж",

      phone:
        data.phone ||
        "99112233",

      email:
        data.email ||
        "temuulen@example.mn",

      gpa:
        data.gpa ||
        "3.65",

      bio:
        data.bio ||
        "Гуравдугаар курсын програм хангамжийн оюутан.",

      resume:
        data.resume ||
        "Resume.pdf",

      skills:
        data.skills ||
        "React, Next.js, JavaScript, Python, SQL",

      languages:
        data.languages ||
        "Монгол, English",
    });
  }
}, []);


useEffect(() => {
  const savedReviews =
    JSON.parse(localStorage.getItem("studentReviews")) || [];

  setReviews(savedReviews);
}, []);

const averageRate =
reviews.length > 0
? (
reviews.reduce((sum, item) => sum + item.rate, 0) / reviews.length
).toFixed(1)
: 0;


  return (
    <MainLayout role="teacher">
      <Content className={styles.content}>
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

              <div className={styles.tags}>
                <Tag color="blue">
                  GPA {profile.gpa}
                </Tag>
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
                <FileTextOutlined />
                Resume.pdf
              </p>
            </div>
              
          </Card>

          <Card className={styles.rightCard}>
            <div className={styles.profileHeader}>
              <Title level={4}>
                Хувийн мэдээлэл
              </Title>

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

              <Col span={12}>
                <label>GPA</label>

                <Input
                  disabled={!isEditing}
                  value={profile.gpa}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      gpa:
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
                <Button icon={<UploadOutlined />}>
                    Resume сонгох
                </Button>
                </Upload>
            ) : (
                <p>
                <FileTextOutlined />{" "}
                {profile.resume || "Resume байхгүй"}
                </p>
            )}
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
                    <Tag key={index}>
                        {skill.trim()}
                    </Tag>
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
                    <Tag key={index}>
                        {lang.trim()}
                    </Tag>
                    ))}
                </div>
            )}
            </div>
          </Card>
          <Button className={styles.button}
          onClick={() => setReviewOpen(true)}
          >
            Үнэлгээ өгөх
          </Button>
        </div>

        <Modal
          title="Оюутанд үнэлгээ өгөх"
          open={reviewOpen}
          onCancel={() => setReviewOpen(false)}
            onOk={() => {
            const review = {
                from: "Байгууллага",
                rate: rate,
                comment,
                date: new Date().toLocaleDateString(),
            };

            const oldReviews =
                JSON.parse(localStorage.getItem("studentReviews")) || [];

            const updatedReviews = [...oldReviews, review];

            localStorage.setItem(
                "studentReviews",
                JSON.stringify(updatedReviews)
            );

            setReviews(updatedReviews);

            setReviewOpen(false);
            setRate(0);
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
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Сэтгэгдлээ бичнэ үү..."
            />
          </div>
        </Modal>

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