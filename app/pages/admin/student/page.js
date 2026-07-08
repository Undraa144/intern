import MainLayout from "@/app/MainLayout";
import Student from "../../teacher/student/student";

export default function StudentPage(){
    return(
        <MainLayout role="admin">
            <Student/>
        </MainLayout>
    )
}