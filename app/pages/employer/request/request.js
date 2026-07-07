"use client";

import { useState } from "react";
import { Button, Tag, Card } from "antd";
import styles from "./request.module.scss";

export default function Request() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Батболдын Тэмүүлэн",
      major: "Програм хангамж",
      school: "МУИС",
      gpa: 3.65,
      position: "Frontend хөгжүүлэгч дадлагажигч",
      date: "2026.06.15",
      status: "pending",
    },
  ]);

  const handleApprove = (id) => {
    const updated = applications.map((app) =>
      app.id === id
        ? { ...app, status: "approved" }
        : app
    );

    setApplications(updated);
  };

  const handleReject = (id) => {
    const updated = applications.map((app) =>
      app.id === id
        ? { ...app, status: "rejected" }
        : app
    );

    setApplications(updated);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "approved":
        return <Tag color="success">Зөвшөөрөгдсөн</Tag>;

      case "rejected":
        return <Tag color="error">Татгалзсан</Tag>;

      default:
        return <Tag color="warning">Хүлээгдэж буй</Tag>;
    }
  };

  const allCount = applications.length;

  const pendingCount = applications.filter(
    (a) => a.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (a) => a.status === "approved"
  ).length;

  const rejectedCount = applications.filter(
    (a) => a.status === "rejected"
  ).length;

  return (
    <div className={styles.container}>
      <h1>Ирсэн хүсэлтүүд</h1>

      <p>
        Бүгд ({allCount}) | Хүлээгдэж буй ({pendingCount})
        | Зөвшөөрсөн ({approvedCount}) | Татгалзсан ({rejectedCount})
      </p>

      {applications.map((item) => (
        <Card className={styles.card}>
        <div className={styles.left}>
            <div className={styles.avatar}>
            БТ
            </div>

            <div className={styles.info}>
            <h3>{item.name}</h3>

            <p>
                {item.major} · {item.school}
            </p>

            <div className={styles.meta}>
                <span className={styles.gpa}>
                GPA {item.gpa}
                </span>

                <span className={styles.position}>
                {item.position} · {item.date}
                </span>
            </div>
            </div>
        </div>

        <div>
            <div className={styles.status}>
            {getStatusTag(item.status)}
            </div>

            <div className={styles.actions}>
            <Button>
                Дэлгэрэнгүй
            </Button>

            {item.status === "pending" && (
                <>
                <Button
                    type="primary"
                    onClick={() =>
                    handleApprove(item.id)
                    }
                >
                    ✓ Зөвшөөрөх
                </Button>

                <Button
                    danger
                    onClick={() =>
                    handleReject(item.id)
                    }
                >
                    ✕ Татгалзах
                </Button>
                </>
            )}
            </div>
        </div>
        </Card>
      ))}
    </div>
  );
}