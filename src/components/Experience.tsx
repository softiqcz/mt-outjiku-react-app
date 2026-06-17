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
import styles from "@/styles/Experience.module.css";
import { publicPath } from "@/utils/publicPath";

const experiences = [
  {
    id: "dawn",
    image: "/images/pics/GAMEDRIVE.jpg",
  },
  {
    id: "chef",
    image:
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
  },
  {
    id: "stars",
    image: "/images/pics/STARGAZING.jpg",
  },
] as const;

function ParallaxImage({
  src,
  alt,
}: Readonly<{
  src: string;
  alt: string;
}>) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-7.5%", "7.5%"],
  );

  return (
    <div className={styles.imageFrame} ref={imageRef}>
      <motion.img
        src={publicPath(src)}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className={styles.image}
      />
    </div>
  );
}

export function Experience() {
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
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <section className={styles.section} aria-labelledby="experience-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">{t("experience.eyebrow")}</p>
          <h2 id="experience-title">{t("experience.title")}</h2>
        </div>

        <div className={styles.rows}>
          {experiences.map((experience, index) => (
            <motion.article
              className={`${styles.row} ${
                index % 2 === 1 ? styles.rowReverse : ""
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={revealVariants}
              key={experience.id}
            >
              <ParallaxImage
                src={experience.image}
                alt={t(`experience.${experience.id}.alt`)}
              />
              <div className={styles.copy}>
                <span>{`0${index + 1}`}</span>
                <h3>{t(`experience.${experience.id}.title`)}</h3>
                <p>{t(`experience.${experience.id}.description`)}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
