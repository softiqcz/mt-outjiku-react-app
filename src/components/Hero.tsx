"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "@/styles/Hero.module.css";

const bookingUrl = "https://www.booking.com";

const firstLineWords = [
  "hero.headline.where",
  "hero.headline.the",
  "hero.headline.wild",
  "hero.headline.horizon",
] as const;
const secondLineWords = [
  "hero.headline.meets",
  "hero.headline.quiet",
  "hero.headline.luxury",
] as const;
const highlightedWords = new Set([
  "hero.headline.wild",
  "hero.headline.horizon",
]);

export function Hero() {
  const { t } = useTranslation();
  const shouldReduceMotion = usePrefersReducedMotion();

  const headingVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.16,
            staggerChildren: 0.08,
          },
        },
      };

  const wordVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const supportVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay: 1, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <section className={styles.hero} aria-label={t("brand.name")}>
        <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/pics/preview.png"
            aria-label={t("hero.videoAria")}
        >
        <source
          src="https://videos.pexels.com/video-files/4818826/4818826-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
        {t("hero.videoFallback")}
      </video>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <p>{t("brand.name")}</p>
        <motion.h1
          className={styles.title}
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          <span className={styles.titleLine}>
            {firstLineWords.map((wordKey) => (
              <motion.span
                className={
                  highlightedWords.has(wordKey) ? styles.highlight : styles.word
                }
                variants={wordVariants}
                key={wordKey}
              >
                {t(wordKey)}
              </motion.span>
            ))}
          </span>
          <span className={styles.titleLine}>
            {secondLineWords.map((wordKey) => (
              <motion.span
                className={styles.word}
                variants={wordVariants}
                key={wordKey}
              >
                {t(wordKey)}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.div
          className={styles.rule}
          initial={shouldReduceMotion ? { opacity: 1, scaleX: 1 } : false}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />

        <motion.div
          className={styles.support}
          initial="hidden"
          animate="visible"
          variants={supportVariants}
        >
          <p>{t("hero.sub")}</p>
          <a
            className={styles.cta}
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("hero.cta")}
          </a>
        </motion.div>
      </div>

      <a className={styles.scrollIndicator} href="#philosophy">
        <span>{t("hero.scrollLabel")}</span>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
