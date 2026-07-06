"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu } from  "antd";
import { Button } from "antd";
import { AppstoreOutlined, FileSearchOutlined, InboxOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons';

import styles from "./header.module.scss";

const menuItems = [
    {
        key: '1',
        label: 'Тойм',
        icon: <AppstoreOutlined />,
    },
    {
        key: '2',
        label: 'Зар хайх',
        icon: <FileSearchOutlined />,
    },
    {
        key: '3',
        label: 'Миний хүсэлтүүд',
        icon: <InboxOutlined />,
    },
        {
        key: '4',
        label: 'Тайлан',
        icon: <CopyOutlined />,
    },
    
        {
        key: '5',
        label: 'Профайл',
        icon: <UserOutlined />,
    },
    ];

export default function Header() {
    const [current, setCurrent] = useState("");

    const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
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
        <Button  className={styles.signin}>
        <Link href="/pages/signup">
          Sign In          
        </Link>
        </Button>
        <Button type="primary" className={styles.trial}>
        <Link href="/">
          Post A Jobs
        </Link>
        </Button>
      </div>
    </div>
  );
}