"use client";

import { useState } from "react";
import MainLayout from "@/app/MainLayout";
import Home from "./home";
import Home1 from "./home1";
import Home2 from "./home2";
import Home3 from "./home3";
import SHome from "../student/home/shome";

export default function RoleHomePage({ role }) {
  const isStudentRole = role === "student";
  const [category, setCategory] = useState("");

  return (
    <MainLayout role={role}>
      <Home />
      <Home1 />
      <Home2 onCategorySelect={setCategory} />
      {isStudentRole ? (
        <SHome searchText={category} />
      ) : (
        <Home3 searchText={category} />
      )}
    </MainLayout>
  );
}
