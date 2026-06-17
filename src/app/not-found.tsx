import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Lost beyond the track.</h1>
      <p>
        This route is not part of the Mt.Otjiku Getaway reserve. Return to the
        main savannah experience.
      </p>
      <Link href="/">Return to Mt.Otjiku Getaway</Link>
    </main>
  );
}
