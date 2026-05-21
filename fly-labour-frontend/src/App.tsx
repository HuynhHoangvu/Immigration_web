import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";


import { useContentStore } from "@core/hooks/usePageContent";
import ScrollToTop from "@components/widgets/ScrollToTop";
import UserLayout from "@components/layout/UserLayout";
import AdminLayout from "@/admin/layout/AdminLayout";

// ── Public site + user account (UserLayout) ─────────────────────────────────────
import HomePage from "@features/home/pages/HomePage";
import JobsPage from "@features/jobs/pages/JobsPage";
import JobDetailPage from "@features/jobs/pages/JobDetailPage";
import NewsPage from "@features/news/pages/NewsPage";
import NewsDetailPage from "@features/news/pages/NewsDetailPage";
import HandbookPage from "@features/news/pages/HandbookPage";
import StudyPage from "@features/study/StudyPage";
import StudyDetailPage from "@features/study/pages/StudyDetailPage";
import TravelPage from "@features/travel/TravelPage";
import TravelDetailPage from "@features/travel/pages/TravelDetailPage";
import ContactPage from "@features/contact/pages/ContactPage";
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import ProfilePage from "@features/profile/pages/ProfilePage";
import AboutPage from "@features/static-pages/pages/AboutPage";
import ProcessPage from "@features/static-pages/pages/ProcessPage";
import FaqPage from "@features/static-pages/pages/FaqPage";
import PrivacyPage from "@features/static-pages/pages/PrivacyPage";
import PolicyPage from "@features/static-pages/pages/PolicyPage";
import TermsOfServicePage from "@features/static-pages/pages/TermsOfServicePage";
import NotFoundPage from "@features/static-pages/pages/NotFoundPage";

// ── Employer pages ────────────────────────────────────────────────────────────
import EmployerLayout from "@features/employer/pages/EmployerLayout";
import EmployerDashboard from "@features/employer/pages/EmployerDashboard";
import EmployerJobsPage from "@features/employer/pages/EmployerJobsPage";
import EmployerApplicationsPage from "@features/employer/pages/EmployerApplicationsPage";
import EmployerProfilePage from "@features/employer/pages/EmployerProfilePage";

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
import AdminHandbookPage from "@/admin/pages/AdminHandbookPage";
import AdminStudyNewsPage from "@/admin/pages/AdminStudyNewsPage";
import AdminStudyProgramsPage from "@/admin/pages/AdminStudyProgramsPage";
import AdminStudyApplicationsPage from "@/admin/pages/AdminStudyApplicationsPage";
import AdminTravelPage from "@/admin/pages/AdminTravelPage";

// ── Bootstrap components ──────────────────────────────────────────────────────
function ContentLoader() {
  const load = useContentStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  return null;
}



// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ContentLoader />
      <ScrollToTop />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#d97706",
              secondary: "#fff",
            },
          },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* ── Public / user (UserLayout + Outlet) ─────────────────────────────── */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/handbook" element={<HandbookPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/study/:slug" element={<StudyDetailPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/travel/:slug" element={<TravelDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/tos" element={<TermsOfServicePage />} />
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
          <Route path="handbook" element={<AdminHandbookPage />} />
          <Route path="study-programs" element={<AdminStudyProgramsPage />} />
          <Route path="study-news" element={<AdminStudyNewsPage />} />
          <Route path="study-applications" element={<AdminStudyApplicationsPage />} />
          <Route path="travel" element={<AdminTravelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
