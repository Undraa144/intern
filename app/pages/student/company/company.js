
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


  const handleApply = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };


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

                <div className={styles.rating}>
                <StarFilled  style={{color:"#f0bc00"}}/> {profile.rating} үнэлгээ
                </div>
            </div>
            </div>
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

            <Button type="primary" className={styles.button}
            onClick={() => handleApply(job)}
            >       
                Хүсэлт илгээх
            </Button>
        </Card>

        <Modal
          open={open}
          footer={null}
          onCancel={() => setOpen(false)}
          width={800}
          title={null}
        >
          {selectedJob && (
            <>
              <Title level={3}>
                {selectedJob.title}
              </Title>
        
              <Text type="secondary">
                {selectedJob.company}
              </Text>
        
              <Card
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  background: "#f7f9fc",
                }}
              >
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Text type="secondary">
                      <EnvironmentOutlined /> Байршил
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.location}
                    </Text>
                  </Col>
        
                  <Col span={8}>
                    <Text type="secondary">
                      <ClockCircleOutlined /> Цаг
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.duration}
                    </Text>
                  </Col>
        
                  <Col span={8}>
                    <Text type="secondary">
                      <DollarOutlined /> Цалин
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.salary}
                    </Text>
                  </Col>
        
                  <Col span={8}>
                    <Text type="secondary">
                      <BookOutlined /> GPA
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.gpa}
                    </Text>
                  </Col>
        
                  <Col span={8}>
                    <Text type="secondary">
                      <TeamOutlined /> Орон тоо
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.vacancies}
                    </Text>
                  </Col>
        
                  <Col span={8}>
                    <Text type="secondary">
                      <CalendarOutlined /> Эцсийн хугацаа
                    </Text>
                    <br />
                    <Text strong>
                      {selectedJob.deadline}
                    </Text>
                  </Col>
                </Row>
              </Card>
        
              <Title level={5}>Тайлбар</Title>
        
              <Text>
                {selectedJob.description}
              </Text>
        
              <Divider />
        
              <Title level={5}>
                Шаардлагатай мэргэжил
              </Title>
        
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {selectedJob.majors.map((item) => (
                  <Tag key={item}>
                    {item}
                  </Tag>
                ))}
              </div>
        
              <Title level={5}>
                Шаардлагатай чадвар
              </Title>
        
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {selectedJob.skills.map((item) => (
                  <Tag color="blue" key={item}>
                    {item}
                  </Tag>
                ))}
              </div>
        
              <Title level={5}>Хэл</Title>
        
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {selectedJob.languages.map((item) => (
                  <Tag color="green" key={item}>
                    {item}
                  </Tag>
                ))}
              </div>
        
              <Divider />
        
              <Title level={5}>
                Өргөдлийн захидал
              </Title>
        
        <TextArea
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Яагаад энэ дадлагад тохирох талаараа бичнэ үү..."
        />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <Button onClick={() => setOpen(false)}>
                  Хаах
                </Button>
        
        <Button
          type="primary"
          onClick={() => {
            const request = {
              title: selectedJob.title,
              company: selectedJob.company,
              description: coverLetter,
              status: "pending",
              sentDate: new Date().toISOString().split("T")[0],
            };
        
            const oldRequests =
              JSON.parse(localStorage.getItem("requests")) || [];
        
            localStorage.setItem(
              "requests",
              JSON.stringify([...oldRequests, request])
            );
        
            setOpen(false);
            router.push("/pages/student/request");
          }}
        >
          Хүсэлт илгээх
        </Button>
              </div>
            </>
          )}
        </Modal>

        </div>

    </Layout>
  );
}