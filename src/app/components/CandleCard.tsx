'use client'

import Image from "next/image";
import styles from "./CandleCard.module.css";
import { useState } from "react";

export interface Candle {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  fragrance: string;
}

interface CandleCardProps {
  candle: Candle;
}

export default function CandleCard({ candle }: CandleCardProps) {
  const [hovered, setHovered] = useState(false);
  const discountedPrice = candle.price - (candle.price * candle.discount) / 100;
  const whatsAppLink = `https://wa.me/79903645832?text=I'm%20interested%20in%20Candle%20ID:%20${candle.id}`;

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: hovered ? "0 8px 40px 0 rgba(224, 122, 27, 0.13), 0 2px 16px 0 rgba(0,0,0,0.06)" : undefined, transform: hovered ? "translateY(-6px) scale(1.025)" : undefined }}
    >
      <Image
        src={candle.image}
        alt={candle.name}
        width={220}
        height={220}
        className={styles.image}
        style={{ boxShadow: hovered ? "0 6px 24px 0 rgba(224, 122, 27, 0.18)" : undefined, transform: hovered ? "scale(1.04) rotate(-1deg)" : undefined, transition: "box-shadow 0.3s, transform 0.3s" }}
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
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.buyNow}
      >
        Buy Now on WhatsApp
      </a>
    </div>
  );
}
