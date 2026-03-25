import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/content/:id" element={<ContentPage />} />
      <Route path="/:genre" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
