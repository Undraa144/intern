"use client";

import Image from "next/image";
import styles from "./home2.module.scss";

const categories = [
  { title: "Хүний нөөц", image: "/majors/accounting.jpeg", jobs: "12 ажил" },
  { title: "Санхүү", image: "/majors/creative.jpeg", jobs: "8 ажил" },
  { title: "Хөгжүүлэлт", image: "/majors/development.jpeg", jobs: "25 ажил" },
  { title: "Маркетинг", image: "/majors/marketing.jpeg", jobs: "15 ажил" },
  { title: "Эрх зүй", image: "/majors/legal.jpeg", jobs: "5 ажил" },
  { title: "Дизайн", image: "/majors/design.jpeg", jobs: "10 ажил" },
  { title: "Инженер", image: "/majors/engineer.jpeg", jobs: "18 ажил" },
  { title: "Бизнес", image: "/majors/business.jpeg", jobs: "14 ажил" },
];

export default function Home2({ onCategorySelect }) {
  const handleSelect = (categoryTitle) => {
    if (typeof onCategorySelect === "function") {
      onCategorySelect(categoryTitle);
    }
  };

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Ажил хүссэн ангиллаараа хайх</h1>

      <div className={styles.cards}>
        {categories.map((item) => (
          <div
            key={item.title}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(item.title)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect(item.title);
              }
            }}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={40}
              height={40}
              style={{ width: "auto", height: "auto" }} 
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