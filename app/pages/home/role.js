import MainLayout from "@/app/MainLayout";
import Home from "./home";
import Home1 from "./home1";
import Home2 from "./home2";
import Home3 from "./home3";
import SHome from "../student/home/shome";

export default function RoleHomePage({ role }) {
  const isStaffRole = role === "admin" || role === "employer";

  return (
    <MainLayout role={role}>
      <Home />
      <Home1 />
      <Home2 />
      {isStaffRole ? <Home3 /> : <SHome />}
    </MainLayout>
  );
}