"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Modal,
  Input,
  Button,
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";

import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

import styles from "./shome.module.scss";

const { TextArea } = Input;
const { Title, Text } = Typography;

const jobs = [
    {
    company: "Instagram",
    title: "Marketing",
    image: "/company.jpeg",
    color: "#ece9ff",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Unitel",
    title: "IT engineer",
    image: "/company.jpeg",
    color: "#e9faf6",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "MSC",
    title: "Design",
    image: "/company.jpeg",
    color: "#fff0e6",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Khan Bank",
    title: "Finance",
    image: "/company.jpeg",
    color: "#fdf0f5",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Ub Даатгал ",
    title: "Human Resource",
    image: "/company.jpeg",
    color: "#e8f6ff",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },

  {
    company: "DataTex Солюшнс",
    title: "Data Analysis",
    image: "/company.jpeg",
    color: "#fff0f8",
    location: "Улаанбаатар",
    duration: "20 цаг / 7 хоног",
    salary: "600 - 900 мянга ₮",
    gpa: "3.20",
    vacancies: "1",
    deadline: "2026.07.15",
    description:
      "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
    majors: ["Програм хангамж", "Статистик", "Математик"],
    skills: ["Python", "SQL", "Excel"],
    languages: ["Монгол", "Англи"],
  },
  {
    company: "Google",
    title: "Software Engineer ",
    image: "/company.jpeg",
    color: "#f3f6fb",
    location: "Улаанбаатар",
    duration: "30 цаг / 7 хоног",
    salary: "1,200,000 ₮",
    gpa: "3.00",
    vacancies: "2",
    deadline: "2026.08.01",
    description:
      "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
    majors: ["Програм хангамж"],
    skills: ["React", "Next.js", "Node.js"],
    languages: ["Монгол", "Англи"],
  },
    {
    company: "Slack",
    title: "Project Manager ",
    image: "/company.jpeg",
    color: "#fff3d9",
    location: "Улаанбаатар",
    duration: "30 цаг / 7 хоног",
    salary: "1,200,000 ₮",
    gpa: "3.00",
    vacancies: "2",
    deadline: "2026.08.01",
    description:
      "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
    majors: ["Програм хангамж"],
    skills: ["React", "Next.js", "Node.js"],
    languages: ["Монгол", "Англи"],
  },
];

export default function SHome({ searchText = "" }) {
  
const router = useRouter();
const [coverLetter, setCoverLetter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleApply = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Санал болгох ажил</h1>

      <div className={styles.grid}>
        {filteredJobs.map((job, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.top}
              style={{ backgroundColor: job.color }}
            >
              <Image
                src={job.image}
                alt={job.company}
                width={50}
                height={50}
                className={styles.logo}
              />

              <h3>{job.title}</h3>
              <p>{job.company}</p>

              <div className={styles.tags}>
                <span>Part Time</span>
                <span>Internship</span>
              </div>
            </div>

            <div className={styles.bottom}>
              <span>{job.salary}</span>
              
              <Link href="/pages/student/company">
              <Button>
                Дэлэгрэнгүй харах
              </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <h3 className={styles.empty}>
          Илэрц олдсонгүй
        </h3>
      )}

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
    </section>
  );
}