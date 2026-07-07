"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  TeamOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import styles from "./ad.module.scss";

export default function Ad() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [form] = Form.useForm();

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      const demoJobs = [
        {
          id: 1,
          title: "Frontend хөгжүүлэгч дадлагажигч",
          description:
            "React болон Next.js ашиглан бүтээгдэхүүний интерфейс хөгжүүлнэ.",
          salary: "800 - 1200 мянга ₮",
          positions: 2,
          views: 142,
          deadline: "2026.07.20",
          status: "Идэвхтэй",
        },
        {
          id: 2,
          title: "Өгөгдлийн шинжээч дадлагажигч",
          description:
            "Python болон SQL ашиглан өгөгдөл боловсруулах.",
          salary: "600 - 900 мянга ₮",
          positions: 1,
          views: 98,
          deadline: "2026.07.15",
          status: "Идэвхтэй",
        },
      ];

      setJobs(demoJobs);
      localStorage.setItem(
        "jobs",
        JSON.stringify(demoJobs)
      );
    }
  }, []);

  const saveJobs = (data) => {
    setJobs(data);
    localStorage.setItem(
      "jobs",
      JSON.stringify(data)
    );
  };

  const handleAdd = () => {
    setEditingJob(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);

    form.setFieldsValue(job);

    setOpen(true);
  };

const handleDelete = (id) => {
  const updatedJobs = jobs.filter(
    (job) => job.id !== id
  );

  setJobs(updatedJobs);

  localStorage.setItem(
    "jobs",
    JSON.stringify(updatedJobs)
  );

  message.success("Амжилттай устлаа");
};

  const handleSave = () => {
    form.validateFields().then((values) => {
      let updatedJobs = [...jobs];

      if (editingJob) {
        updatedJobs = updatedJobs.map((job) =>
          job.id === editingJob.id
            ? { ...job, ...values }
            : job
        );

        message.success("Зар шинэчлэгдлээ");
      } else {
        updatedJobs.unshift({
          id: Date.now(),
          views: 0,
          status: "Идэвхтэй",
          ...values,
        });

        message.success("Шинэ зар нэмэгдлээ");
      }

      saveJobs(updatedJobs);

      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Миний зарууд</h1>
          <p>Нийт {jobs.length} зар</p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Зар нэмэх
        </Button>
      </div>

      {jobs.map((job) => (
        <Card
          key={job.id}
          className={styles.jobCard}
        >
          <div className={styles.top}>
            <div>
              <h3>
                {job.title}

                <Tag color="success">
                  {job.status}
                </Tag>
              </h3>

              <p>{job.description}</p>
            </div>

            <Space size={18}>
              <EditOutlined
                className={styles.edit}
                onClick={() =>
                  handleEdit(job)
                }
              />

            <DeleteOutlined
            className={styles.delete}
            onClick={() => handleDelete(job.id)}
            />
            </Space>
          </div>

          <div className={styles.meta}>
            <span>
              <DollarOutlined />
              {job.salary}
            </span>

            <span>
              <TeamOutlined />
              {job.positions} орон тоо
            </span>

            <span>
              <EyeOutlined />
              {job.views} үзэлт
            </span>

            <span>
              <CalendarOutlined />
              {job.deadline}
            </span>
          </div>

          <Button className={styles.closeBtn}>
            Хаах
          </Button>
        </Card>
      ))}

      <Modal
        open={open}
        title={
          editingJob
            ? "Зар засах"
            : "Шинэ зар нэмэх"
        }
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText="Хадгалах"
        cancelText="Болих"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Гарчиг"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Тайлбар"
            name="description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Цалин"
            name="salary"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Орон тоо"
            name="positions"
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Дуусах хугацаа"
            name="deadline"
          >
            <Input placeholder="2026.07.20" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}