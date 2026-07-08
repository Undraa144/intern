import MainLayout from "@/app/MainLayout";
import Home from "../../home/home";
import Home1 from "../../home/home1";
import Home2 from "../../home/home2";
import SHome from "../../student/home/shome";

export default function Page() {
  return (
    <MainLayout role="teacher">
      <Home />
      <Home1 />
      <Home2 />
      <SHome />
    </MainLayout>
  );
}