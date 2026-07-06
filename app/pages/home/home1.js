"use client";

import {
  UserOutlined,
  UploadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";

import styles from "./home1.module.scss";

export default function Home1() {
  return (
    <div className={styles.main}>
      <h2 className={styles.title}>InternHub хэрхэн ажилладаг вэ?</h2>

      <Steps
        current={1}
        labelPlacement="vertical"
        className={styles.steps}
        items={[
          {
            title: "Create Account",
            description: "Бүртгэл үүсгэн платформд нэвтэрнэ.",
            icon: <UserOutlined />,
          },
          {
            title: "Upload CV",
            description: "CV болон мэдээллээ оруулна.",
            icon: <UploadOutlined />,
          },
          {
            title: "Find Job",
            description: <p>"Тохирох ажлын байраа хайна."</p> ,
            icon: <SearchOutlined style={{ color:"#1677ff"}}/>,
          },
          {
            title: "Apply Job",
            description: "Ажлын байранд хүсэлт илгээнэ.",
            icon: <CheckCircleOutlined  style={{ color:"#1677ff"}} />,
          },
        ]}
      />
    </div>
  );
}