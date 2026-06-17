"use client";

import "@/i18n";

import { Booking } from "@/components/Booking";
import { Bungalows } from "@/components/Bungalows";
import { CookieBanner } from "@/components/CookieBanner";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Philosophy } from "@/components/Philosophy";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  useLenis();

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Philosophy />
        <Bungalows />
        <Experience />
        <Location />
        <Booking />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
