"use client";

import { useState } from "react";
import MainLayout from "@/app/MainLayout";
import Home from "./home";
import Home1 from "./home1";
import Home2 from "./home2";
import Home3 from "./home3";


export default function Page() {
  const [category, setCategory] = useState("");

  return (
    <MainLayout role="home">
      <Home/>
      <Home1/>
      <Home2 onCategorySelect={setCategory}/>
      <Home3 searchText={category}/>
    </MainLayout>
  );
}
