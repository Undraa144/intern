"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  UserOutlined,
  AppstoreOutlined,
  BankOutlined ,
  TeamOutlined ,
  SolutionOutlined ,
  FilePdfOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  Button,
  Card,
  Tag,
  Alert,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function ReportPage() {
  const [current, setCurrent] = useState("4");
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

const [commentOpen, setCommentOpen] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);
const [commentText, setCommentText] = useState("");

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "1-р долоо хоногийн тайлан",
      week: "1-р долоо хоног",
      date: "2026.06.22",
      status: "approved",
      description:
        "Багтай танилцаж, хөгжүүлэлтийн орчноо тохируулсан. Git workflow, code review процессстой танилцлаа.",
      file: "week1-report.pdf",
      comment: "Сайн эхэлсэн байна. Үргэлжлүүл.",
    },
    {
      id: 2,
      title: "2-р долоо хоногийн тайлан",
      week: "2-р долоо хоног",
      date: "2026.06.24",
      status: "review",
      description:
        "Хэрэглэгчийн профайл хуудасны компонентийг хөгжүүлсэн. Эхний pull request нэгдсэн.",
      file: "week2-report.pdf",
    },
  ]);

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem("reports")) || [];

    if (savedReports.length > 0) {
      setReports(savedReports);
    }
  }, []);

  const onClick = ({ key }) => {
    setCurrent(key);
  };

  const currentYear = new Date().getFullYear();
  const menuItems = [
    {
      key: "1",
      label: <Link href="/pages/teacher/home">Тойм</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: <Link href="/pages/teacher/company">Компани </Link>,
      icon: <BankOutlined />,
    },
    {
      key: "3",
      label: <Link href="/pages/teacher/student">Оюутан </Link>,
      icon: <TeamOutlined />,
    },
    {
      key: "4",
      label: <Link href="/pages/teacher/report">Тайлан</Link>,
      icon: <SolutionOutlined />,
    },
    {
      key: "5",
      label: <Link href="/pages/teacher/profile">Профайл</Link>,
      icon: <UserOutlined />,
    },
  ];

const handleComment = (report) => {
  setSelectedReport(report);
  setCommentText(report.comment || "");
  setCommentOpen(true);
};

const saveComment = () => {
  const updatedReports = reports.map((report) =>
    report.id === selectedReport.id
      ? {
          ...report,
          comment: commentText,
          status: "approved",
        }
      : report
  );

  setReports(updatedReports);

  localStorage.setItem(
    "reports",
    JSON.stringify(updatedReports)
  );

  setCommentOpen(false);
  setSelectedReport(null);
  setCommentText("");

  message.success("Тэмдэглэл хадгалагдлаа");
};
  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
        }}
      >
        <div className={styles.header}>
          <Link href="/pages/student/home" className={styles.title}>
            <img
              src="/logo.png"
              alt="logo"
              className={styles.logo}
              width={200}
              height={25}
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
        <div className={styles.reportHeader}>
          <div>
            <Title level={2}>Тайлан</Title>

            <Text type="secondary">
              Нийт {reports.length} тайлан
              илгээсэн
            </Text>
          </div>

        </div>

        {reports.map((report) => (
          <Card
            key={report.id}
            className={styles.reportCard}
          >
            <Title level={4}>
              {report.title}
            </Title>

            <Text type="secondary">
              {report.week} • {report.date}
            </Text>

            <div
              style={{
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              {report.status ===
              "approved" ? (
                <Tag color="success">
                  Баталгаажсан
                </Tag>
              ) : (
                <Tag color="warning">
                  Шалгаж буй
                </Tag>
              )}
            </div>

            <p>
              {report.description}
            </p>

            <div>
              <a href="#">
                <FilePdfOutlined />{" "}
                {report.file}
              </a>
            </div>

            <Button
            type="primary"
            size="small"
            style={{ marginBottom: 15 }}
            onClick={() => handleComment(report)}
            >
            Тэмдэглэл бичих
            </Button>



            {report.comment && (
            <Alert
                style={{ marginTop: 20 }}
                type="info"
                showIcon
                message="Багшийн тэмдэглэл"
                description={report.comment}
            />
            )}
          </Card>
        ))}
        <Modal
        title="Багшийн тэмдэглэл"
        open={commentOpen}
        onOk={saveComment}
        onCancel={() => setCommentOpen(false)}
        okText="Хадгалах"
        cancelText="Болих"
        >
        <Input.TextArea
            rows={5}
            value={commentText}
            onChange={(e) =>
            setCommentText(e.target.value)
            }
            placeholder="Тэмдэглэл бичнэ үү..."
        />
        </Modal>

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