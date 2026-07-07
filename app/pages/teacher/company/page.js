"use client";

import { useState } from "react";
import Link from "next/link";

import Home3 from "../../home/home3";

import { Layout, Menu, Button, AutoComplete, Input } from "antd";

import {
  AppstoreOutlined,
  BankOutlined ,
  TeamOutlined ,
  SolutionOutlined ,
  UserOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import SHome from "../../student/home/shome";

const { Header } = Layout;

export default function CompanyPage() {
  const [current, setCurrent] = useState("2");

  const onClick = (e) => {
    setCurrent(e.key);
  };

const [searchText, setSearchText] = useState("");

const onSearch = (value) => {
  setSearchText(value);
};

  const options = [
    { value: "IT" },
    { value: "Marketing" },
    { value: "Design" },
    { value: "Finance" },
    { value: "Human Resource" },
    { value: "Software Engineer" },
  ];

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
    <>
      <Header
        style={{
          background: "#fff",
          padding: "0 40px",
        }}
      >
        <div className={styles.header}>
          <Link href="/pages/student/home" className={styles.title}>
            <img
              src="/logo.png"
              alt="logo"
              width={180}
              height={40}
              className={styles.logo}
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
            <Button>
              <Link href="/">Sign Out</Link>
            </Button>

          </div>
        </div>
      </Header>

      <div className={styles.searchSection}>
        <AutoComplete
          options={options}
          style={{ width: 700 ,}}
        >
          <Input.Search
            size="large"
            placeholder="Ажлын байр хайх..."
            enterButton="Хайх"
            onSearch={onSearch}
          />
        </AutoComplete>
      </div>

      <SHome searchText={searchText}/>
    </>
  );
}