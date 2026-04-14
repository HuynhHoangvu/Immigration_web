import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useThemeStore } from "@/core/store/themeStore";
import { useContentStore } from "@/core/hooks/usePageContent";
import { AdminEditBar } from "@/admin/components/AdminEditBar";
import ScrollToTop from "@/themes/fly-labour/parts/widgets/ScrollToTop";
import UserLayout from "@/themes/fly-labour/layout/UserLayout";
import AdminLayout from "@/admin/layout/AdminLayout";

// ── User pages ────────────────────────────────────────────────────────────────
import HomePage from "@/plugins/home/pages/HomePage";
import JobsPage from "@/plugins/jobs/pages/JobsPage";
import JobDetailPage from "@/plugins/jobs/pages/JobDetailPage";
import NewsPage from "@/plugins/news/pages/NewsPage";
import NewsDetailPage from "@/plugins/news/pages/NewsDetailPage";
import HandbookPage from "@/plugins/news/pages/HandbookPage";
import ContactPage from "@/plugins/contact/pages/ContactPage";
import LoginPage from "@/plugins/auth/pages/LoginPage";
import RegisterPage from "@/plugins/auth/pages/RegisterPage";
import ProfilePage from "@/plugins/profile/pages/ProfilePage";
import AboutPage from "@/plugins/static-pages/pages/AboutPage";
import ProcessPage from "@/plugins/static-pages/pages/ProcessPage";
import FaqPage from "@/plugins/static-pages/pages/FaqPage";
import PrivacyPage from "@/plugins/static-pages/pages/PrivacyPage";
import PolicyPage from "@/plugins/static-pages/pages/PolicyPage";
import NotFoundPage from "@/plugins/static-pages/pages/NotFoundPage";

// ── Employer pages ────────────────────────────────────────────────────────────
import EmployerLayout from "@/plugins/employer/pages/EmployerLayout";
import EmployerDashboard from "@/plugins/employer/pages/EmployerDashboard";
import EmployerJobsPage from "@/plugins/employer/pages/EmployerJobsPage";
import EmployerApplicationsPage from "@/plugins/employer/pages/EmployerApplicationsPage";
import EmployerProfilePage from "@/plugins/employer/pages/EmployerProfilePage";

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminJobsPage from "@/admin/pages/AdminJobsPage";
import AdminApplicationsPage from "@/admin/pages/AdminApplicationsPage";
import AdminUsersPage from "@/admin/pages/AdminUsersPage";
import AdminCategoriesPage from "@/admin/pages/AdminCategoriesPage";
import AdminNewsPage from "@/admin/pages/AdminNewsPage";
import AdminSettingsPage from "@/admin/pages/AdminSettingsPage";
import AdminChoresPage from "@/admin/pages/AdminChoresPage";
import AdminContactsPage from "@/admin/pages/AdminContactsPage";
import AdminPoliciesPage from "@/admin/pages/AdminPoliciesPage";

// ── Bootstrap components ──────────────────────────────────────────────────────
function ContentLoader() {
  const load = useContentStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  return null;
}

function ThemeInitializer() {
  useEffect(() => { useThemeStore.getState().hydrate(); }, []);
  return null;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const theme = useThemeStore((s) => s.theme);

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
            background: theme === "dark" ? "#141414" : "#ffffff",
            color: theme === "dark" ? "#fff" : "#0f172a",
            border: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow:
              theme === "dark"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: theme === "dark" ? "#fdd52f" : "#d97706",
              secondary: theme === "dark" ? "#000" : "#fff",
            },
          },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* ── User routes (wrapped by UserLayout via Outlet) ── */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/handbook" element={<HandbookPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/policy/:slug" element={<PolicyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Standalone routes (no UserLayout) ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Employer routes ── */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
          <Route path="profile" element={<EmployerProfilePage />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="policies" element={<AdminPoliciesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="chores" element={<AdminChoresPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
