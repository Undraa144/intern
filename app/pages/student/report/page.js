"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.scss";

import {
  FileWordOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
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
  Space,
} from "antd";
import MainLayout from "@/app/MainLayout";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ReportPage() {
  const [open, setOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "1-р долоо хоногийн тайлан",
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
      // Restore client-only persisted data after the page has mounted.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReports(savedReports);
    }
  }, []);

  const saveReports = (data) => {
    setReports(data);
    localStorage.setItem("reports", JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingReport(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    form.setFieldsValue({
      title: report.title,
      description: report.description,
    });
    setOpen(true);
  };

  const handleDeleteClick = (report) => {
    setDeleteTarget(report);
  };

  const handleConfirmDelete = () => {
    const updatedReports = reports.filter(
      (report) => report.id !== deleteTarget.id
    );

    saveReports(updatedReports);
    message.success("Тайлан устгагдлаа");
    setDeleteTarget(null);
  };

  const handleSubmit = async (values) => {
    const selectedFile = values.file?.[0]?.originFileObj;

    setIsSubmitting(true);

    try {
      const authResponse = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!authResponse.ok) {
        throw new Error("Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
      }

      if (!editingReport) {
        const reportResponse = await fetch("/api/reports", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
          }),
        });

        if (!reportResponse.ok) {
          const data = await reportResponse.json().catch(() => ({}));
          if (reportResponse.status === 401) {
            throw new Error(data.message || "Дахин нэвтэрнэ үү");
          }
          throw new Error(
            data.message || "Тайлангийн мэдээлэл илгээхэд алдаа гарлаа"
          );
        }
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);

        const response = await fetch("/api/reports/file", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status === 401) {
            throw new Error(
              "Тайлан үүссэн боловч файл оруулах эрхийг backend зөвшөөрсөнгүй."
            );
          }
          throw new Error(data.message || "Тайлангийн файл илгээхэд алдаа гарлаа");
        }
      }

      if (editingReport) {
        const updatedReports = reports.map((report) =>
          report.id === editingReport.id
            ? {
                ...report,
                title: values.title,
                description: values.description,
                file: values.file?.[0]?.name || report.file,
              }
            : report
        );

        saveReports(updatedReports);
        message.success("Тайлан шинэчлэгдлээ");
      } else {
        const newReport = {
          id: Date.now(),
          title: values.title,
          description: values.description,
          file: selectedFile?.name || "",
          date: new Date().toISOString().split("T")[0],
          status: "review",
        };

        const updatedReports = [...reports, newReport];

        saveReports(updatedReports);
        message.success("Тайлан амжилттай илгээгдлээ");
      }

      form.resetFields();
      setEditingReport(null);
      setOpen(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout role="student">
      <Content className={styles.content}>
        <div className={styles.reportHeader}>
          <div>
            <Title level={2}>Тайлан</Title>

            <Text type="secondary">
              Нийт {reports.length} тайлан илгээсэн
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Тайлан илгээх
          </Button>
        </div>

        {reports.map((report) => (
          <Card key={report.id} className={styles.reportCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Title level={4}>{report.title}</Title>

              <Space>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(report)}
                >
                  Засах
                </Button>

                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(report)}
                >
                  Устгах
                </Button>
              </Space>
            </div>

            <div
              style={{
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              {report.status === "approved" ? (
                <Tag color="success">Баталгаажсан</Tag>
              ) : (
                <Tag color="warning">Шалгаж буй</Tag>
              )}
            </div>

            <p>{report.description}</p>

            <div>
              <a href="#">
                <FileWordOutlined /> {report.file}
              </a>
            </div>

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
          title="Тайлан устгах уу?"
          open={!!deleteTarget}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          okText="Устгах"
          okButtonProps={{ danger: true }}
          cancelText="Болих"
        >
          <p>Энэ үйлдлийг буцаах боломжгүй.</p>
        </Modal>

        <Modal
          title={editingReport ? "Тайлан засах" : "Тайлан илгээх"}
          open={open}
          footer={null}
          onCancel={() => {
            setOpen(false);
            setEditingReport(null);
            form.resetFields();
          }}
          width={700}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Тайлангийн гарчиг"
              name="title"
              rules={[{ required: true, message: "Гарчиг оруулна уу" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Тайлбар"
              name="description"
              rules={[{ required: true, message: "Тайлбар оруулна уу" }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item
              label="DOCX файл"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={(event) => event?.fileList || []}
              rules={
                editingReport
                  ? []
                  : [{ required: true, message: "DOCX файл сонгоно уу" }]
              }
            >
              <Upload
                beforeUpload={() => false}
                accept=".docx"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>DOCX сонгох</Button>
              </Upload>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              {editingReport ? "Хадгалах" : "Тайлан илгээх"}
            </Button>
          </Form>
        </Modal>
      </Content>
    </MainLayout>
  );
}
