"use client";

import { useState } from "react";
import Link from "next/link";

import Home3 from "../../home/home3";

import { Layout, Menu, Button, AutoComplete, Input } from "antd";


import styles from "./page.module.scss";
import SHome from "../../student/home/shome";
import MainLayout from "@/app/MainLayout";

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

  return (
    <MainLayout role="teacher">
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
    </MainLayout>
  );
}