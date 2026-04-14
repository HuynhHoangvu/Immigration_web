import { Outlet } from "react-router-dom";
import Header from "@/themes/fly-labour/parts/Header";
import Footer from "@/themes/fly-labour/parts/Footer";
import FloatingContact from "@/themes/fly-labour/parts/widgets/FloatingContact";
import BackgroundMusic from "@/themes/fly-labour/parts/widgets/BackgroundMusic";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      <Header />
      <Outlet />
      <Footer />
      <FloatingContact />
      <BackgroundMusic autoPlay={true} />
    </div>
  );
}
