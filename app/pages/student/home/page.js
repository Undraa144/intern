import MainLayout from "@/app/MainLayout";
import Home from "../../home/home";
import Home1 from "../../home/home1";
import Home2 from "../../home/home2";
import SHome from "./shome";

export default function StudentPage() {
  return (
    <MainLayout role="student">
      <Home />
      <Home1 />
      <Home2 />
      <SHome />
    </MainLayout>
  );
}