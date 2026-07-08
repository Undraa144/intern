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

import styles from "./teacher.module.scss";

export default function Teacher() {
  const [teacher, setTeacher] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedTeacher = localStorage.getItem(
      "teacher"
    );

    if (savedTeacher) {
      setTeacher(JSON.parse(savedTeacher));
    }
  }, []);

  const saveTeacher = (data) => {
    setTeacher(data);

    localStorage.setItem(
      "teacher",
      JSON.stringify(data)
    );
  };

  const handleAdd = () => {
    setEditingTeacher(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue(teacher);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Багш устгах уу?",
      content: "Энэ үйлдлийг буцаах боломжгүй.",

      onOk: () => {
        const updatedTeacher =
          teacher.filter(
            (teacher) => teacher.id !== id
          );

        saveTeacher(updatedTeacher);

        message.success(
          "Багш устгагдлаа"
        );
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let updatedTeacher = [
        ...teacher,
      ];

      if (editingTeacher) {
        updatedTeacher =
          updatedTeacher.map(
            (teacher) =>
              teacher.id ===
              editingTeacher.id
                ? {
                    ...teacher,
                    ...values,
                  }
                : teacher
          );

        message.success(
          "Багш мэдээлэл шинэчлэгдлээ"
        );
      } else {
        updatedTeacher.unshift({
          id: Date.now(),
          ...values,
        });

        message.success(
          "Багш нэмэгдлээ"
        );
      }

      saveTeacher(updatedTeacher);

      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Багш</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Багш нэмэх
        </Button>
      </div>
      <div className={styles.stats}>
        <Card>
            <h2>{teacher.length}</h2>
            <p>Нийт Багш</p>
        </Card>

       
        </div>

      {teacher.map((teacher) => (
        <Card
          key={teacher.id}
          className={styles.card}
        >
          <h3>{teacher.name}</h3>

          <p>
            <strong>Имэйл:</strong>{" "}
            {teacher.email}
          </p>

          <p>
            <strong>Утас:</strong>{" "}
            {teacher.phone}
          </p>

          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                handleEdit(teacher)
              }
            >
              Засах
            </Button>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(teacher.id)
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
          editingTeacher
            ? "Багш засах"
            : "Багш нэмэх"
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