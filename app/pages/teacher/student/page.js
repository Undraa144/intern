"use client";

import { useState } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  AppstoreOutlined,
  BankOutlined ,
  TeamOutlined ,
  SolutionOutlined ,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button } from "antd";
import Student from "./student";

const { Header, Content, Footer } = Layout;

export default function StudentPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const [current, setCurrent] = useState("3");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const menuItems = [
    {
      key: "1",
      label: <Link href="/pages/teacher/home">Тойм</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: <Link href="/pages/teacher/company">Компани </Link>,
      icon: <BankOutlined />,
    },
    {
      key: "3",
      label: <Link href="/pages/teacher/student">Оюутан </Link>,
      icon: <TeamOutlined />,
    },
    {
      key: "4",
      label: <Link href="/pages/teacher/report">Тайлан</Link>,
      icon: <SolutionOutlined />,
    },
    {
      key: "5",
      label: <Link href="/pages/teacher/profile">Профайл</Link>,
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
          <Student/>

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