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

import styles from "./company.module.scss"

export default function Company() {
  const [company, setCompany] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedCompany = localStorage.getItem(
      "company"
    );

    if (savedCompany) {
      setCompany(JSON.parse(savedCompany));
    }
  }, []);

  const saveCompany = (data) => {
    setCompany(data);

    localStorage.setItem(
      "company",
      JSON.stringify(data)
    );
  };

  const handleAdd = () => {
    setEditingCompany(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    form.setFieldsValue(company);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Компани устгах уу?",
      content: "Энэ үйлдлийг буцаах боломжгүй.",

      onOk: () => {
        const updatedCompany =
          company.filter(
            (company) => company.id !== id
          );

        saveCompany(updatedCompany);

        message.success(
          "Компани устгагдлаа"
        );
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let updatedCompany = [
        ...company,
      ];

      if (editingCompany) {
        updatedCompany =
          updatedCompany.map(
            (company) =>
              company.id ===
              editingCompany.id
                ? {
                    ...company,
                    ...values,
                  }
                : company
          );

        message.success(
          "Компани мэдээлэл шинэчлэгдлээ"
        );
      } else {
        updatedCompany.unshift({
          id: Date.now(),
          ...values,
        });

        message.success(
          "Компани нэмэгдлээ"
        );
      }

      saveCompany(updatedCompany);

      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Компани</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Компани нэмэх
        </Button>
      </div>
      <div className={styles.stats}>
        <Card>
            <h2>{company.length}</h2>
            <p>Нийт Компани</p>
        </Card>

       
        </div>

      {company.map((company) => (
        <Card
          key={company.id}
          className={styles.card}
        >
          <h3>{company.name}</h3>

          <p>
            <strong>Имэйл:</strong>{" "}
            {company.email}
          </p>

          <p>
            <strong>Утас:</strong>{" "}
            {company.phone}
          </p>

          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                handleEdit(company)
              }
            >
              Засах
            </Button>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(company.id)
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
          editingCompany
            ? "Компани засах"
            : "Компани нэмэх"
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