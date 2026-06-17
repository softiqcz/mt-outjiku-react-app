"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "@/styles/Philosophy.module.css";

export function Philosophy() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backdropY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-12%", "12%"],
  );

  const revealVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delayChildren: 0.16,
            staggerChildren: 0.12,
          },
        },
      };

  return (
    <section id="philosophy" ref={sectionRef} className={styles.section}>
      <motion.div
        className={styles.backdrop}
        style={{ y: backdropY }}
        aria-hidden="true"
      >
        {t("philosophy.backdrop")}
      </motion.div>

      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealVariants}
      >
        <motion.p className="eyebrow" variants={revealVariants}>
          {t("philosophy.eyebrow")}
        </motion.p>
        <motion.blockquote className={styles.quote} variants={revealVariants}>
          {t("philosophy.quote")}
        </motion.blockquote>
        <motion.div className={styles.body} variants={revealVariants}>
          <p>{t("philosophy.body.primary")}</p>
          <p>{t("philosophy.body.secondary")}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
