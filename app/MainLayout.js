"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { getSelectedMenuKey } from "./mainLayoutNavigation";

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children, role = "home" }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const menus = {
    home: [
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
    ],
    student: [
      {
        key: "1",
        path: "/pages/student/home",
        label: <Link href="/pages/student/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "2",
        path: "/pages/student/search",
        label: <Link href="/pages/student/search">Зар хайх</Link>,
        icon: <FileSearchOutlined />,
      },
      {
        key: "3",
        path: "/pages/student/request",
        label: <Link href="/pages/student/request">Миний хүсэлтүүд</Link>,
        icon: <InboxOutlined />,
      },
      {
        key: "4",
        path: "/pages/student/report",
        label: <Link href="/pages/student/report">Тайлан</Link>,
        icon: <CopyOutlined />,
      },
      {
        key: "5",
        path: "/pages/student/profile",
        label: <Link href="/pages/student/profile">Профайл</Link>,
        icon: <UserOutlined />,
      },
    ],
    employer: [
      {
        key: "1",
        path: "/pages/employer/home",
        label: <Link href="/pages/employer/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "2",
        path: "/pages/employer/ad",
        label: <Link href="/pages/employer/ad">Миний зарууд</Link>,
        icon: <CopyOutlined />,
      },
      {
        key: "3",
        path: "/pages/employer/request",
        label: <Link href="/pages/employer/request">Ирсэн хүсэлт</Link>,
        icon: <InboxOutlined />,
      },
      {
        key: "4",
        path: "/pages/employer/profile",
        label: <Link href="/pages/employer/profile">Профайл</Link>,
        icon: <UserOutlined />,
      },
    ],
    teacher: [
      {
        key: "1",
        path: "/pages/teacher/home",
        label: <Link href="/pages/teacher/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "2",
        path: "/pages/teacher/company",
        label: <Link href="/pages/teacher/company">Компани</Link>,
        icon: <BankOutlined />,
      },
      {
        key: "3",
        path: "/pages/teacher/student",
        label: <Link href="/pages/teacher/student">Оюутан</Link>,
        icon: <TeamOutlined />,
      },
      {
        key: "4",
        path: "/pages/teacher/report",
        label: <Link href="/pages/teacher/report">Тайлан</Link>,
        icon: <SolutionOutlined />,
      },
      {
        key: "5",
        path: "/pages/teacher/profile",
        label: <Link href="/pages/teacher/profile">Профайл</Link>,
        icon: <UserOutlined />,
      },
    ],
    admin: [
      {
        key: "1",
        path: "/pages/admin/home",
        label: <Link href="/pages/admin/home">Тойм</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "2",
        path: "/pages/admin/company",
        label: <Link href="/pages/admin/company">Компани</Link>,
        icon: <BankOutlined />,
      },
      {
        key: "3",
        path: "/pages/admin/student",
        label: <Link href="/pages/admin/student">Оюутан</Link>,
        icon: <TeamOutlined />,
      },
      {
        key: "4",
        path: "/pages/admin/teacher",
        label: <Link href="/pages/admin/teacher">Багш</Link>,
        icon: <SolutionOutlined />,
      },
    ],
  };

  const homeLinks = {
    home: "/",
    student: "/pages/student/home",
    employer: "/pages/employer/home",
    teacher: "/pages/teacher/home",
    admin: "/pages/admin/home",
  };
  const menuItems = menus[role] ?? menus.home;
  const selectedKey = getSelectedMenuKey(menuItems, pathname);

  return (
    <Layout>
      <Header style={{ background: "#fff" }}>
        <div className={styles.header}>
          <Link href={homeLinks[role]} className={styles.title}>
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
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={menuItems}
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

      <Footer style={{ textAlign: "center", background: "#fff" }}>
        InternHub © {currentYear}
      </Footer>
    </Layout>
  );
}
