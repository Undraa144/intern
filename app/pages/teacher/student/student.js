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
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import styles from "./student.module.scss";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedStudents = localStorage.getItem(
      "students"
    );

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const saveStudents = (data) => {
    setStudents(data);

    localStorage.setItem(
      "students",
      JSON.stringify(data)
    );
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Оюутан устгах уу?",
      content: "Энэ үйлдлийг буцаах боломжгүй.",

      onOk: () => {
        const updatedStudents =
          students.filter(
            (student) => student.id !== id
          );

        saveStudents(updatedStudents);

        message.success(
          "Оюутан устгагдлаа"
        );
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let updatedStudents = [
        ...students,
      ];

      if (editingStudent) {
        updatedStudents =
          updatedStudents.map(
            (student) =>
              student.id ===
              editingStudent.id
                ? {
                    ...student,
                    ...values,
                  }
                : student
          );

        message.success(
          "Оюутны мэдээлэл шинэчлэгдлээ"
        );
      } else {
        updatedStudents.unshift({
          id: Date.now(),
          ...values,
        });

        message.success(
          "Оюутан нэмэгдлээ"
        );
      }

      saveStudents(updatedStudents);

      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Оюутнууд</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
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
        <Card
          key={student.id}
          className={styles.card}
        >
          <h3>{student.name}</h3>

          <p>
            <strong>Имэйл:</strong>{" "}
            {student.email}
          </p>

          <p>
            <strong>Утас:</strong>{" "}
            {student.phone}
          </p>

          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                handleEdit(student)
              }
            >
              Засах
            </Button>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(student.id)
              }
            >
              Устгах
            </Button>
          </Space>
        </Card>
      ))}

      <Modal
        open={open}
        title={
          editingStudent
            ? "Оюутан засах"
            : "Оюутан нэмэх"
        }
        onOk={handleSave}
        onCancel={() =>
          setOpen(false)
        }
        okText="Хадгалах"
        cancelText="Болих"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Нэр"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Нэр оруулна уу",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Имэйл"
            name="email"
            rules={[
              {
                required: true,
                message:
                  "Имэйл оруулна уу",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Утас"
            name="phone"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}