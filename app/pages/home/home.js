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
          Find a job that suits your interests & skills
        </h1>

        <p className={styles.description}>
          This is the main content of the home page.
        </p>

        
      </div>

      <div className={styles.right}>
        <img
          src="/home.jpeg"
          alt="Home Image"
          className={styles.image}
        />
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.iconBox}>
            <Image
              src="/job.jpeg"
              alt="job"
              width={40}
              height={40}
            />
          </div>

          <div className={styles.content}>
            <h3>1</h3>
            <p>Live Job</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBox}>
            <Image
              src="/company.jpeg"
              alt="company"
              width={40}
              height={40}
            />
          </div>

          <div className={styles.content}>
            <h3>1</h3>
            <p>Companies</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBox}>
            <Image
              src="/job.jpeg"
              alt="job"
              width={40}
              height={40}
            />
          </div>

          <div className={styles.content}>
            <h3>1</h3>
            <p>New Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
}