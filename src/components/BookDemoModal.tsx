"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import BookDemoCard from "@/components/BookDemoCard";

export default function BookDemoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        >
          {/* Close button — fixed to the viewport corner, independent of the card's scroll */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="fixed top-6 right-6 z-[110] flex items-center justify-center size-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md my-8 max-h-[85vh] overflow-y-auto rounded-2xl"
          >
            <BookDemoCard />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}