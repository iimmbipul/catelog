'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import CandleCard, { Candle } from "./components/CandleCard";
import Link from "next/link";
import { fetchCatalog } from "./utils";

export default function Home() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog()
      .then(setCandles)
      .catch(() => setError("Failed to load catalog."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>🪔 Diwali Candle Catalog 🕯️</h1>
        <p>Brighten your Diwali with our eco-friendly, fragrant candles!</p>
        <nav className={styles.menu}>
          <Link href="#catalog">Catalog</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>
      </header>
      <main id="catalog" className={styles.catalog}>
        {loading && <span>Loading catalog...</span>}
        {error && <span style={{color: 'red'}}>{error}</span>}
        {!loading && !error && candles.map((candle) => (
          <CandleCard key={candle.id} candle={candle} />
        ))}
      </main>
      <footer className={styles.footer}>
        <span>Made with ❤️ for Diwali | Soy Wax | Handcrafted</span>
      </footer>
    </div>
  );
}
