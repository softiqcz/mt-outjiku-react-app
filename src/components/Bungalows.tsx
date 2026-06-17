"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "@/styles/Bungalows.module.css";
import { publicPath } from "@/utils/publicPath";

const bungalowIds = ["dune", "kopje", "horizon"] as const;

type BungalowId = (typeof bungalowIds)[number];
type MediaItem = {
  src: string;
  type: "image" | "video";
};
type BungalowMedia = {
  id: BungalowId;
  media: MediaItem[];
};
type BungalowMediaResponse = {
  bungalows: BungalowMedia[];
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function isBungalowId(value: string): value is BungalowId {
  return bungalowIds.includes(value as BungalowId);
}

function getMediaAlt(
  t: ReturnType<typeof useTranslation>["t"],
  bungalowId: BungalowId,
  index: number,
) {
  return t(`bungalows.${bungalowId}.gallery.${index}.alt`, {
    defaultValue: t("bungalows.galleryFallbackAlt", {
      number: index + 1,
      suite: t(`bungalows.${bungalowId}.title`),
    }),
  });
}

function getMediaOpenLabel(
  t: ReturnType<typeof useTranslation>["t"],
  bungalowId: BungalowId,
  index: number,
) {
  return t(`bungalows.${bungalowId}.gallery.${index}.open`, {
    defaultValue: t("bungalows.galleryFallbackOpen", {
      number: index + 1,
      suite: t(`bungalows.${bungalowId}.title`),
    }),
  });
}

function MediaPreview({
  alt,
  media,
  sizes,
}: {
  alt: string;
  media: MediaItem;
  sizes: string;
}) {
  const videoRef = useAutoplayVideo<HTMLVideoElement>();

  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={publicPath(media.src)}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    );
  }

  return <Image src={publicPath(media.src)} alt={alt} fill sizes={sizes} />;
}

export function Bungalows() {
  const { t } = useTranslation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [bungalows, setBungalows] = useState<BungalowMedia[]>([]);
  const [activeBungalowId, setActiveBungalowId] = useState<BungalowId | null>(
    null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeBungalow = bungalows.find(
    (bungalow) => bungalow.id === activeBungalowId,
  );

  const listVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.08 },
        },
      };
  const itemVariants: Variants = shouldReduceMotion
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadBungalowMedia() {
      const response = await fetch(publicPath("/bungalow-media.json"), {
        signal: controller.signal,
      });
      const payload = (await response.json()) as BungalowMediaResponse;
      const sortedBungalows = bungalowIds
        .map((bungalowId) =>
          payload.bungalows.find(
            (bungalow) => bungalow.id === bungalowId && bungalow.media.length > 0,
          ),
        )
        .filter((bungalow): bungalow is BungalowMedia => {
          return Boolean(bungalow && isBungalowId(bungalow.id));
        });

      setBungalows(sortedBungalows);
    }

    loadBungalowMedia().catch(() => {
      // Navigation can abort this request; the section simply stays empty until
      // the next successful media scan.
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!activeBungalow) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveBungalowId(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeBungalow]);

  function openBungalow(bungalowId: BungalowId, imageIndex = 0) {
    setActiveBungalowId(bungalowId);
    setActiveImageIndex(imageIndex);
  }

  return (
    <section className={styles.section} aria-labelledby="bungalows-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">{t("bungalows.eyebrow")}</p>
          <h2 id="bungalows-title">{t("bungalows.title")}</h2>
        </div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={listVariants}
        >
          {bungalows.map((bungalow) => (
            <motion.article
              className={styles.suite}
              variants={itemVariants}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              key={bungalow.id}
            >
              <div className={styles.imageWrap}>
                <motion.div
                  className={styles.motionImage}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MediaPreview
                    media={bungalow.media[0]}
                    alt={getMediaAlt(t, bungalow.id, 0)}
                    sizes="(max-width: 920px) 100vw, 33vw"
                  />
                </motion.div>
              </div>
              <div className={styles.copy}>
                <h3>{t(`bungalows.${bungalow.id}.title`)}</h3>
                <p>{t(`bungalows.${bungalow.id}.description`)}</p>
                <div
                  className={styles.thumbs}
                  aria-label={t(`bungalows.${bungalow.id}.galleryAria`)}
                >
                  {bungalow.media.slice(0, 3).map((media, mediaIndex) => (
                    <button
                      className={styles.thumbButton}
                      type="button"
                      onClick={() => openBungalow(bungalow.id, mediaIndex)}
                      aria-label={getMediaOpenLabel(t, bungalow.id, mediaIndex)}
                      key={media.src}
                    >
                      <MediaPreview
                        media={media}
                        alt={getMediaAlt(t, bungalow.id, mediaIndex)}
                        sizes="(max-width: 920px) 33vw, 10vw"
                      />
                    </button>
                  ))}
                </div>
                <button
                  className={styles.detailButton}
                  type="button"
                  onClick={() => openBungalow(bungalow.id)}
                >
                  {t("bungalows.viewDetails")}
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeBungalow ? (
          <motion.div
            className={styles.modalLayer}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          >
            <motion.div
              className={styles.detailDialog}
              data-lenis-prevent
              data-lenis-prevent-wheel
              role="dialog"
              aria-modal="true"
              aria-labelledby="bungalow-detail-title"
              onWheel={(event) => event.stopPropagation()}
              initial={
                shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }
              }
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className={styles.closeButton}
                type="button"
                aria-label={t("bungalows.closeDetails")}
                onClick={() => setActiveBungalowId(null)}
              >
                <CloseIcon />
              </button>

              <div className={styles.detailMedia}>
                <MediaPreview
                  media={activeBungalow.media[activeImageIndex]}
                  alt={getMediaAlt(t, activeBungalow.id, activeImageIndex)}
                  sizes="(max-width: 920px) 100vw, 58vw"
                />
              </div>

              <div className={styles.detailCopy}>
                <p className="eyebrow">{t("bungalows.detailEyebrow")}</p>
                <h3 id="bungalow-detail-title">
                  {t(`bungalows.${activeBungalow.id}.title`)}
                </h3>
                <p>{t(`bungalows.${activeBungalow.id}.detail`)}</p>

                <dl className={styles.facts}>
                  <div>
                    <dt>{t("bungalows.fact.view")}</dt>
                    <dd>{t(`bungalows.${activeBungalow.id}.view`)}</dd>
                  </div>
                  <div>
                    <dt>{t("bungalows.fact.mood")}</dt>
                    <dd>{t(`bungalows.${activeBungalow.id}.mood`)}</dd>
                  </div>
                </dl>

                <div
                  className={styles.detailThumbs}
                  aria-label={t(`bungalows.${activeBungalow.id}.galleryAria`)}
                >
                  {activeBungalow.media.map((media, mediaIndex) => (
                    <button
                      className={
                        mediaIndex === activeImageIndex
                          ? styles.activeDetailThumb
                          : styles.detailThumb
                      }
                      type="button"
                      onClick={() => setActiveImageIndex(mediaIndex)}
                      aria-label={getMediaOpenLabel(
                        t,
                        activeBungalow.id,
                        mediaIndex,
                      )}
                      key={media.src}
                    >
                      <MediaPreview
                        media={media}
                        alt={getMediaAlt(t, activeBungalow.id, mediaIndex)}
                        sizes="(max-width: 920px) 33vw, 8vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
