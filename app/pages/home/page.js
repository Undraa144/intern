"use client";

import { useState } from "react";
import Link from "next/link";

import Home from "./home";
import Home1 from "./home1";
import Home2 from "./home2";
import Home3 from "./home3";

import styles from "./page.module.scss";

import {
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button } from "antd";

const { Header, Content, Footer } = Layout;

export default function HomePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const menuItems = [
    {
      key: "1",
      label: "Тойм",
      icon: <AppstoreOutlined />,
    },
    {
      key: "2",
      label: "Зар хайх",
      icon: <FileSearchOutlined />,
    },
    {
      key: "3",
      label: "Миний хүсэлтүүд",
      icon: <InboxOutlined />,
    },
    {
      key: "4",
      label: "Тайлан",
      icon: <CopyOutlined />,
    },
  ];

  return (
    <Layout>
      <Header style={{background: '#ffffff'}}>
        <div className={styles.header}>
          <Link href="/" className={styles.title}>
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
              <Link href="/pages/signup">Sign In</Link>
            </Button>

            <Button type="primary" className={styles.trial}>
              <Link href="/">Post A Jobs</Link>
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
          <Home />
          <Home1 />
          <Home2/>
          <Home3/>
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