"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home2.module.scss";

const categoryImages = [
  "/majors/accounting.jpeg",
  "/majors/creative.jpeg",
  "/majors/development.jpeg",
  "/majors/marketing.jpeg",
  "/majors/legal.jpeg",
  "/majors/design.jpeg",
  "/majors/engineer.jpeg",
  "/majors/business.jpeg",
];

export default function Home2({ onCategorySelect = () => {} }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/postings", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) return;

        const payload = Array.isArray(data)
          ? data
          : data.content ?? data.postings ?? data.data ?? [];
        const postings = Array.isArray(payload) ? payload : [];
        const counts = new Map();

        postings.forEach((posting) => {
          const value =
            posting.requiredMajor ??
            posting.requiredMajors ??
            posting.majors ??
            [];
          const majors = Array.isArray(value)
            ? value
            : typeof value === "string"
              ? value.split(",")
              : [];

          majors.forEach((major) => {
            const title =
              typeof major === "string"
                ? major.trim()
                : major.name ?? major.majorName ?? major.title ?? "";

            if (title) counts.set(title, (counts.get(title) || 0) + 1);
          });
        });

        if (!cancelled) {
          setCategories(
            Array.from(counts, ([title, count], index) => ({
              title,
              jobs: `${count} Jobs`,
              image: categoryImages[index % categoryImages.length],
            }))
          );
        }
      } catch (error) {
        console.error("Loading categories failed:", error);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

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
