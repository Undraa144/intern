"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  message,
  Space,
  Rate,
  Typography,
} from "antd";

import {
  PlusOutlined,

  DeleteOutlined,
} from "@ant-design/icons";

import styles from "./student.module.scss";

const { TextArea } = Input;
const { Text } = Typography;

export default function Student() {
  const [reviews, setReviews] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewingStudent, setReviewingStudent] = useState(null);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem("studentReviews")) || [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(savedReviews);
  }, []);

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const saveStudents = (data) => {
    setStudents(data);
    localStorage.setItem("students", JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Оюутан устгах уу?",
      content: "Энэ үйлдлийг буцаах боломжгүй.",

      onOk: () => {
        const updatedStudents = students.filter(
          (student) => student.id !== id
        );

        saveStudents(updatedStudents);

        message.success("Оюутан устгагдлаа");
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let updatedStudents = [...students];

      if (editingStudent) {
        updatedStudents = updatedStudents.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...values }
            : student
        );

        message.success("Оюутны мэдээлэл шинэчлэгдлээ");
      } else {
        setIsSaving(true);
        const response = await fetch("/api/teacher/students", {
          method: "PUT",
          credentials: "include",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          alert(data.message || "Оюутан нэмэхэд алдаа гарлаа.");
        }

        const student = data.data ?? data.student ?? data;
        const addedStudent = Array.isArray(student)
          ? student[0]
          : student;

        updatedStudents.unshift({
          id:
            addedStudent?.studentId ??
            addedStudent?.id ??
            Date.now(),
          ...values,
          ...(addedStudent && typeof addedStudent === "object"
            ? addedStudent
            : {}),
          name:
            addedStudent?.name ??
            addedStudent?.fullName ??
            ([addedStudent?.firstName, addedStudent?.lastName]
              .filter(Boolean)
              .join(" ") || values.name),
          email: addedStudent?.email ?? values.email,
        });

        message.success("Оюутан нэмэгдлээ");
      }

      saveStudents(updatedStudents);

      setOpen(false);
      form.resetFields();
    } catch (error) {
      if (!error?.errorFields) {
        message.error(error.message || "Оюутан нэмэхэд алдаа гарлаа.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenReview = (student) => {
    setReviewingStudent(student);
    setRate(0);
    setComment("");
    setReviewOpen(true);
  };

  const handleSaveReview = () => {
    if (!rate) {
      message.warning("Үнэлгээ өгнө үү");
      return;
    }

    const review = {
    from: "Багш",
    rate,
    comment,
    date: new Date().toLocaleDateString(),
  };

  const reviews =
    JSON.parse(localStorage.getItem("studentReviews")) || [];

  localStorage.setItem(
    "studentReviews",
    JSON.stringify([...reviews, review])
  );

    const oldReviews =
      JSON.parse(localStorage.getItem("studentReviews")) || [];

    const updatedReviews = [...oldReviews, review];

    localStorage.setItem(
      "studentReviews",
      JSON.stringify(updatedReviews)
    );

    setReviews(updatedReviews);

    setReviewOpen(false);
    setReviewingStudent(null);
    setRate(0);
    setComment("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Оюутнууд</h1>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Оюутан нэмэх
        </Button>
      </div>

      <div className={styles.stats}>
        <Card>
          <h2>{students.length}</h2>
          <p>Нийт оюутан</p>
        </Card>
      </div>

      {students.map((student) => (
        <Card key={student.id} className={styles.card}>
          <h3>{student.name}</h3>

          <p>
            <strong>Имэйл:</strong> {student.email}
          </p>
          <Link href="/pages/teacher/studentprofile">
            <Button>
                Дэлгэрэнгүй
            </Button>
          </Link>


          <Space>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(student.id)}
            >
              Устгах
            </Button>

            <Button
              className={styles.button}
              onClick={() => handleOpenReview(student)}
            >
              Үнэлгээ өгөх
            </Button>
          </Space>
        </Card>
      ))}

      <Modal
        title={
          reviewingStudent
            ? `${reviewingStudent.name}-д үнэлгээ өгөх`
            : "Үнэлгээ өгөх"
        }
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
            onOk={() => {
            const review = {
                from: "Багш",
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

        <Rate value={rate} onChange={(value) => setRate(value)} />

        <div style={{ marginTop: 20 }}>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Сэтгэгдлээ бичнэ үү..."
          />
        </div>
      </Modal>

      <Modal
        open={open}
        title={editingStudent ? "Оюутан засах" : "Оюутан нэмэх"}
        onOk={handleSave}
        confirmLoading={isSaving}
        onCancel={() => setOpen(false)}
        okText="Хадгалах"
        cancelText="Болих"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Нэр"
            name="name"
            rules={[{ required: true, message: "Нэр оруулна уу" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Имэйл"
            name="email"
            rules={[{ required: true, message: "Имэйл оруулна уу" }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}
