import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import BackgroundMusic from "@/components/ui/BackgroundMusic";
import { useT } from "@/hooks/useT";
import { contactApi } from "@/services/api";
import { useThemeStore } from "@/store/themeStore";

// Layouts
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminEditBar } from "@/components/admin/AdminEditBar";
import { useContentStore } from "@/hooks/usePageContent";

// User pages
import HomePage from "@/pages/user/HomePage";
import JobsPage from "@/pages/user/JobsPage";
import JobDetailPage from "@/pages/user/JobDetailPage";
import NewsPage from "@/pages/user/NewsPage";
import NewsDetailPage from "@/pages/user/NewsDetailPage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import ProfilePage from "@/pages/user/ProfilePage";
import AboutPage from "@/pages/user/AboutPage";
import ProcessPage from "@/pages/user/ProcessPage";
import FaqPage from "@/pages/user/FaqPage";
import PrivacyPage from "@/pages/user/PrivacyPage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminNewsPage from "@/pages/admin/AdminNewsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminChoresPage from "@/pages/admin/AdminChoresPage";
import AdminContactsPage from "@/pages/admin/AdminContactsPage";

// Employer pages
import EmployerLayout from "@/pages/employer/EmployerLayout";
import EmployerDashboard from "@/pages/employer/EmployerDashboard";
import EmployerJobsPage from "@/pages/employer/EmployerJobsPage";
import EmployerApplicationsPage from "@/pages/employer/EmployerApplicationsPage";
import EmployerProfilePage from "@/pages/employer/EmployerProfilePage";

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      {children}
      <Footer />
      <FloatingContact />
      <BackgroundMusic autoPlay={true} />
    </div>
  );
}

function ContactPage() {
  const { t } = useT();
  const c = t("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await contactApi.send(form);
      toast.success("�� g?i li�n h? th�nh c�ng! Ch�ng t�i s? ph?n h?i s?m.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("G?i th?t b?i, vui l�ng th? l?i");
    } finally {
      setSending(false);
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title mb-4">
            {c.title} <span className="gradient-text">{c.titleGradient}</span>
          </h1>
          <p className="text-brand-muted mb-8">{c.subtitle}</p>
          <div className="card-dark p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  label: c.name,
                  key: "name",
                  type: "text",
                  placeholder: c.namePlaceholder,
                },
                {
                  label: c.email,
                  key: "email",
                  type: "email",
                  placeholder: "email@example.com",
                },
                {
                  label: c.phone,
                  key: "phone",
                  type: "tel",
                  placeholder: c.phonePlaceholder,
                },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((fm) => ({ ...fm, [f.key]: e.target.value }))
                    }
                    className="input-dark"
                    placeholder={f.placeholder}
                    required={f.key !== "phone"}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  {c.message}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((fm) => ({ ...fm, message: e.target.value }))
                  }
                  className="input-dark h-28 resize-none"
                  placeholder={c.messagePlaceholder}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                    �ang g?i...
                  </>
                ) : (
                  c.send
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

function NotFound() {
  const { t } = useT();
  const nf = t("notFound");
  return (
    <UserLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-9xl gradient-text">404</p>
          <p className="text-white font-semibold text-xl mt-2">{nf.title}</p>
          <a href="/" className="btn-primary inline-block mt-6 px-6 py-3">
            {nf.back}
          </a>
        </div>
      </div>
    </UserLayout>
  );
}

function ContentLoader() {
  const load = useContentStore((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);
  return null;
}

function ThemeInitializer() {
  useEffect(() => {
    const { hydrate } = useThemeStore.getState();
    hydrate();
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <ContentLoader />
      <AdminEditBar />
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#fff",
            border: "1px solid #2A2A2A",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#fdd52f", secondary: "#000" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* User routes */}
        <Route
          path="/"
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <UserLayout>
              <JobsPage />
            </UserLayout>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <UserLayout>
              <JobDetailPage />
            </UserLayout>
          }
        />
        <Route
          path="/news"
          element={
            <UserLayout>
              <NewsPage />
            </UserLayout>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <UserLayout>
              <NewsDetailPage />
            </UserLayout>
          }
        />
        <Route
          path="/about"
          element={
            <UserLayout>
              <AboutPage />
            </UserLayout>
          }
        />
        <Route
          path="/process"
          element={
            <UserLayout>
              <ProcessPage />
            </UserLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <UserLayout>
              <FaqPage />
            </UserLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <UserLayout>
              <PrivacyPage />
            </UserLayout>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          }
        />

        {/* Employer routes */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
          <Route path="profile" element={<EmployerProfilePage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="chores" element={<AdminChoresPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
