"use client";

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
  Tag,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
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

  const [form] = Form.useForm();

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem("studentReviews")) || [];

    setReviews(savedReviews);
  }, []);

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
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

  const handleSave = () => {
    form.validateFields().then((values) => {
      let updatedStudents = [...students];

      if (editingStudent) {
        updatedStudents = updatedStudents.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...values }
            : student
        );

        message.success("Оюутны мэдээлэл шинэчлэгдлээ");
      } else {
        updatedStudents.unshift({
          id: Date.now(),
          ...values,
        });

        message.success("Оюутан нэмэгдлээ");
      }

      saveStudents(updatedStudents);

      setOpen(false);
      form.resetFields();
    });
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

      <Card title="Үнэлгээ, сэтгэгдэл" style={{ marginTop: 30 }}>
        {reviews.length === 0 ? (
          <Text type="secondary">
            Одоогоор сэтгэгдэл байхгүй.
          </Text>
        ) : (
          reviews.map((item, index) => (
            <Card key={index} size="small" style={{ marginBottom: 15 }}>
              <Tag color={item.from === "Багш" ? "blue" : "green"}>
                {item.from}
              </Tag>

              <div style={{ margin: "10px 0" }}>
                <Rate disabled value={item.rate} />
              </div>

              <Text>{item.comment}</Text>

              <br />

              <Text type="secondary">
                {item.date}
              </Text>
            </Card>
          ))
        )}
      </Card>

      <Modal
        open={open}
        title={editingStudent ? "Оюутан засах" : "Оюутан нэмэх"}
        onOk={handleSave}
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