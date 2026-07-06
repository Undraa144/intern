"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  UserOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
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
      label: <Link href="/pages/student/request">Миний хүсэлтүүд</Link>,
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

  const handleSubmit = (values) => {
    const newReport = {
      id: Date.now(),
      title: values.title,
      week: values.week,
      description: values.description,
      file:
        values.file?.fileList?.[0]?.name ||
        "report.pdf",
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "review",
    };

    const updatedReports = [
      ...reports,
      newReport,
    ];

    setReports(updatedReports);

    localStorage.setItem(
      "reports",
      JSON.stringify(updatedReports)
    );

    message.success(
      "Тайлан амжилттай илгээгдлээ"
    );

    form.resetFields();
    setOpen(false);
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Тайлан илгээх
          </Button>
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

            {report.comment && (
              <Alert
                style={{
                  marginTop: 20,
                }}
                type="info"
                showIcon
                message="Багшийн тэмдэглэл"
                description={
                  report.comment
                }
              />
            )}
          </Card>
        ))}

        <Modal
          title="Тайлан илгээх"
          open={open}
          footer={null}
          onCancel={() =>
            setOpen(false)
          }
          width={700}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Тайлангийн гарчиг"
              name="title"
              rules={[
                {
                  required: true,
                  message:
                    "Гарчиг оруулна уу",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Долоо хоног"
              name="week"
              rules={[
                {
                  required: true,
                  message:
                    "Долоо хоног оруулна уу",
                },
              ]}
            >
              <Input placeholder="Жишээ: 3-р долоо хоног" />
            </Form.Item>

            <Form.Item
              label="Тайлбар"
              name="description"
              rules={[
                {
                  required: true,
                  message:
                    "Тайлбар оруулна уу",
                },
              ]}
            >
              <Input.TextArea
                rows={5}
              />
            </Form.Item>

            <Form.Item
              label="PDF файл"
              name="file"
              valuePropName="fileList"
            >
              <Upload
                beforeUpload={() =>
                  false
                }
                accept=".pdf"
                maxCount={1}
              >
                <Button
                  icon={
                    <UploadOutlined />
                  }
                >
                  PDF сонгох
                </Button>
              </Upload>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Тайлан илгээх
            </Button>
          </Form>
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