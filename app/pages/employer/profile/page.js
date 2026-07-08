"use client";

import MainLayout from "@/app/MainLayout";
import Profile from "./profile";


export default function EmployerHomePage() {

  return (   
    <MainLayout role="employer">
      <Profile/>
    </MainLayout>
  );
}