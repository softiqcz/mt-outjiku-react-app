"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "@/styles/Header.module.css";

const bookingUrl = "https://www.booking.com";
const facebookUrl = "https://www.facebook.com/profile.php?id=61589606086703";
const googleUrl =
  "https://www.google.com/search?client=safari&hs=XXQV&sa=X&sca_esv=4e15ce235f91c124&rls=en&biw=1841&bih=883&sxsrf=ANbL-n7tbHEb_MvdoQN3TL8zj5EQAyIshg:1781703251409&q=Mt.Otjiku+Recenze&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDIwsTQxMDQ2NTQ3MDc2t7Q02MDI-IpR0LdEz78kKzO7VCEoNTk1ryp1ESumGABNfAElQgAAAA&rldimm=9204940135170737990&tbm=lcl&hl=cs-CZ&ved=2ahUKEwiEvZTrsY6VAxWvh_0HHYNKAvMQ9fQKegQIKBAG#lkt=LocalPoiReviews";
const languageStorageKey = "mtOtjikuLanguage";
const languages = ["en", "cz", "de"] as const;

type Language = (typeof languages)[number];

function isLanguage(value: string | null): value is Language {
  return languages.includes(value as Language);
}

function getActiveLanguage(language: string | undefined): Language {
  const candidate = language ?? null;

  return isLanguage(candidate) ? candidate : "en";
}

function getNextLanguage(language: Language): Language {
  const nextLanguage: Record<Language, Language> = {
    en: "cz",
    cz: "de",
    de: "en",
  };

  return nextLanguage[language];
}

function getHtmlLanguage(language: Language) {
  const htmlLanguages: Record<Language, string> = {
    en: "en",
    cz: "cs",
    de: "de",
  };

  return htmlLanguages[language];
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M14 8.5h2.25V5.2A11.2 11.2 0 0 0 13.2 5c-3.02 0-5.1 1.85-5.1 5.22v2.95H5v3.7h3.1V24h3.75v-7.13h3.1l.5-3.7h-3.6v-2.58c0-1.07.3-2.09 2.15-2.09Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M21.6 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.52Z"
        fill="currentColor"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.25l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A9.99 9.99 0 0 0 12 22Z"
        fill="currentColor"
        opacity=".78"
      />
      <path
        d="M6.4 14.07A6 6 0 0 1 6.09 12c0-.72.12-1.42.31-2.07V7.34H3.06A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.06 4.66l3.34-2.59Z"
        fill="currentColor"
        opacity=".56"
      />
      <path
        d="M12 5.81c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.95 2.81 14.69 2 12 2a9.99 9.99 0 0 0-8.94 5.34L6.4 9.93C7.19 7.57 9.4 5.81 12 5.81Z"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  );
}

export function Header() {
  const { i18n, t } = useTranslation();
  const activeLanguage = getActiveLanguage(i18n.resolvedLanguage);
  const inactiveLanguage = getNextLanguage(activeLanguage);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);

    if (isLanguage(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = getHtmlLanguage(activeLanguage);
  }, [activeLanguage]);

  function handleLanguageChange(language: Language) {
    window.localStorage.setItem(languageStorageKey, language);
    i18n.changeLanguage(language);
  }

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#main-content">
        <Image
          className={styles.brandLogo}
          src="/images/logos/logo.png"
          alt=""
          width={80}
          height={80}
          priority
        />
        <span>{t("brand.name")}</span>
      </a>

      <div className={styles.actions}>
        <a
          className={styles.socialLink}
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("header.facebook")}
          title={t("header.facebook")}
        >
          <FacebookIcon />
        </a>
        <a
          className={styles.socialLink}
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("header.google")}
          title={t("header.google")}
        >
          <GoogleIcon />
        </a>
        <a
          className={styles.bookingButton}
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("header.availability")}
        </a>
        <nav className={styles.language} aria-label={t("language.aria")}>
          <button
            type="button"
            className={styles.languageButton}
            aria-label={t(
              `language.switchTo${
                inactiveLanguage.charAt(0).toUpperCase() +
                inactiveLanguage.slice(1)
              }`,
            )}
            onClick={() => handleLanguageChange(inactiveLanguage)}
          >
            {t(`language.${inactiveLanguage}`)}
          </button>
        </nav>
      </div>
    </header>
  );
}
