import MainLayout from "@/app/MainLayout";
import Home from "./home";
import Home1 from "./home1";
import Home2 from "./home2";
import Home3 from "./home3";


export default function Page() {
  return (
    <MainLayout role="home">
      <Home/>
      <Home1/>
      <Home2/>
      <Home3/>
    </MainLayout>
  );
}