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

function getReportId(payload) {
  if (typeof payload === "number" || typeof payload === "string") {
    return payload;
  }

  const report = payload?.data ?? payload?.report ?? payload?.result ?? payload;

  if (typeof report === "number" || typeof report === "string") {
    return report;
  }

  return report?.reportId ?? report?.id;
}

function getFileName(payload) {
  const file = payload?.data ?? payload?.file ?? payload?.result ?? payload;

  if (typeof file === "string") {
    return file;
  }

  return (
    file?.fileName ??
    file?.filename ??
    file?.originalFileName ??
    file?.originalFilename ??
    file?.name
  );
}

export default function ReportPage() {
  const [open, setOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form] = Form.useForm();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function loadReports() {
      try {
        const response = await fetch("/api/reports", {
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Тайлангийн жагсаалтыг авч чадсангүй.");
        }

        const data = Array.isArray(result)
          ? result
          : result.data ?? result.reports ?? result.content ?? [];
        const reportList = Array.isArray(data)
          ? data
          : data.content ?? data.reports ?? [];

        if (isActive) {
          setReports(
            reportList.map((report) => ({
              ...report,
              id: report.reportId ?? report.id,
              title: report.title ?? report.reportTitle ?? "Гарчиггүй тайлан",
              description: report.description ?? report.content ?? "",
              date:
                report.submittedAt ??
                report.createdAt ??
                report.reportDate ??
                report.date,
              status: String(
                report.status ?? report.reportStatus ?? "review"
              ).toLowerCase(),
              file:
                report.fileName ??
                report.filename ??
                report.originalFileName ??
                report.originalFilename ??
                report.file?.name ??
                report.fileUrl ??
                "",
              comment:
                report.teacherComment ??
                report.feedback ??
                report.comment,
            }))
          );
        }
      } catch (error) {
        if (isActive) {
          setReports([]);
          message.error(error.message || "Тайлангийн жагсаалтыг авч чадсангүй.");
        }
      }
    }

    loadReports();
    return () => {
      isActive = false;
    };
  }, []);

  const saveReports = (data) => {
    setReports(data);
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

  const handleConfirmDelete = async () => {
    const reportId = deleteTarget?.id;

    if (reportId === undefined || reportId === null || reportId === "") {
      message.error("Устгах тайлангийн дугаар олдсонгүй.");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/reports/${reportId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Тайланг устгахад алдаа гарлаа.");
      }
     

      const updatedReports = reports.filter(
        (report) => report.id !== reportId
      );

      saveReports(updatedReports);
      message.success("Тайлан устгагдлаа");
      setDeleteTarget(null);
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (values) => {
    const selectedFile = values.file?.[0]?.originFileObj;
    let reportId = editingReport?.id;
    let uploadedFileName = selectedFile?.name;

    setIsSubmitting(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";
      function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
      }

      const token = getCookie("token");
      const authResponse = await fetch(`${API_BASE}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!authResponse.ok) {
        throw new Error("Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
      }

      if (editingReport) {
        if (reportId === undefined || reportId === null || reportId === "") {
          throw new Error("Засах тайлангийн дугаар олдсонгүй.");
        }

        const reportResponse = await fetch(
          `/api/reports/${encodeURIComponent(reportId)}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              description: values.description,
            }),
          }
        );
        const data = await reportResponse.json().catch(() => ({}));

        if (!reportResponse.ok) {
          throw new Error(data.message || "Тайланг засахад алдаа гарлаа.");
        }
      } else {
        const reportResponse = await fetch(`${API_BASE}/api/reports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
          }),
        });

        const data = await reportResponse.json().catch(() => ({}));

        if (!reportResponse.ok) {
          if (reportResponse.status === 401) {
            throw new Error(data.message || "Дахин нэвтэрнэ үү");
          }
          throw new Error(
            data.message || "Тайлангийн мэдээлэл илгээхэд алдаа гарлаа"
          );
        }

        reportId = getReportId(data);
      }

      if (selectedFile) {
        if (reportId === undefined || reportId === null || reportId === "") {
          throw new Error("Үүсгэсэн тайлангийн дугаар олдсонгүй.");
        }

        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);

        const response = await fetch(
          `/api/reports/file/${encodeURIComponent(reportId)}`,
          {
            method: editingReport ? "PUT" : "POST",
            credentials: "include",
            body: formData,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Тайлан үүссэн боловч файл оруулах эрхийг backend зөвшөөрсөнгүй."
            );
          }
          throw new Error(
            data.message || "Тайлангийн файл илгээхэд алдаа гарлаа"
          );
        }

        uploadedFileName = getFileName(data) || selectedFile.name;
      }

      if (editingReport) {
        const updatedReports = reports.map((report) =>
          report.id === editingReport.id
            ? {
                ...report,
                title: values.title,
                description: values.description,
                file: uploadedFileName || report.file,
                fileName: uploadedFileName || report.fileName,
                originalFileName:
                  uploadedFileName || report.originalFileName,
              }
            : report
        );

        saveReports(updatedReports);
        message.success("Тайлан шинэчлэгдлээ");
      } else {
        const newReport = {
          id: reportId,
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
          confirmLoading={isDeleting}
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
              label="Файл"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={(event) => event?.fileList || []}
              rules={
                editingReport
                  ? []
                  : [{ required: true, message: "Файл сонгоно уу" }]
              }
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Файл сонгох</Button>
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
