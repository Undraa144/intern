"use client";
import Home3 from "../../home/home3";

import { useState } from "react";
import Link from "next/link";
import {AutoComplete} from "antd";
import {Input} from "antd";

import styles from "./page.module.scss";


import {
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CopyOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button } from "antd";

const { Header} = Layout;
const { Search } = Input;


export default function SearchPage(){

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

    const onSearch = (value) => { console.log(value); }; 

    const options = [ 
    { value: 'It' }, 
    { value: 'Marketing' }, 
    { value: 'Design' }, ];


    return(
        <>
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
            <AutoComplete classNames={{ popup: { root: 'certain-category-search-dropdown', }, }} 
            popupMatchSelectWidth={500} style={{ width: 250 }} options={options} > 
            <Input.Search size="large" placeholder="input here" /> 
            </AutoComplete> 
        <Home3/>
        </>
    )
}