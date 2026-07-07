"use client";

import { useState } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  AppstoreOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button } from "antd";
import Profile from "./profile";

const { Header, Content, Footer } = Layout;

export default function EmployerHomePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const [current, setCurrent] = useState("4");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const menuItems = [
    {
      key: "1",
      label: <Link href="/pages/employer/home">Тойм</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: <Link href="/pages/employer/ad">Миний зарууд</Link>,
      icon: <CopyOutlined />,
    },
    {
      key: "3",
      label: <Link href="/pages/employer/request">Ирсэн хүсэлт</Link>,
      icon: <InboxOutlined />,
    },
    {
      key: "4",
      label: <Link href="/pages/employer/profile">Профайл</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Layout>
      <Header style={{background: '#ffffff'}}>
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

          <div className={styles.spacer}></div>

          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
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
        <div
          style={{
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
            <Profile/>

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