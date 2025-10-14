'use client'

import Image from "next/image";
import styles from "./CandleCard.module.css";
import { useState, useEffect, useRef } from "react";
import cardStyles from "./CandleCard.module.css";
export interface Candle {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  fragrance: string;
  bestSeller?: boolean;
  trending?: boolean;
  soldout?: boolean;
}

interface CandleCardProps {
  candle: Candle;
  onImageClick?: (c: Candle) => void;
}

export default function CandleCard({ candle, onImageClick }: CandleCardProps) {
  const [hovered, setHovered] = useState(false);
  const discountedPrice = candle.price - (candle.price * candle.discount) / 100;
  const phone = '+917903645832'; // No '+' for wa.me links
   const message = `Hi! I'm interested in purchasing the candle named ${candle.name} (Candle ID: ${candle.id}). Could you please let me know the available payment methods?`;
  const whatsAppLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`${styles.card} ${candle.soldout ? styles.soldOutCard : ''}`}
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
      // style={{ boxShadow: hovered ? "0 8px 40px 0 rgba(224, 122, 27, 0.13), 0 2px 16px 0 rgba(0,0,0,0.06)" : undefined, transform: hovered ? "translateY(-6px) scale(1.025)" : undefined }}
    >
      {/* Badges (Sold Out overrides others) */}
      <div className={styles.badges} aria-hidden>
        { candle.soldout ? (
          <span className={`${styles.badge} ${styles.soldBadge}`}>Sold Out</span>
        ) : (
          <>
            { candle.bestSeller && (
              <span className={`${styles.badge} ${styles.bestSeller}`}>Best Seller</span>
            ) }
            { candle.trending && (
              <span className={`${styles.badge} ${styles.trending}`}>Trending</span>
            ) }
          </>
        ) }
      </div>

      { candle.soldout && <div className={styles.soldOverlay} aria-hidden /> }
      <Image
        src={candle.image}
        alt={candle.name}
        width={220}
        height={220}
        className={styles.image}
        style={{ boxShadow: hovered ? "0 6px 24px 0 rgba(224, 122, 27, 0.18)" : undefined, transform: hovered ? "scale(1.04) rotate(-1deg)" : undefined, transition: "box-shadow 0.3s, transform 0.3s", objectFit: 'cover', objectPosition: 'center', cursor: 'pointer' }}
        onClick={() => onImageClick && !candle.soldout ? onImageClick(candle) : undefined}
      />
      <h2 className={styles.name}>{candle.name}</h2>
      <p className={styles.fragrance}><b>Fragrance:</b> {candle.fragrance}</p>
      <p className={styles.description}>{candle.description}</p>
      <div className={styles.priceSection}>
        <span className={styles.price}>₹{discountedPrice.toFixed(2)}</span>
        {candle.discount > 0 && (
          <span className={styles.originalPrice}>₹{candle.price.toFixed(2)}</span>
        )}
        {candle.discount > 0 && (
          <span className={styles.discount}>-{candle.discount}%</span>
        )}
      </div>
      <a
        href={candle.soldout ? undefined : whatsAppLink}
        target={candle.soldout ? undefined : "_blank"}
        rel={candle.soldout ? undefined : "noopener noreferrer"}
        className={cardStyles.modalBuyBtn}
        aria-label={candle.soldout ? `${candle.name} is sold out` : `Buy ${candle.name} on WhatsApp`}
        aria-disabled={candle.soldout ? true : undefined}
        onClick={(e) => { if (candle.soldout) { e.preventDefault(); } }}
      >
        <span className={styles.whatsappIcon} aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20.52 3.48A11.92 11.92 0 0012 0C5.373 0 .01 5.373 0 12c0 2.116.556 4.184 1.61 6.01L0 24l6.11-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52z" fill="#25D366" />
            <path d="M17.4 14.6c-.3-.15-1.76-.86-2.03-.96-.27-.1-.46-.15-.66.15-.2.3-.78.96-.95 1.15-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.48-1.79-1.65-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.2 0-.37-.05-.52-.05-.15-.66-1.58-.9-2.17-.24-.57-.49-.49-.66-.5l-.56-.01c-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.64 1.1 2.82.13.17 1.9 2.98 4.6 4.18 3.2 1.4 3.2.93 3.78.87.58-.05 1.76-.72 2.01-1.41.24-.7.24-1.3.17-1.41-.07-.12-.27-.2-.57-.35z" fill="#fff" />
          </svg>
        </span>
        {candle.soldout ? 'Sold Out' : 'Buy Now'}
      </a>

    </div>
  );
}
