import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home       from "./pages/Home";
import Admin      from "./pages/Admin";
import NotFound   from "./pages/NotFound";

/*
  Rotas da aplicação:
  /          → Site (todas as seções em página única)
  /admin     → Painel administrativo (sem layout principal)
  *          → 404
*/
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="*"      element={<NotFound />} />
    </Routes>
  );
}
