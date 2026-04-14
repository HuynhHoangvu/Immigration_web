/**
 * COMPONENT TEMPLATE - Dark Mode Pattern
 *
 * Đây là ví dụ hoàn chỉnh cách dùng dark mode với Tailwind `dark:` modifier.
 * Copy pattern này cho các component khác.
 */

import { useTheme } from "@/core/hooks/useTheme";

interface TemplateComponentProps {
  title: string;
  description?: string;
  variant?: "default" | "highlighted";
}

export function TemplateComponent({
  title,
  description,
  variant = "default",
}: TemplateComponentProps) {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>

          {/* Theme Toggle Button */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Card Container */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
            variant === "highlighted" ? "mb-8" : ""
          }`}
        >
          {/* Card 1 */}
          <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Card Title
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {description ||
                "Mô tả nội dung card. Đây là ví dụ cách dùng dark mode."}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium">
              Learn More
            </button>
          </section>

          {/* Card 2 - Highlighted */}
          <section className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 ring-1 ring-blue-100 dark:ring-blue-900">
            <div className="mb-3 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded-full">
              Popular
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Featured Card
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Sử dụng border và background màu khác để highlight card.
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-medium">
              Get Started
            </button>
          </section>

          {/* Card 3 */}
          <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Statistics
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    75%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-green-500 dark:bg-green-600 rounded-full" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Form Section */}
        <section className="mt-12 bg-gray-50 dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Form
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 active:scale-95"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Info Box */}
        <section className="mt-8 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-amber-900 dark:text-amber-100 text-sm">
            <span className="font-semibold">💡 Tip:</span> Tất cả màu tự động
            thay đổi theo dark mode. Không cần kiểm tra{" "}
            <code className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded font-mono text-xs">
              isDark
            </code>{" "}
            trong JSX!
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            © 2024 Template Component. Dark mode ready. ✨
          </p>
        </div>
      </footer>
    </div>
  );
}


