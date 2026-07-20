"use client";

import Image from "next/image";
import styles from "./home2.module.scss";

const categories = [
  {
    title: "Санхүү",
    jobs: "12 ажил",
    image: "/majors/accounting.jpeg",
  },
  {
    title: "Хүний нөөц",
    jobs: "30 ажил",
    image: "/majors/creative.jpeg",
  },
  {
    title: "Хөгжүүлэлт",
    jobs: "22 ажил",
    image: "/majors/development.jpeg",
  },
  {
    title: "Маркетинг",
    jobs: "39 ажил",
    image: "/majors/marketing.jpeg",
  },
  {
    title: "Эрх зүй",
    jobs: "10 ажил",
    image: "/majors/legal.jpeg",
  },
  {
    title: "Дизайн",
    jobs: "39 ажил",
    image: "/majors/design.jpeg",
  },
  {
    title: "Инженер",
    jobs: "12 ажил",
    image: "/majors/engineer.jpeg",
  },
  {
    title: "Бизнес",
    jobs: "30 ажил",
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
          <div key={item.title} className={styles.card}>
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