"use client";

import { useState, useEffect, useCallback } from "react";
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
  Typography,
  Row,
  Col,
  Divider,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  TeamOutlined,
  EyeOutlined,
  CalendarOutlined,
  BookOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import styles from "./ad.module.scss";

const { Title, Text } = Typography;

export default function Ad({ searchText = "" }) {
  const [jobs, setJobs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form] = Form.useForm();

  const loadMyPostings = useCallback(async () => {
    const response = await fetch("/api/postings/my", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Миний заруудыг ачаалж чадсангүй.");
    }

    const payload = Array.isArray(data)
      ? data
      : data.content ?? data.postings ?? data.data ?? [];
    const postings = Array.isArray(payload) ? payload : [];

    setJobs(
      postings.map((posting) => ({
        ...posting,
        id: posting.id ?? posting.postingId,
        company: posting.company ?? posting.companyName ?? "",
        majors: posting.requiredMajors ?? posting.majors ?? [],
        skills: posting.requiredSkills ?? posting.skills ?? [],
        gpa: posting.minGpa ?? posting.gpa,
        positions: posting.vacancyCount ?? posting.positions,
        vacancies: posting.vacancyCount ?? posting.vacancies,
        views: posting.views ?? posting.viewCount ?? 0,
        salary:
          posting.salary ??
          (posting.isSalaryUnspecified
            ? "Тохиролцоно"
            : `${posting.salaryMin ?? 0} - ${posting.salaryMax ?? 0} ₮`),
      }))
    );
  }, []);

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");

    if (savedJobs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobs(JSON.parse(savedJobs));
    } else {
      const demoJobs = [
        {
          id: 1,
          company: "Instagram",
          title: "Marketing",
          image: "/company.jpeg",
          color: "#ece9ff",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 2,
          company: "Unitel",
          title: "IT engineer",
          image: "/company.jpeg",
          color: "#e9faf6",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 3,
          company: "MSC",
          title: "Design",
          image: "/company.jpeg",
          color: "#fff0e6",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 4,
          company: "Khan Bank",
          title: "Finance",
          image: "/company.jpeg",
          color: "#fdf0f5",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 5,
          company: "Ub Даатгал",
          title: "Human Resource",
          image: "/company.jpeg",
          color: "#e8f6ff",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 6,
          company: "DataTex Солюшнс",
          title: "Data Analysis",
          image: "/company.jpeg",
          color: "#fff0f8",
          location: "Улаанбаатар",
          duration: "20 цаг / 7 хоног",
          salary: "600 - 900 мянга ₮",
          gpa: "3.20",
          positions: 1,
          vacancies: "1",
          deadline: "2026.07.15",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Бодит бизнесийн өгөгдөл дээр шинжилгээ хийж, тайлан дашбоард бэлтгэх ажилд оролцоно. Python, SQL мэдлэгтэй байх шаардлагатай.",
          majors: ["Програм хангамж", "Статистик", "Математик"],
          skills: ["Python", "SQL", "Excel"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 7,
          company: "Google",
          title: "Software Engineer",
          image: "/company.jpeg",
          color: "#f3f6fb",
          location: "Улаанбаатар",
          duration: "30 цаг / 7 хоног",
          salary: "1,200,000 ₮",
          gpa: "3.00",
          positions: 2,
          vacancies: "2",
          deadline: "2026.08.01",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
          majors: ["Програм хангамж"],
          skills: ["React", "Next.js", "Node.js"],
          languages: ["Монгол", "Англи"],
        },
        {
          id: 8,
          company: "Slack",
          title: "Project Manager",
          image: "/company.jpeg",
          color: "#fff3d9",
          location: "Улаанбаатар",
          duration: "30 цаг / 7 хоног",
          salary: "1,200,000 ₮",
          gpa: "3.00",
          positions: 2,
          vacancies: "2",
          deadline: "2026.08.01",
          status: "Идэвхтэй",
          views: 0,
          description:
            "Frontend болон Backend хөгжүүлэлтийн төсөл дээр ажиллана.",
          majors: ["Програм хангамж"],
          skills: ["React", "Next.js", "Node.js"],
          languages: ["Монгол", "Англи"],
        },
      ];

      setJobs(demoJobs);
      localStorage.setItem("jobs", JSON.stringify(demoJobs));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMyPostings().catch((error) => {
      message.error(error.message || "Миний заруудыг ачаалж чадсангүй.");
    });
  }, [loadMyPostings]);

  const saveJobs = (data) => {
    setJobs(data);
    localStorage.setItem("jobs", JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingJob(null);
    form.resetFields();
    setFormOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    form.setFieldsValue(job);
    setFormOpen(true);
  };

  const handleDelete = async (job) => {
    try {
      const response = await fetch(`/api/postings/${job.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          description: job.description,
          requiredMajors: toList(job.majors),
          minGpa: Number(job.gpa),
          requiredSkills: toList(job.skills),
          salaryMin: Number(job.salaryMin),
          salaryMax: Number(job.salaryMax),
          vacancyCount: Number(job.positions),
          deadline: job.deadline,
        }),
      });
      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText;
        try {
          const data = JSON.parse(responseText);
          errorMessage = data.message || data.error || responseText;
        } catch {
          // The backend may return plain text.
        }
        throw new Error(errorMessage || "Зар устгахад алдаа гарлаа.");
      }

      await loadMyPostings();
      message.success("Амжилттай устлаа");
    } catch (error) {
      message.error(error.message || "Зар устгахад алдаа гарлаа.");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let updatedJobs = [...jobs];

      if (editingJob) {
        updatedJobs = updatedJobs.map((job) =>
          job.id === editingJob.id ? { ...job, ...values } : job
        );

        message.success("Зар шинэчлэгдлээ");
      } else {
        setIsSaving(true);
        const response = await fetch("/api/postings", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            requiredMajors: toList(values.majors),
            minGpa: Number(values.gpa),
            requiredSkills: toList(values.skills),
            salaryMin: Number(values.salary),
            salaryMax: Number(values.salary),
            vacancyCount: Number(values.positions),
            deadline: values.deadline?.includes("T")
              ? values.deadline
              : `${values.deadline}T23:59:59`,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Зар нэмэхэд алдаа гарлаа.");
        }

        message.success("Шинэ зар нэмэгдлээ");
      }

      if (editingJob) {
        saveJobs(updatedJobs);
      } else {
        await loadMyPostings();
      }

      setFormOpen(false);
      form.resetFields();
    } catch (error) {
      if (!error?.errorFields) {
        message.error(error.message || "Зар хадгалахад алдаа гарлаа.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setDetailOpen(true);

    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, views: (j.views || 0) + 1 } : j
    );
    saveJobs(updatedJobs);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const toList = (value) => {
    if (Array.isArray(value)) return value;
    return (value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchText.toLowerCase();
    return (
      (job.title || "").toLowerCase().includes(q) ||
      (job.company || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Миний зарууд</h1>
          <p>Нийт {jobs.length} зар</p>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Зар нэмэх
        </Button>
      </div>

      {filteredJobs.map((job) => (
        <Card key={job.id} className={styles.jobCard}>
          <div className={styles.top}>
            <div>
              <h3>
                {job.title}
                <Tag color="success">
                  {job.status === "OPEN" ? "Идэвхтэй" : job.status}
                </Tag>
              </h3>

              <p>{job.description}</p>
            </div>

            <Space size={18}>
              <EyeOutlined
                className={styles.view}
                onClick={() => handleView(job)}
              />

              <EditOutlined
                className={styles.edit}
                onClick={() => handleEdit(job)}
              />

              <DeleteOutlined
                className={styles.delete}
                onClick={() => handleDelete(job)}
              />
            </Space>
          </div>
        </Card>
      ))}

      <Modal
        open={detailOpen}
        footer={null}
        onCancel={handleCloseDetail}
        width={800}
        title={null}
      >
        {selectedJob && (
          <>
            <Title level={3}>{selectedJob.title}</Title>

            <Text type="secondary">{selectedJob.company}</Text>

            <Card
              style={{
                marginTop: 20,
                marginBottom: 20,
                background: "#f7f9fc",
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={8}>
                  <Text type="secondary">
                    <EnvironmentOutlined /> Байршил
                  </Text>
                  <br />
                  <Text strong>{selectedJob.location}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <ClockCircleOutlined /> Цаг
                  </Text>
                  <br />
                  <Text strong>{selectedJob.duration}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <DollarOutlined /> Цалин
                  </Text>
                  <br />
                  <Text strong>{selectedJob.salary}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <BookOutlined /> GPA
                  </Text>
                  <br />
                  <Text strong>{selectedJob.gpa}</Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <TeamOutlined /> Орон тоо
                  </Text>
                  <br />
                  <Text strong>
                    {selectedJob.vacancies ?? selectedJob.positions}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text type="secondary">
                    <CalendarOutlined /> Эцсийн хугацаа
                  </Text>
                  <br />
                  <Text strong>{selectedJob.deadline}</Text>
                </Col>
              </Row>
            </Card>

            <Title level={5}>Тайлбар</Title>

            <Text>{selectedJob.description}</Text>

            <Divider />

            <Title level={5}>Шаардлагатай мэргэжил</Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {toList(selectedJob.majors).map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>

            <Title level={5}>Шаардлагатай чадвар</Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {toList(selectedJob.skills).map((item) => (
                <Tag color="blue" key={item}>
                  {item}
                </Tag>
              ))}
            </div>

            <Title level={5}>Хэл</Title>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {toList(selectedJob.languages).map((item) => (
                <Tag color="green" key={item}>
                  {item}
                </Tag>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <Button onClick={handleCloseDetail}>Хаах</Button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={formOpen}
        title={editingJob ? "Зар засах" : "Шинэ зар нэмэх"}
        onCancel={() => setFormOpen(false)}
        onOk={handleSave}
        confirmLoading={isSaving}
        okText="Хадгалах"
        cancelText="Болих"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Гарчиг"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Тайлбар"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Байршил" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="Цаг" name="duration">
            <Input />
          </Form.Item>          

          <Form.Item label="Цалин" name="salary">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="GPA" name="gpa">
            <Input />
          </Form.Item>

          <Form.Item label="Мэрэгжил" name="majors">
            <Input />
          </Form.Item>

          <Form.Item label="Чадварууд" name="skills">
            <Input />
          </Form.Item>

          <Form.Item label="Хэл" name="languages">
            <Input />
          </Form.Item>

          <Form.Item label="Орон тоо" name="positions">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          
          <Form.Item label="Дуусах хугацаа" name="deadline">
            <Input placeholder="2026.07.20" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
