import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useQuery } from "@tanstack/react-query";
import JobCard from "@features/jobs/components/JobCard";
import { jobsApi } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import type { Job } from "@core/types";
import s from "./FlashSaleJobs.module.scss";

// @ts-ignore
import "swiper/swiper-bundle.css";

const digitVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

function Digit({ value }: { value: string }) {
  return (
    <div className={s.digitBox}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          variants={digitVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.24, ease: "easeOut" }}
          className={s.digitValue}
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
    <div className={s.countdown}>
      <Clock size={16} className={s.clockIcon} />
      <div className={s.countdownPanel}>
        <span>{h.endsIn}</span>
        <div className={s.digitsWrap}>
          {digits.map((value, index) => (
            <div key={index} className={s.digitGroup}>
              <Digit value={value} />
              {index < digits.length - 1 && (
                <span className={s.digitColon}>:</span>
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

  const swiperRef = useRef<SwiperType | null>(null);
  const jobs = hotJobsQuery.data ?? [];
  const isLoading = hotJobsQuery.isLoading;

  return (
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className={s.head}>
          <div className={s.headLeft}>
            <div className={s.flashBadge}>
              <Flame size={20} className={s.flashIcon} />
              <span className={s.flashText}>FLASH JOBS</span>
            </div>
            <Countdown />
          </div>

          <div className={s.nav}>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className={s.navBtn}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className={s.navBtn}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={s.loadingGrid}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={s.skeletonCard}
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
              <Swiper
                modules={[Autoplay, Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                spaceBetween={16}
                slidesPerView={1}
                loop={jobs.length > 3}
                autoplay={{ delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  480:  { slidesPerView: 2, spaceBetween: 16 },
                  768:  { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                  1536: { slidesPerView: 5, spaceBetween: 24 },
                }}
                className={s.swiper}
              >
                {jobs.map((job, index) => (
                  <SwiperSlide key={job.id} className={s.slide}>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.04 }}
                      className={s.slideInner}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={s.divider} />
      </div>
    </section>
  );
}
