"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "@/styles/CookieBanner.module.css";

const cookiePreferencesKey = "mtOtjikuCookiePreferences";

type CookiePreferences = {
  technical: true;
  analytics: boolean;
};

function readPreferences() {
  try {
    const savedPreferences = window.localStorage.getItem(cookiePreferencesKey);

    return savedPreferences
      ? (JSON.parse(savedPreferences) as CookiePreferences)
      : null;
  } catch {
    return null;
  }
}

function savePreferences(preferences: CookiePreferences) {
  window.localStorage.setItem(cookiePreferencesKey, JSON.stringify(preferences));
}

export function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const savedPreferences = readPreferences();

    if (savedPreferences) {
      setAnalyticsEnabled(savedPreferences.analytics);
      return;
    }

    setIsVisible(true);
  }, []);

  useEffect(() => {
    function openCookieSettings() {
      const savedPreferences = readPreferences();

      setAnalyticsEnabled(savedPreferences?.analytics ?? false);
      setIsCustomizing(true);
      setIsVisible(true);
    }

    window.addEventListener("mt-otjiku-open-cookies", openCookieSettings);

    return () => {
      window.removeEventListener("mt-otjiku-open-cookies", openCookieSettings);
    };
  }, []);

  function acceptAll() {
    savePreferences({ technical: true, analytics: true });
    setAnalyticsEnabled(true);
    setIsVisible(false);
  }

  function rejectOptional() {
    savePreferences({ technical: true, analytics: false });
    setAnalyticsEnabled(false);
    setIsVisible(false);
  }

  function saveSelection() {
    savePreferences({ technical: true, analytics: analyticsEnabled });
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section
      className={styles.banner}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
    >
      <div className={styles.copy}>
        <p className="eyebrow">{t("cookies.eyebrow")}</p>
        <h2 id="cookie-title">{t("cookies.title")}</h2>
        <p>{t("cookies.message")}</p>
      </div>

      {isCustomizing ? (
        <div className={styles.options}>
          <label className={styles.option}>
            <input type="checkbox" checked disabled />
            <span>
              <strong>{t("cookies.technical.title")}</strong>
              {t("cookies.technical.description")}
            </span>
          </label>
          <label className={styles.option}>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(event) => setAnalyticsEnabled(event.target.checked)}
            />
            <span>
              <strong>{t("cookies.analytics.title")}</strong>
              {t("cookies.analytics.description")}
            </span>
          </label>
        </div>
      ) : null}

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="button" onClick={acceptAll}>
          {t("cookies.acceptAll")}
        </button>
        <button className={styles.secondaryButton} type="button" onClick={rejectOptional}>
          {t("cookies.reject")}
        </button>
        {isCustomizing ? (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={saveSelection}
          >
            {t("cookies.save")}
          </button>
        ) : (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setIsCustomizing(true)}
          >
            {t("cookies.customize")}
          </button>
        )}
      </div>
    </section>
  );
}
