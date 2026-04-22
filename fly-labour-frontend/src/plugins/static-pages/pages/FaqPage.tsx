import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { useT } from "../../../core/hooks/useT";

export default function FaqPage() {
  const { t } = useT();
  const d = t("faq");

  const CATEGORIES = [
    d.c_program,
    d.c_req,
    d.c_process,
    d.c_ben,
  ];

  const FAQS = [
    {
      category: d.c_program,
      q: d.q1,
      a: d.a1,
    },
    {
      category: d.c_program,
      q: d.q2,
      a: d.a2,
    },
    {
      category: d.c_program,
      q: d.q3,
      a: d.a3,
    },
    {
      category: d.c_req,
      q: d.q4,
      a: d.a4,
    },
    {
      category: d.c_req,
      q: d.q5,
      a: d.a5,
    },
    {
      category: d.c_req,
      q: d.q6,
      a: d.a6,
    },
    {
      category: d.c_process,
      q: d.q7,
      a: d.a7,
    },
    {
      category: d.c_process,
      q: d.q8,
      a: d.a8,
    },
    {
      category: d.c_process,
      q: d.q9,
      a: d.a9,
    },
    {
      category: d.c_ben,
      q: d.q10,
      a: d.a10,
    },
    {
      category: d.c_ben,
      q: d.q11,
      a: d.a11,
    },
    {
      category: d.c_ben,
      q: d.q12,
      a: d.a12,
    },
  ];

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div className="relative max-w-3xl mx-auto text-center">
          <HelpCircle size={48} className="text-amber-500 dark:text-brand-gold mx-auto mb-6 opacity-80" />
          <p className="text-amber-600 dark:text-brand-gold text-sm font-bold tracking-widest uppercase mb-4">
            {d.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {d.title}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {d.titleAccent}
            </span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {d.desc}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-16 z-20 bg-slate-50/80 dark:bg-[#0d1117]/80 backdrop-blur-md border-y border-slate-200 dark:border-brand-border py-4 px-6 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-amber-500 dark:bg-brand-gold text-white dark:text-brand-dark shadow-md"
                  : "bg-white dark:bg-brand-card text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-brand-border hover:border-amber-400 dark:hover:border-brand-gold/30 hover:bg-amber-50 dark:hover:bg-brand-gold/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="py-16 px-6 relative">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`group bg-white dark:bg-brand-card border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-amber-400 dark:border-brand-gold/50 shadow-md shadow-amber-900/5 dark:shadow-none"
                    : "border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none hover:border-amber-200 dark:hover:border-brand-gold/20"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                >
                  <span
                    className={`font-semibold pr-6 transition-colors ${
                      isOpen ? "text-amber-600 dark:text-brand-gold" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-amber-100 dark:bg-brand-gold/20 text-amber-600 dark:text-brand-gold"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400"
                    }`}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 md:p-6 pt-0 text-slate-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Layer */}
      <div className="py-20 px-6 border-t border-slate-200 dark:border-brand-border bg-white dark:bg-brand-card transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="text-amber-600 dark:text-brand-gold" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {d.cta_title}
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8 max-w-xl mx-auto text-lg">
            {d.cta_desc}
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            {d.cta_btn}
          </Link>
        </div>
      </div>
    </div>
  );
}
