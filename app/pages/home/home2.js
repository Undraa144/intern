"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home2.module.scss";

const categories = [
  {
    title: "Хүний нөөц",
    jobs: "12 Jobs",
    image: "/majors/accounting.jpeg",
  },
  {
    title: "Creative",
    jobs: "30 Jobs",
    image: "/majors/creative.jpeg",
  },
  {
    title: "Хөгжүүлэлт",
    jobs: "22 Jobs",
    image: "/majors/development.jpeg",
  },
  {
    title: "Маркетинг",
    jobs: "39 Jobs",
    image: "/majors/marketing.jpeg",
  },
  {
    title: "Эрх зүй",
    jobs: "100 Jobs",
    image: "/majors/legal.jpeg",
  },
  {
    title: "Дизайн",
    jobs: "39 Jobs",
    image: "/majors/design.jpeg",
  },
  {
    title: "Инженер",
    jobs: "12 Jobs",
    image: "/majors/engineer.jpeg",
  },
  {
    title: "Бизнес",
    jobs: "30 Jobs",
    image: "/majors/business.jpeg",
  },
];

export default function Home2() {
  return (
    <section className={styles.main}>
      <h1 className={styles.title}>
        Ажил хүссэн ангиллаараа хайх
      </h1>

      <div className={styles.cards}>
        {categories.map((item) => (
          <div
            key={item.title}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => onCategorySelect(item.title)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onCategorySelect(item.title);
              }
            }}
          >
              <Image
                src={item.image}
                alt={item.title}
                width={40}
                height={40}
                className={styles.icon}
              />

            <h3>{item.title}</h3>

            <p>{item.jobs}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
