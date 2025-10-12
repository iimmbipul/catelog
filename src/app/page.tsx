'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import CandleCard, { Candle } from "./components/CandleCard";
import cardStyles from "./components/CandleCard.module.css";
import Link from "next/link";
import { fetchCatalog } from "./utils";

export default function Home() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalCandle, setModalCandle] = useState<Candle | null>(null);

  useEffect(() => {
    fetchCatalog()
      .then(setCandles)
      .catch(() => setError("Failed to load catalog."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft} aria-hidden></div>
          <div className={styles.brand}>
            <a href="/" aria-label="White and Wick Home">
              <img src="/whitewick.jpg" alt="White & Wick" className={styles.brandLogo} />
            </a>
              <h2 style={{color:"black", textAlign:'center',width:'100%'}}>White &amp; Wick</h2>
            <div className={styles.brandText}>
            
              <p className={styles.catalogTitle}>Diwali Candle Catalog</p>
            </div>
          </div>

          <div className={styles.socials}>
            <a
              href="https://www.instagram.com/whiteandwick/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="White and Wick on Instagram"
            >
              {/* Instagram Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="#E1306C" strokeWidth="1.4"/>
                <circle cx="12" cy="12" r="3.2" stroke="#E1306C" strokeWidth="1.4"/>
                <circle cx="17.5" cy="6.5" r="0.9" fill="#E1306C" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@Whiteandwick"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="White and Wick on YouTube"
            >
              {/* YouTube Icon */}
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M23.5 2s-.24-1.7-.98-2.45C21.6-.48 20.25 0 20.25 0S18.5 0 17.5 0H6.5C5.5 0 3.75 0 3.75 0S2.4-.48 1.48-.45C.74-.2.5 1.5.5 1.5S0 3.3 0 5.1v5.76c0 1.8.5 3.6.5 3.6s.24 1.7.98 2.45C2.4 16.48 3.75 16 3.75 16s1.75 0 2.75 0h11c1 0 2.75 0 2.75 0s1.35.48 2.27.45c.74.25.98-1.45.98-1.45s.5-1.8.5-3.6V5.1c0-1.8-.5-3.1-.5-3.1z" fill="#FF0000"/>
                <path d="M9.8 4.7l6.2 3.3-6.2 3.3V4.7z" fill="#fff"/>
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.headerSub}>
          <p>Brighten your Diwali with our eco-friendly, fragrant candles!</p>
        </div>
      </header>
      <main id="catalog" className={styles.catalog}>
        {loading && <span>Loading catalog...</span>}
        {error && <span style={{color: 'red'}}>{error}</span>}
        {!loading && !error && candles.map((candle) => (
          <CandleCard key={candle.id} candle={candle} onImageClick={(c) => setModalCandle(c)} />
        ))}

        {modalCandle && (
          <div className={cardStyles.modalBackdrop} role="dialog" aria-modal="true" onClick={() => setModalCandle(null)}>
            <div className={cardStyles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={cardStyles.modalClose}
                aria-label="Close"
                onClick={() => setModalCandle(null)}
              >
                ×
              </button>
              <img src={modalCandle.image} alt={modalCandle.name} className={cardStyles.modalImage} />
              <a
                href={`https://wa.me/+917903645832?text=I'm%20interested%20in%20Candle%20ID:%20${modalCandle.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cardStyles.modalBuyBtn}
                aria-label={`Buy ${modalCandle.name} on WhatsApp`}
              >
                <span className={cardStyles.whatsappIcon} aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20.52 3.48A11.92 11.92 0 0012 0C5.373 0 .01 5.373 0 12c0 2.116.556 4.184 1.61 6.01L0 24l6.11-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52z" fill="#25D366" />
                    <path d="M17.4 14.6c-.3-.15-1.76-.86-2.03-.96-.27-.1-.46-.15-.66.15-.2.3-.78.96-.95 1.15-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.48-1.79-1.65-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.2 0-.37-.05-.52-.05-.15-.66-1.58-.9-2.17-.24-.57-.49-.49-.66-.5l-.56-.01c-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.64 1.1 2.82.13.17 1.9 2.98 4.6 4.18 3.2 1.4 3.2.93 3.78.87.58-.05 1.76-.72 2.01-1.41.24-.7.24-1.3.17-1.41-.07-.12-.27-.2-.57-.35z" fill="#fff" />
                  </svg>
                </span>
                   Buy Now
              </a>
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <span>Made with ❤️ for Diwali | Soy Wax | Handcrafted</span>
      </footer>
    </div>
  );
}
