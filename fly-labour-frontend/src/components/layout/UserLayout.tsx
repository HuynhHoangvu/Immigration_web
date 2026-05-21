import { Outlet } from "react-router-dom";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import FloatingContact from "@components/widgets/FloatingContact";
import BackgroundMusic from "@components/widgets/BackgroundMusic";
import s from "./UserLayout.module.scss";

export default function UserLayout() {
  return (
    <div className={`${s.root} fl-surface-page`}>
      <Header />
      <Outlet />
      <Footer />
      <FloatingContact />
      <BackgroundMusic autoPlay={true} />
    </div>
  );
}
