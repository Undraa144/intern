import MainLayout from "@/app/MainLayout";
import Home from "../../home/home";
import Home1 from "../../home/home1";
import Home3 from "../../home/home3";
import Home2 from "../../home/home2";

export default function HomePage(){
    return(
        <MainLayout role="admin">
            <Home/>
            <Home1/>
            <Home2/>
            <Home3/>
        </MainLayout>
    )
}