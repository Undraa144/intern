"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.scss";

import {
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
import MainLayout from "@/app/MainLayout";

const {  Content } = Layout;
const { Title, Text } = Typography;

export default function ReportPage() {
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

const savedReports =
  JSON.parse(localStorage.getItem("reports")) || [];
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
    <MainLayout role="student">
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
    </MainLayout>

  );
}