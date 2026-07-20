"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home2.module.scss";

const categories = [
  {
    title: "Хүний нөөц",
    image: "/majors/accounting.jpeg",
  },
  {
    title: "Санхүү",
    image: "/majors/creative.jpeg",
  },
  {
    title: "Хөгжүүлэлт",
    image: "/majors/development.jpeg",
  },
  {
    title: "Маркетинг",
    image: "/majors/marketing.jpeg",
  },
  {
    title: "Эрх зүй",
    image: "/majors/legal.jpeg",
  },
  {
    title: "Дизайн",
    image: "/majors/design.jpeg",
  },
  {
    title: "Инженер",
    image: "/majors/engineer.jpeg",
  },
  {
    title: "Бизнес",
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
