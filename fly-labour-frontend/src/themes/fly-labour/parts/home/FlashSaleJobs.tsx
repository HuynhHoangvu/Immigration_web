import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Slider, { Settings } from "react-slick";
import { useQuery } from "@tanstack/react-query";
import JobCard from "@/plugins/jobs/components/JobCard";
import { jobsApi } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import type { Job } from "@/core/types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const digitVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

function Digit({ value }: { value: string }) {
  return (
    <div className="flex h-9 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-mono text-lg font-bold shadow-sm shadow-slate-900/20">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          variants={digitVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState({ h: 1, m: 59, s: 47 });
  const { t } = useT();
  const h = t("home");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 1, m: 59, s: 59 };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const digits = useMemo(() => [pad(time.h), pad(time.m), pad(time.s)], [time]);

  return (
    <div className="flex items-center gap-3">
      <Clock size={16} className="text-red-500" />
      <div className="flex items-center gap-4 rounded-3xl bg-slate-100/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 dark:bg-slate-900/70 dark:text-brand-muted dark:shadow-none backdrop-blur-sm transition-colors">
        <span>{h.endsIn}</span>
        <div className="flex items-center gap-2">
          {digits.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Digit value={value} />
              {index < digits.length - 1 && (
                <span className="text-red-500 font-semibold">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FlashSaleJobs() {
  const hotJobsQuery = useQuery<Job[], Error>({
    queryKey: ["hotJobs"],
    queryFn: async () => {
      const response = await jobsApi.getHot();
      return response.data as Job[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const sliderRef = useRef<Slider | null>(null);
  const jobs = hotJobsQuery.data ?? [];
  const isLoading = hotJobsQuery.isLoading;

  const sliderSettings: Settings = useMemo(
    () => ({
      dots: false,
      infinite: jobs.length > 3,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 5200,
      pauseOnHover: true,
      swipeToSlide: true,
      slidesToShow: 5,
      slidesToScroll: 3,
      arrows: false,
      responsive: [
        {
          breakpoint: 1536,
          settings: { slidesToShow: 4, slidesToScroll: 3 },
        },
        {
          breakpoint: 1280,
          settings: { slidesToShow: 3, slidesToScroll: 3 },
        },
        {
          breakpoint: 1024,
          settings: { slidesToShow: 2, slidesToScroll: 2 },
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 2, slidesToScroll: 2 },
        },
        {
          breakpoint: 480,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
      ],
    }),
    [jobs.length],
  );

  return (
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 shadow-lg shadow-red-200/30 text-white">
              <Flame
                size={20}
                className="fill-yellow-400 text-yellow-400 animate-pulse"
              />
              <span className="font-bold text-lg italic tracking-tight">
                FLASH JOBS
              </span>
            </div>
            <Countdown />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-brand-border dark:bg-brand-card dark:text-brand-muted dark:hover:border-brand-gold/50 dark:hover:text-brand-gold flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => sliderRef.current?.slickNext()}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-brand-border dark:bg-brand-card dark:text-brand-muted dark:hover:border-brand-gold/50 dark:hover:text-brand-gold flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Khối Style quan trọng để ép Slick hiển thị đúng Grid và chiều cao */}
        <style>{`
          .slick-spaced-slider .slick-track {
            display: flex !important;
          }
          .slick-spaced-slider .slick-slide {
            height: auto !important;
            float: none !important;
          }
          .slick-spaced-slider .slick-slide > div {
            height: 100%;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="h-[300px] w-full rounded-2xl bg-slate-100 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-brand-border animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="overflow-hidden">
              <Slider
                ref={sliderRef}
                {...sliderSettings}
                className="slick-spaced-slider -mx-2 sm:-mx-3 pb-4"
              >
                {jobs.map((job, index) => (
                  /* Đảm bảo px-3 tạo khoảng cách 24px giữa các cột */
                  <div key={job.id} className="h-full px-2 sm:px-3 py-3 sm:py-4">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.04,
                      }}
                      /* Bọc bằng class w-full h-full block */
                      className="h-full w-full block"
                    >
                      {/* Đảm bảo JobCard chiếm trọn 100% không gian */}
                      <div className="h-full w-full">
                        <JobCard job={job} />
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      </div>
    </section>
  );
}
