"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  theme,
  Button,
  Card,
  Tag,
} from "antd";

const { Header, Content, Footer } = Layout;

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const [current, setCurrent] = useState("3");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const menuItems = [
    {
      key: "1",
      label: <Link href="/pages/student/home">Тойм</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: <Link href="/pages/student/search">Зар хайх</Link>,
      icon: <FileSearchOutlined />,
    },
    {
      key: "3",
      label: <Link href="/pages/student/request">Миний хүсэлтүүд</Link>,
      icon: <InboxOutlined />,
    },
    {
      key: "4",
      label: <Link href="/pages/student/report">Тайлан</Link>,
      icon: <CopyOutlined />,
    },
    {
      key: "5",
      label: <Link href="/pages/student/profile">Профайл</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Layout>
      <Header style={{ background: "#ffffff" }}>
        <div className={styles.header}>
          <Link href="/pages/student/home" className={styles.title}>
            <img
              src="/logo.png"
              alt="logo"
              className={styles.logo}
              width={200}
              height={25}
            />
          </Link>

          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            items={menuItems}
            onClick={onClick}
            className={styles.menu}
          />

          <div className={styles.actions}>
            <Button className={styles.signin}>
              <Link href="/">Sign Out</Link>
            </Button>

          </div>
        </div>
      </Header>

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

      <Footer
        style={{
          textAlign: "center",
          background: "white",
        }}
      >
        InternHub © {currentYear}
      </Footer>
    </Layout>
  );
}