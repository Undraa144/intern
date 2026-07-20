"use client"
import { useState } from "react";
import Link from "next/link";

import {
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
  BankOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme } from "antd";
import styles from "./MainLayout.module.scss";

const { Header, Content, Footer } = Layout;

export default function MainLayout({
  children,
  role = "home",
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [current, setCurrent] = useState("");

  const currentYear = new Date().getFullYear();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const menus = {
    home:[
      {
        key: "1",
        label: "Тойм",
        icon: <AppstoreOutlined />,
        setCurrent: useState("1"),
      },
      {
        key: "2",
        label: "Зар хайх",
        icon: <FileSearchOutlined />,
        setCurrent: useState("2"),
      },
      {
        key: "3",
        label: "Миний хүсэлтүүд",
        icon: <InboxOutlined />,
        setCurrent: useState("3"),
      },
      {
        key: "4",
        label: "Тайлан",
        icon: <CopyOutlined />,
        setCurrent: useState("4"),
      },
    ],
    student: [
      {
        key: "1",
        label: <Link href="/pages/student/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
        setCurrent: useState("1"),
      },
      {
        key: "2",
        label: <Link href="/pages/student/search">Зар хайх</Link>,
        icon: <FileSearchOutlined />,
        setCurrent: useState("2"),
      },
      {
        key: "3",
        label: <Link href="/pages/student/request">Миний хүсэлтүүд</Link>,
        icon: <InboxOutlined />,
        setCurrent: useState("3"),
      },
      {
        key: "4",
        label: <Link href="/pages/student/report">Тайлан</Link>,
        icon: <CopyOutlined />,
        setCurrent: useState("4"),
      },
      {
        key: "5",
        label: <Link href="/pages/student/profile">Профайл</Link>,
        icon: <UserOutlined />,
        setCurrent: useState("5"),
      },
    ],

    employer: [
      {
        key: "1",
        label: <Link href="/pages/employer/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
        setCurrent: useState("1"),
      },
      {
        key: "2",
        label: <Link href="/pages/employer/ad">Миний зарууд</Link>,
        icon: <CopyOutlined />,
        setCurrent: useState("2"),
      },
      {
        key: "3",
        label: <Link href="/pages/employer/request">Ирсэн хүсэлт</Link>,
        icon: <InboxOutlined />,
        setCurrent: useState("3"),
      },
      {
        key: "4",
        label: <Link href="/pages/employer/profile">Профайл</Link>,
        icon: <UserOutlined />,
        setCurrent: useState("4"),
      },
    ],

    teacher: [
      {
        key: "1",
        label: <Link href="/pages/teacher/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
        setCurrent: useState("1"),
      },
      {
        key: "2",
        label: <Link href="/pages/teacher/company">Компани</Link>,
        icon: <BankOutlined />,
        setCurrent: useState("2"),
      },
      {
        key: "3",
        label: <Link href="/pages/teacher/student">Оюутан</Link>,
        icon: <TeamOutlined />,
        setCurrent: useState("3"),
      },
      {
        key: "4",
        label: <Link href="/pages/teacher/report">Тайлан</Link>,
        icon: <SolutionOutlined />,
        setCurrent: useState("4"),
      },
      {
        key: "5",
        label: <Link href="/pages/teacher/profile">Профайл</Link>,
        icon: <UserOutlined />,
        setCurrent: useState("5"),
      },
    ],
    
    admin: [
      {
        key: "1",
        label: <Link href="/pages/admin/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
        setCurrent: useState("1"),
      },
      {
        key: "2",
        label: <Link href="/pages/admin/company">Компани</Link>,
        icon: <BankOutlined />,
        setCurrent: useState("2"),
      },
      {
        key: "3",
        label: <Link href="/pages/admin/student">Оюутан</Link>,
        icon: <TeamOutlined />,
        setCurrent: useState("3"),
      },
      {
        key: "4",
        label: <Link href="/pages/admin/teacher">Багш</Link>,
        icon: <SolutionOutlined />,
        setCurrent: useState("4"),
      },
    ],
  };

  const homeLinks = {
    home:"/",
    student: "/pages/student/home",
    employer: "/pages/employer/home",
    teacher: "/pages/teacher/home",
    admin: "/pages/admin/home",
  };

  return (
    <Layout>
      <Header style={{ background: "#fff" }}>
        <div className={styles.header}>
          <Link
            href={homeLinks[role]}
            className={styles.title}
          >
            <img
              src="/logo.png"
              alt="logo"
              width={200}
              height={25}
              className={styles.logo}
            />
          </Link>

          <div className={styles.spacer}></div>

          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            onClick={onClick}
            items={menus[role]}
            className={styles.menu}
          />

          <div className={styles.actions}>
            {role === "home" ? (
              <Button className={styles.signin}>
                <Link href="/pages/signup">Нэвтрэх</Link>
              </Button>
            ) : (
              <Button className={styles.signin}>
                <Link href="/">Гарах</Link>
              </Button>
            )}
          </div>
        </div>
      </Header>

      <Content>
        <div
          style={{
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#fff",
        }}
      >
        InternHub © {currentYear}
      </Footer>
    </Layout>
  );
}