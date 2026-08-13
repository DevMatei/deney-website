import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { cn } from "./lib/cn";
import { useTheme } from "./theme/ThemeContext";
import { Camera, Home, Mail, User } from "./components/Icons";
import { MobileNav } from "./components/MobileNav";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PhotosPage } from "./pages/PhotosPage";
import content from "./data/content.json";

export default function App() {
  const { settings } = useTheme();
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches,
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const page = location.pathname === "/" ? "home" : location.pathname.slice(1);

  const navItems = [
    { key: "home", label: content.nav[0].label, glyph: Home },
    { key: "photos", label: content.nav[1].label, glyph: Camera },
    { key: "about", label: content.nav[2].label, glyph: User },
    { key: "contact", label: content.nav[3].label, glyph: Mail },
  ];

  const goto = (key: string) => navigate(key === "home" ? "/" : `/${key}`);

  return (
    <div
      className={cn(
        "min-h-screen flex font-sans relative",
        "flex-row",
      )}
    >
      <a href="#primary-content" className="skip-link">
        Skip to main content
      </a>
      <MotionConfig reducedMotion={settings.disableAnimations ? "always" : "user"}>
        <Sidebar />
        <main
          id="primary-content"
          className="flex-1 min-w-0 flex flex-col pt-0 md:pt-0"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <footer className="mt-auto border-t border-[var(--outline-variant)]/40 px-6 py-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
              {content.site.footer.prefix}{" "}
              <a
                href={content.site.footer.url}
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-100"
              >
                {content.site.footer.label}
              </a>
            </span>
          </footer>
        </main>
        <MobileNav
          items={navItems}
          activePage={page}
          onSelect={goto}
        />
        <ScrollToTopButton isMobile={isMobile} />
      </MotionConfig>
    </div>
  );
}
