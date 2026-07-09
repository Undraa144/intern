
"use client";
import { useRouter } from "next/navigation";
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
  Divider ,
  Rate,
  Space,
} from "antd";

import {
  BankOutlined,
  GlobalOutlined,
  StarFilled ,
  EnvironmentOutlined ,
  ClockCircleOutlined ,
  DollarOutlined ,
  BookOutlined ,
  TeamOutlined ,
  CalendarOutlined ,
} from "@ant-design/icons";

import styles from "./company.module.scss"

const { TextArea } = Input;
const { Title, Text } = Typography

export default function Profile() {


const router = useRouter();

const [coverLetter, setCoverLetter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

const [reviews, setReviews] = useState([]);
const [reviewOpen, setReviewOpen] = useState(false);
const[ name, setName] =useState("")
const [rate, setRate] = useState(0);
const [comment, setComment] = useState("");

  const handleApply = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };


  const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({
  companyName: "ДатаТех Солюшнс",
  industry: "Мэдээллийн технологи",
  rate: 5,
  website: "datatech.mn",
  address: "Сүхбаатар дүүрэг, 1-р хороо",
  description:
    "Бид санхүү, банкны салбарт зориулсан програм хангамжийн шийдэл нийлүүлдэг.",
  verified: true,
});

const job = {
  title: "Frontend Developer Intern",
  company: profile.companyName,
  location: "Улаанбаатар",
  duration: "3 сар",
  salary: "1,500,000₮",
  gpa: "3.0+",
  vacancies: 2,
  deadline: "2026-08-01",
  description: "React, Next.js ашиглан хөгжүүлэлт хийх.",
  majors: [
    "Програм хангамж",
    "Мэдээллийн технологи",
  ],
  skills: [
    "React",
    "Next.js",
    "JavaScript",
  ],
  languages: [
    "Монгол",
    "English",
  ],
};

useEffect(() => {
  const savedReviews =
    JSON.parse(localStorage.getItem("companyReviews")) || [];

  setReviews(savedReviews);
}, []);

useEffect(() => {
  const savedProfile =
    localStorage.getItem("studentProfile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    setProfile({
  companyName: data.companyName || "ДатаТех Солюшнс",
  industry: data.industry || "Мэдээллийн технологи",
  rate: data.rate || 5,
  website: data.website || "datatech.mn",
  address: data.address || "",
  description: data.description ||"Бид санхүү, банкны салбарт зориулсан програм хангамжийн шийдэл нийлүүлдэг.",
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

                <div className={styles.rate}>
                <StarFilled  style={{color:"#f0bc00"}}/> {profile.rate} үнэлгээ
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
          title="Үнэлгээ, сэтгэгдэл"
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