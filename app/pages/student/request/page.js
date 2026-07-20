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
import {toStudentJob} from "@/app/utils/student-job.mjs";
import {parseResponseBody} from "@/app/utils/response-body.mjs";

const {  Content,  } = Layout;

export default function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const API_BASE = process.env.BASE || "http://localhost:8088";
    //status тоог авах холболтыг функц
    const loadStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE}/api/applications/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await parseResponseBody(response);

        setApprovedCount(data.accepted);
        setRejectedCount(data.rejected);
        setPendingCount(data.pending);
      } catch (error) {
        alert("status авах холболт дээр алдаа гарлаа ", error);
      }
    };
    //application авах холболт
    const loadApp = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await parseResponseBody(response);
        setRequests(data);
      }
      catch (e) {
        console.log("application авах холболт дээр алдаа гарлаа ",e);
      }
    }
    loadStatus();
    loadApp();

  }, []);

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

          {requests.map(( item, index) => (
            <Card
              key={index}
              className={styles.requestCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3>{item.postTitle}</h3>
                  <p>{item.company}</p>
                </div>

                <Tag
                  color={
                    item.status === "ACCEPTED"
                      ? "success"
                      : item.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                >
                  {item.status === "ACCEPTED"
                    ? "Зөвшөөрөгдсөн"
                    : item.status === "REJECTED"
                    ? "Татгалзсан"
                    : "Хүлээгдэж буй"}
                </Tag>
              </div>

              <p className={styles.description}>
                {item.description}
              </p>

              <div className={styles.dateRow}>
                <span>
                  Илгээсэн: {item.submittedAt}
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