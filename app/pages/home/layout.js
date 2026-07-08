import MainLayout from "@/app/MainLayout";

export default function Layout({ children }) {
  return (
    <MainLayout role="home">
      {children}
    </MainLayout>
  );
}