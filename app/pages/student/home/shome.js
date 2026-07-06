"use client";

import Link from "next/link"
import Image from "next/image";
import {Card} from "antd";
import { useState } from "react";
import { Modal, Select, Input, Button } from "antd";

import styles from "./shome.module.scss";

const { TextArea } = Input;

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

export default function SHome() {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.main}>
      <h1 className={styles.title}> Санал болгох ажил </h1>
      <div className={styles.grid}>
        {jobs.map((job, index) => (
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

              <p>
                Дадлагжигч оюутан 
              </p>

              <div className={styles.tags}>
                <span>Part Time</span>
                <span>Middle Level</span>
                <span>Project Work</span>
              </div>
            </div>

            <div className={styles.bottom}>
              <span>₮</span>
              <Button  onClick={() => setOpen(true)}>
                Apply Now
              </Button>

              <Modal
                title="Apply Job: Senior UX Designer"
                open={open}
                footer={null}
                onCancel={() => setOpen(false)}
                width={600}
              >
                <div style={{ marginBottom: 16 }}>
                  <label>Choose Resume</label>
                  <Select
                    style={{ width: "100%", marginTop: 8 }}
                    placeholder="Select"
                    options={[
                      { value: "resume1", label: "Resume 1" },
                      { value: "resume2", label: "Resume 2" },
                    ]}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label>Cover Letter</label>
                  <TextArea
                    rows={6}
                    placeholder="Write down your biography here..."
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

                  <Button type="primary">
                    Apply Now
                  </Button>
                </div>
              </Modal>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}