"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  Layout,
  Menu,
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
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function ProfilePage() {
  const [current, setCurrent] = useState("5");
  const currentYear = new Date().getFullYear();

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

  const menuItems = [
    {
      key: "1",
      label: <Link href="/pages/student/home">Тойм</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: <Link href="/pages/student/search">Зар хайх</Link>,
      icon: <FileSearchOutlined />,
    },
    {
      key: "3",
      label: (
        <Link href="/pages/student/request">
          Миний хүсэлтүүд
        </Link>
      ),
      icon: <InboxOutlined />,
    },
    {
      key: "4",
      label: <Link href="/pages/student/report">Тайлан</Link>,
      icon: <CopyOutlined />,
    },
    {
      key: "5",
      label: <Link href="/pages/student/profile">Профайл</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 40px",
        }}
      >
        <div className={styles.header}>
          <Link href="/pages/student/home">
            <img
              src="/logo.png"
              alt="logo"
              width={180}
              height={40}
              className={styles.logo}
            />
          </Link>

          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            items={menuItems}
            onClick={onClick}
            className={styles.menu}
          />

          <div className={styles.actions}>
            <Button>
              <Link href="/">Sign Out</Link>
            </Button>

          </div>
        </div>
      </Header>

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
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#fff",
        }}
      >
        InternHub © {currentYear}
      </Footer>
    </Layout>
  );
}