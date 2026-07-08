import MainLayout from "@/app/MainLayout";
import Student from "./student";

export default function StudentPage() {

  return (
    <MainLayout role="teacher">
      <Student/>
    </MainLayout>
  );
}