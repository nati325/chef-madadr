import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

function RecipeCarousel({ title, recipes = [] }) {
  const [index, setIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive cards per view
  const getCardsPerView = () => {
    if (windowWidth < 500) return 2;      // Mobile
    if (windowWidth < 800) return 3;      // Tablets/Small
    if (windowWidth < 1100) return 5;     // Small Laptops
    if (windowWidth < 1450) return 6;     // Laptops
    return 7;                              // Large Screens
  };

  const cardsPerView = getCardsPerView();

  // Dynamic button size based on screen width
  const getButtonSize = () => {
    if (windowWidth >= 769) return { width: "50px", height: "50px", fontSize: "22px" };
    if (windowWidth >= 481) return { width: "30px", height: "30px", fontSize: "14px" };
    return { width: "22px", height: "22px", fontSize: "12px" };
  };

  const buttonSize = getButtonSize();

  // Dynamic title size based on screen width
  const getTitleSize = () => {
    if (windowWidth >= 769) return { fontSize: "32px", marginBottom: "4px" };
    return { fontSize: "18px", marginBottom: "2px" };
  };

  const titleSize = getTitleSize();

  const maxIndex = Math.max(recipes.length - cardsPerView, 0);
  const visible = recipes.slice(index, index + cardsPerView);

  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = קדימה, -1 = אחורה

  useEffect(() => {
    if (!recipes.length) return;

    setIsAnimating(true);
    const t = setTimeout(() => setIsAnimating(false), 400);

    return () => clearTimeout(t);
  }, [index, recipes.length]);

  const handlePrev = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (index >= maxIndex) return;
    setDirection(1);
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div style={styles.carouselContainer}>
      {/* כותרת */}
      <div style={styles.titleWrapper}>
        <h2 style={{
          ...styles.titleText,
          fontSize: titleSize.fontSize,
          marginBottom: titleSize.marginBottom,
        }}>{title}</h2>

      </div>

      {/* קרוסלה */}
      <div style={styles.carouselWrapper}>
        {/* חץ אחורה */}
        <button
          onClick={handlePrev}
          onMouseEnter={(e) => {
            if (index !== 0) {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.borderColor = "rgba(255, 140, 66, 0.8)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 66, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255, 140, 66, 0.4)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 140, 66, 0.3)";
          }}
          style={{
            ...styles.arrowBtn,
            minWidth: buttonSize.width,
            width: buttonSize.width,
            height: buttonSize.height,
            fontSize: buttonSize.fontSize,
            opacity: index === 0 ? 0.3 : 1,
            cursor: index === 0 ? "default" : "pointer",
          }}
          disabled={index === 0}
        >
          &lt;
        </button>

        {/* כרטיסים + אפקט תזוזה */}
        <div
          style={{
            ...styles.cardsContainer,
            transform: isAnimating
              ? `translateX(${direction === 1 ? -30 : direction === -1 ? 30 : 0}px) rotateY(${direction === 1 ? -3 : direction === -1 ? 3 : 0}deg) scale(0.99)`
              : "translateX(0) rotateY(0deg) scale(1)",
            opacity: isAnimating ? 0.85 : 1,
          }}
        >
          {visible.map((recipe, i) => (
            <div
              key={recipe.idMeal || recipe.id || i}
              style={styles.cardWrapper}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* חץ קדימה */}
        <button
          onClick={handleNext}
          onMouseEnter={(e) => {
            if (index < maxIndex) {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.borderColor = "rgba(255, 140, 66, 0.8)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 66, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255, 140, 66, 0.4)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 140, 66, 0.3)";
          }}
          style={{
            ...styles.arrowBtn,
            minWidth: buttonSize.width,
            width: buttonSize.width,
            height: buttonSize.height,
            fontSize: buttonSize.fontSize,
            opacity: index >= maxIndex ? 0.3 : 1,
            cursor: index >= maxIndex ? "default" : "pointer",
          }}
          disabled={index >= maxIndex}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default RecipeCarousel;

// 🎨 STYLES 🎨
const styles = {
  carouselContainer: {
    width: "100%",
    maxWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "2px auto",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  titleWrapper: {
    textAlign: "center",
    marginBottom: "4px",
    marginTop: "40px",
    paddingLeft: "0",
    width: "100%",
    maxWidth: "1400px",
  },
  titleText: {
    fontWeight: "700",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#0A1128",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },


  carouselWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    maxWidth: "100vw",
    width: "100%",
    padding: "0 5px",
    boxSizing: "border-box",
    overflowX: "hidden",
    "@media (min-width: 769px)": {
      gap: "20px",
      padding: "0 20px",
    },
  },

  cardsContainer: {
    display: "flex",
    gap: "12px",
    flex: 1,
    overflow: "hidden",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
    justifyContent: "flex-start",
    "@media (min-width: 769px)": {
      gap: "24px",
    },
  },

  cardWrapper: {
    flex: "1 1 auto",
    minWidth: 0,
    width: "100%",
    transition: "transform 0.3s ease",
  },

  arrowBtn: {
    padding: "2px 4px",
    color: "#FF9F1C",
    background: "rgba(45, 24, 16, 0.6)",
    border: "1px solid rgba(255, 159, 28, 0.4)",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(255, 159, 28, 0.3)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
