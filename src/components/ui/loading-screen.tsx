"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Image
            src="/logo.svg"
            alt="Loading..."
            width={200}
            height={80}
            className="w-48 h-auto object-contain"
            priority
          />
        </motion.div>

        {/* Optional: Ripple effect or ring for extra "pulse" */}
        <motion.div
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary/10 rounded-full -z-10"
        />
      </div>
    </motion.div>
  );
}
