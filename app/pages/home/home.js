"use client";

import { useState } from "react";
import Image from "next/image";
import { Input, AutoComplete } from "antd";

import styles from "./home.module.scss";

export default function Home() {
  const [searchText, setSearchText] = useState("");

  const onSearch = (value) => {
    setSearchText(value);
    console.log(value);
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
    <div className={styles.main}>
      <div className={styles.left}>
        <h1>
        Өөрийн сонирхол, ур чадварт тохирсон ажил олоорой.
        </h1>

        <p className={styles.description}>
        Энэ бол манай вэбсайтын гол агуулга юм.
        </p>

        
      </div>

      <div className={styles.right}>
        <img
          src="/home.jpeg"
          alt="Home Image"
          className={styles.image}
        />
      </div>
    </div>
  );
}