"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "@/styles/Location.module.css";

const distances = [
  "otjiwarongo",
  "airport",
  "windhoek",
  "waterberg",
  "etosha",
] as const;

const mapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=16.80219%2C-21.27305%2C16.96219%2C-21.11305&layer=mapnik&marker=-21.19305%2C16.88219";
const mapLink =
  "https://www.openstreetmap.org/?mlat=-21.19305&mlon=16.88219#map=11/-21.19305/16.88219";

export function Location() {
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
            staggerChildren: 0.08,
          },
        },
      };

  return (
    <section className={styles.section} aria-labelledby="location-title">
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealVariants}
      >
        <div className={styles.copy}>
          <motion.p className="eyebrow" variants={revealVariants}>
            {t("location.eyebrow")}
          </motion.p>
          <motion.h2 id="location-title" variants={revealVariants}>
            {t("location.title")}
          </motion.h2>
          <motion.p className={styles.description} variants={revealVariants}>
            {t("location.description")}
          </motion.p>
          <motion.div className={styles.coordinates} variants={revealVariants}>
            <span>{t("location.coordinatesLabel")}</span>
            <strong>{t("location.coordinatesValue")}</strong>
          </motion.div>
        </div>

        <motion.div className={styles.distances} variants={revealVariants}>
          <p>{t("location.distanceLabel")}</p>
          <dl>
            {distances.map((distance) => (
              <div className={styles.distanceRow} key={distance}>
                <dt>{t(`location.${distance}.label`)}</dt>
                <dd>{t(`location.${distance}.distance`)}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div className={styles.mapPanel} variants={revealVariants}>
          <iframe
            title={t("location.mapTitle")}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            {t("location.mapLink")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
