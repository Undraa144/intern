"use client";

import { useState } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import {
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button } from "antd";
import Home from "../../home/home";
import Home1 from "../../home/home1";
import Home2 from "../../home/home2";
import Home3 from "../../home/home3";
import SHome from "./shome";

const { Header, Content, Footer } = Layout;

export default function StudentHomePage() {
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
      icon: <AppstoreOutlined /> ,
    },
    {
      key: "2",
      label: <Link href="/pages/student/search">Зар хайх</Link>,
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
    {
      key: "5",
      label: "Профайл",
      icon: <UserOutlined />,
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
              <Link href="/">Sign Out</Link>
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
            <Home/>
            <Home1/>
            <Home2/>
            <SHome/>

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