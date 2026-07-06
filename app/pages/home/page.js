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
} from "@ant-design/icons";

import { Layout, Menu, Button } from "antd";

const { Header, Content, Footer } = Layout;

export default function HomePage() {
  const [current, setCurrent] = useState("1");

  const onClick = ({ key }) => {
    setCurrent(key);
  };

  const currentYear = new Date().getFullYear();

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
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
        }}
      >
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
            mode="horizontal"
            selectedKeys={[current]}
            items={menuItems}
            onClick={onClick}
            className={styles.menu}
          />

          <div className={styles.actions}>
            <Button className={styles.signin}>
              <Link href="/pages/signup">Sign In</Link>
            </Button>

            <Button type="primary" className={styles.trial}>
              <Link href="/">Post A Job</Link>
            </Button>
          </div>
        </div>
      </Header>

      <Content>
        <Home />
        <Home1 />
        <Home2 />
        <Home3 />
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