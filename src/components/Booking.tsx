"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "@/styles/Booking.module.css";

const bookingUrl = "https://www.booking.com";

export function Booking() {
  const { t } = useTranslation();
  const shouldReduceMotion = usePrefersReducedMotion();

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
            delayChildren: 0.12,
            staggerChildren: 0.1,
          },
        },
      };

  return (
    <section className={styles.section} aria-label={t("booking.eyebrow")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.backgroundImage}
        src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80"
        alt={t("booking.backgroundAlt")}
        loading="lazy"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <motion.div
        className={styles.content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealVariants}
      >
        <motion.p className="eyebrow" variants={revealVariants}>
          {t("booking.eyebrow")}
        </motion.p>
        <motion.h2 variants={revealVariants}>{t("booking.title")}</motion.h2>
        <motion.p className={styles.body} variants={revealVariants}>
          {t("booking.body")}
        </motion.p>
        <motion.a
          className={styles.cta}
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={revealVariants}
        >
          {t("booking.cta")}
        </motion.a>
        <motion.p className={styles.note} variants={revealVariants}>
          {t("booking.note")}
        </motion.p>
      </motion.div>
    </section>
  );
}
