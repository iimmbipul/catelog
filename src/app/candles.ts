import { Candle } from "./components/CandleCard";

const candles: Candle[] = [
  {
    id: "D001",
    name: "Diwali Bliss Soy Candle",
    image: "/candle1.jpeg",
    price: 499,
    discount: 20,
    description: "Hand-poured soy wax candle with a cotton wick. Burns clean and bright for Diwali nights.",
    fragrance: "Jasmine & Sandalwood",
  },
  {
    id: "D002",
    name: "Festive Glow Jar Candle",
    image: "/candle2.jpeg",
    price: 399,
    discount: 10,
    description: "Eco-friendly soy wax, long-lasting fragrance, perfect for gifting.",
    fragrance: "Rose & Vanilla",
  },
  {
    id: "D003",
    name: "Golden Aura Tealight Set",
    image: "/candle3.jpeg",
    price: 299,
    discount: 0,
    description: "Set of 6 soy wax tealights. Brighten up your Diwali decor!",
    fragrance: "Citrus & Lemongrass",
  },
];

export default candles;
