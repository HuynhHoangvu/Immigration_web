import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { useT } from "@core/hooks/useT";
import s from "./FaqPage.module.scss";
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
    <div className={`${s.page} fl-surface-page`}>
      <div className={s.hero}>
        <div className={s.heroBg} />
        <div className={`${s.heroInner} fl-max-3xl`}>
          <HelpCircle size={48} className={s.heroIcon} />
          <p className={s.badge}>{d.badge}</p>
          <h1 className={s.title}>
            {d.title}
            <br />
            <span className={s.titleAccent}>{d.titleAccent}</span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>{d.desc}</p>
        </div>
      </div>

      <div className={`${s.categoryBar} fl-strip-sticky`}>
        <div className={`${s.categoryWrap} fl-max-4xl`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={clsx(s.catBtn, activeCategory === cat && s.catBtnActive)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={s.faqSection}>
        <div className={`${s.faqList} fl-max-3xl`}>
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={clsx(s.faqItem, isOpen && s.faqItemOpen)}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={s.faqToggle}
                >
                  <span className={clsx(s.faqQuestion, isOpen && s.faqQuestionOpen)}>
                    {faq.q}
                  </span>
                  <div className={clsx(s.faqIconWrap, isOpen && s.faqIconWrapOpen)}>
                    <ChevronDown
                      size={18}
                      className={clsx(s.faqChevron, isOpen && s.faqChevronOpen)}
                    />
                  </div>
                </button>
                <div className={clsx(s.faqAnswerGrid, isOpen && s.faqAnswerGridOpen)}>
                  <div className={s.faqAnswerInner}>
                    <p className={s.faqAnswer}>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.cta}>
        <div className={`${s.ctaInner} fl-max-4xl`}>
          <div className={s.ctaIconBox}>
            <MessageCircle className={s.ctaIcon} size={32} />
          </div>
          <h2 className={s.ctaTitle}>{d.cta_title}</h2>
          <p className={`${s.ctaDesc} fl-max-xl`}>{d.cta_desc}</p>
          <Link to="/contact" className={`btn-primary ${s.ctaBtn}`}>
            {d.cta_btn}
          </Link>
        </div>
      </div>
    </div>
  );
}
