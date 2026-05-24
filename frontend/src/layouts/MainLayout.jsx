import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  const { pathname } = useLocation();

  // Volta ao topo ao mudar de rota
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
