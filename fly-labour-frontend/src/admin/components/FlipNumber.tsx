import { motion, AnimatePresence } from "framer-motion";

function FlipNumber({ value }: { value: string }) {
  return (
    <div className="relative h-8 w-7 bg-gradient-to-b from-red-500 to-red-700 rounded shadow-md border border-red-400 overflow-hidden flex justify-center items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="text-white font-mono font-bold text-sm"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
