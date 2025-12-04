// src/components/Hero.jsx
import { useEffect, useState } from "react";
import "./Hero.css";

const TITLES = [
  "Find the perfect recipe",
  "Cook smarter, not harder",
  "Fresh ideas for every meal",
  "chef madar will show you the way",
];

const IMAGES = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
];

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TITLES.length);
    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${IMAGES[index]})`,
      }}
    >
      <div className="hero-overlay">
        <h1>{TITLES[index]}</h1>
      
      </div>
    </div>
  );
}

export default Hero;