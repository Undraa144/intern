"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.scss";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import {
  Layout,
  theme,
  Card,
  Tag,
} from "antd";
import MainLayout from "@/app/MainLayout";

const {  Content,  } = Layout;

export default function RequestPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("requests")) || [];

    setRequests(data);
  }, []);

  const approvedCount = requests.filter(
    (item) => item.status === "approved"
  ).length;

  const pendingCount = requests.filter(
    (item) => item.status === "pending"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "rejected"
  ).length;



  return (
    <MainLayout role="student">
      <Content>
        <div className={styles.content}
        >
          <h1 className={styles.pageTitle}>
            Миний хүсэлтүүд
          </h1>

          <div className={styles.stats}>
            <div className={styles.approvedCard}>
              <div>
                <h2>{approvedCount}</h2>
                <p>Зөвшөөрөгдсөн</p>
              </div>

              <div className={styles.iconBox}>
                <CheckCircleOutlined />
              </div>
            </div>

            <div className={styles.pendingCard}>
              <div>
                <h2>{pendingCount}</h2>
                <p>Хүлээгдэж буй</p>
              </div>

              <div className={styles.iconBox}>
                <ClockCircleOutlined />
              </div>
            </div>

            <div className={styles.rejectedCard}>
              <div>
                <h2>{rejectedCount}</h2>
                <p>Татгалзсан</p>
              </div>

              <div className={styles.iconBox}>
                <CloseCircleOutlined />
              </div>
            </div>
          </div>

          {requests.map((item, index) => (
            <Card
              key={index}
              className={styles.requestCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                </div>

                <Tag
                  color={
                    item.status === "approved"
                      ? "success"
                      : item.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {item.status === "approved"
                    ? "Зөвшөөрөгдсөн"
                    : item.status === "rejected"
                    ? "Татгалзсан"
                    : "Хүлээгдэж буй"}
                </Tag>
              </div>

              <p className={styles.description}>
                {item.description}
              </p>

              <div className={styles.dateRow}>
                <span>
                  Илгээсэн: {item.sentDate}
                </span>
              </div>
            </Card>
          ))}

          {requests.length === 0 && (
            <Card>
              <h3>Одоогоор хүсэлт илгээгээгүй байна.</h3>
            </Card>
          )}
        </div>
      </Content>
    </MainLayout>

  );
}