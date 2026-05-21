import { motion, AnimatePresence } from "framer-motion";
import s from "./FlipNumber.module.scss";

function FlipNumber({ value }: { value: string }) {
  return (
    <div className={s.shell}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className={`font-mono ${s.digit}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
