"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./home3.module.scss";

const jobs = [
  {
    company: "Facebook",
    title: "Marketing Manager",
    image: "/company.jpeg",
    color: "#ece9ff",
  },
  {
    company: "Dribbble",
    title: "UI Designer",
    image: "/company.jpeg",
    color: "#e9faf6",
  },
  {
    company: "WordPress",
    title: "Frontend Developer",
    image: "/company.jpeg",
    color: "#fff0e6",
  },
  {
    company: "Fiverr",
    title: "Product Designer",
    image: "/company.jpeg",
    color: "#fdf0f5",
  },
  {
    company: "Google",
    title: "Software Engineer",
    image: "/company.jpeg",
    color: "#e8f6ff",
  },
  {
    company: "Skype",
    title: "UX Researcher",
    image: "/company.jpeg",
    color: "#fff0f8",
  },
  {
    company: "Apple",
    title: "iOS Developer",
    image: "/company.jpeg",
    color: "#f3f6fb",
  },
  {
    company: "Slack",
    title: "Project Manager",
    image: "/company.jpeg",
    color: "#fff3d9",
  },
];

export default function Home3({ searchText = "" }) {
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section className={styles.main}>
      <h1 className={styles.title}>Санал болгох ажил</h1>

      <div className={styles.grid}>
        {filteredJobs.map((job, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.top}
              style={{ backgroundColor: job.color }}
            >
              <Image
                src={job.image}
                alt={job.company}
                width={42}
                height={42}
                className={styles.logo}
              />

              <h3>{job.title}</h3>

              <p>Дадлагажигч оюутан</p>

              <div className={styles.tags}>
                <span>Part Time</span>
                <span>Middle Level</span>
                <span>Project Work</span>
              </div>
            </div>

            <div className={styles.bottom}>
              <span>₮</span>

              <button>
                <Link href="/pages/signup">
                  Хүсэлт илгээх
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>
          Илэрц олдсонгүй
        </h3>
      )}
    </section>
  );
}