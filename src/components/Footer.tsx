"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "@/styles/Footer.module.css";
import { publicPath } from "@/utils/publicPath";

const languages = ["en", "cz", "de"] as const;
const languageStorageKey = "mtOtjikuLanguage";
const themeStorageKey = "mtOtjikuTheme";
const bugReportsStorageKey = "mtOtjikuBugReports";

type Language = (typeof languages)[number];
type ThemeMode = "dark" | "light";

function isLanguage(value: string | null): value is Language {
  return languages.includes(value as Language);
}

function getActiveLanguage(language: string | undefined): Language {
  const candidate = language ?? null;

  return isLanguage(candidate) ? candidate : "en";
}

function getHtmlLanguage(language: Language) {
  const htmlLanguages: Record<Language, string> = {
    en: "en",
    cz: "cs",
    de: "de",
  };

  return htmlLanguages[language];
}

function getLanguageSwitchLabelKey(language: Language) {
  const labelKeys: Record<Language, string> = {
    en: "language.switchToEn",
    cz: "language.switchToCz",
    de: "language.switchToDe",
  };

  return labelKeys[language];
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path
        d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19 12a7.3 7.3 0 0 0-.08-1.04l2.02-1.55-2-3.46-2.4.98a7.84 7.84 0 0 0-1.8-1.04L14.4 3h-4.8l-.34 2.89c-.64.26-1.24.61-1.8 1.04l-2.4-.98-2 3.46 2.02 1.55a7.48 7.48 0 0 0 0 2.08L3.06 14.6l2 3.46 2.4-.98c.56.43 1.16.78 1.8 1.04l.34 2.89h4.8l.34-2.89c.64-.26 1.24-.61 1.8-1.04l2.4.98 2-3.46-2.02-1.56c.05-.34.08-.69.08-1.04Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

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

export function Footer() {
  const { i18n, t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [reportMessage, setReportMessage] = useState("");
  const [reportStatus, setReportStatus] = useState("");
  const activeLanguage = getActiveLanguage(i18n.resolvedLanguage);
  const oppositeTheme = useMemo(
    () => (themeMode === "dark" ? "light" : "dark"),
    [themeMode],
  );

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    setThemeMode(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

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

  function handleThemeChange(nextTheme: ThemeMode) {
    setThemeMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(themeStorageKey, nextTheme);
  }

  function handleBugSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = reportMessage.trim();

    if (!trimmedMessage) {
      setReportStatus(t("settings.report.required"));
      return;
    }

    const previousReports = JSON.parse(
      window.localStorage.getItem(bugReportsStorageKey) || "[]",
    ) as Array<{ message: string; createdAt: string }>;

    window.localStorage.setItem(
      bugReportsStorageKey,
      JSON.stringify([
        ...previousReports,
        { message: trimmedMessage, createdAt: new Date().toISOString() },
      ]),
    );
    setReportMessage("");
    setReportStatus(t("settings.report.saved"));
  }

  return (
    <>
      <footer className={styles.footer}>
        <div>
          <Image
            className={styles.logoImage}
            src={publicPath("/images/logos/logo.png")}
            alt=""
            width={220}
            height={223}
          />
          <p className={styles.logo}>{t("brand.name")}</p>
          <p className={styles.tagline}>{t("brand.tagline")}</p>
        </div>
        <button
          className={styles.settingsButton}
          type="button"
          aria-controls="site-settings"
          aria-expanded={settingsOpen}
          aria-label={t("settings.open")}
          onClick={() => setSettingsOpen((current) => !current)}
        >
          <GearIcon />
          <span>{t("footer.settings")}</span>
        </button>
        <div className={styles.meta}>
          <p>{t("footer.coordinates")}</p>
          <p>{t("footer.copyright", { year: currentYear })}</p>
        </div>
      </footer>

      {settingsOpen ? (
        <div
          className={styles.settingsPanel}
          id="site-settings"
          role="dialog"
          aria-modal="false"
          aria-labelledby="site-settings-title"
        >
          <div className={styles.panelHeader}>
            <div>
              <p className="eyebrow">{t("settings.eyebrow")}</p>
            </div>
            <button
              className={styles.iconButton}
              type="button"
              aria-label={t("settings.close")}
              onClick={() => setSettingsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.settingRow}>
            <div>
              <p>{t("settings.mode")}</p>
              <span>{t(`header.mode.${themeMode}`)}</span>
            </div>
            <button
              className={styles.actionButton}
              type="button"
              onClick={() => handleThemeChange(oppositeTheme)}
            >
              {t(`header.mode.${oppositeTheme}`)}
            </button>
          </div>

          <div className={styles.settingRow}>
            <div>
              <p>{t("settings.language")}</p>
              <span>{t(`language.${activeLanguage}`)}</span>
            </div>
            <nav className={styles.language} aria-label={t("language.aria")}>
              {languages.map((language) => (
                <button
                  type="button"
                  className={
                    language === activeLanguage
                      ? styles.activeLanguageButton
                      : styles.languageButton
                  }
                  aria-label={t(getLanguageSwitchLabelKey(language))}
                  onClick={() => handleLanguageChange(language)}
                  key={language}
                >
                  {t(`language.${language}`)}
                </button>
              ))}
            </nav>
          </div>

          <button
            className={styles.fullButton}
            type="button"
            onClick={() => {
              window.dispatchEvent(new Event("mt-otjiku-open-cookies"));
              setSettingsOpen(false);
            }}
          >
            {t("settings.cookies")}
          </button>
          <button
            className={styles.fullButton}
            type="button"
            onClick={() => {
              setReportOpen(true);
              setReportStatus("");
            }}
          >
            {t("settings.report.open")}
          </button>
        </div>
      ) : null}

      {reportOpen ? (
        <div className={styles.modalLayer}>
          <div
            className={styles.reportDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bug-report-title"
          >
            <div className={styles.panelHeader}>
              <div>
                <p className="eyebrow">{t("settings.report.eyebrow")}</p>
                <h2 id="bug-report-title">{t("settings.report.title")}</h2>
              </div>
              <button
                className={styles.iconButton}
                type="button"
                aria-label={t("settings.report.close")}
                onClick={() => setReportOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form className={styles.reportForm} onSubmit={handleBugSubmit}>
              <label htmlFor="bug-report-message">
                {t("settings.report.label")}
              </label>
              <textarea
                id="bug-report-message"
                value={reportMessage}
                onChange={(event) => setReportMessage(event.target.value)}
                placeholder={t("settings.report.placeholder")}
              />
              {reportStatus ? (
                <p className={styles.reportStatus} aria-live="polite">
                  {reportStatus}
                </p>
              ) : null}
              <button className={styles.actionButton} type="submit">
                {t("settings.report.submit")}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
