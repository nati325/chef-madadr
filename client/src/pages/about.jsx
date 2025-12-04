import React from "react";
import "./about.css";

function About() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header with Chef Image */}
        <div style={styles.heroSection} className="about-hero">
          <div style={styles.chefImageWrapper} className="about-chef-image-wrapper">
            <img 
              src="/madar.jpg" 
              alt="Chef Netanel Madar" 
              style={styles.chefImage}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotateY(360deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateY(0deg)";
              }}
            />
          </div>
          <div style={styles.heroText} className="about-hero-text">
            <h1 style={styles.mainTitle} className="about-main-title">🌟 Meet Chef Netanel Madar</h1>
            <p style={styles.heroDescription}>
              A passionate culinary artist and full-stack developer who transforms code and cuisine into extraordinary experiences. 
              With a deep love for both technology and gastronomy, Chef Madar brings innovation to every dish and every line of code.
            </p>
            <p style={styles.heroDescription}>
              From mastering traditional recipes to crafting modern web applications, 
              his journey is fueled by creativity, precision, and an unwavering commitment to excellence.
            </p>
            <a 
              href="https://wa.me/972535378985?text=Hello%20Chef%20Madar%2C%20I%20would%20like%20to%20schedule%20a%20meeting" 
              target="_blank"
              rel="noopener noreferrer"
              style={styles.quoteBadge}
              className="about-quote-badge"
            >
              📅 Schedule a Meeting
            </a>
          </div>
        </div>

        {/* Original Header */}
        <div style={styles.header}>
          <h1 style={styles.sectionTitleLarge}>About – Chef Now</h1>
        </div>

        {/* What Is the Purpose */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>🔍 What Is the Purpose of the Website?</h2>
          <p style={styles.text}>
            Chef Now was created to make cooking <strong>simple, fast, and enjoyable</strong> for everyone —
            from home cooks to people who just want to make something tasty right now.
          </p>
          <p style={styles.text}>
            The goal is to give you recipes quickly and clearly —
            with images, ingredients, instructions, time to prepare, and more.
          </p>
        </section>

        {/* How Does It Work */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>⚙ How Does the Website Work?</h2>
          <p style={styles.text}>
            We use a free public recipes API to fetch real recipes from around the world.
          </p>
          <p style={styles.text}>
            You can search recipes by <strong>name, category, or country of origin</strong>.
          </p>
          <div style={styles.featureList}>
            <div style={styles.featureItem}>✔ Image</div>
            <div style={styles.featureItem}>✔ Ingredients list</div>
            <div style={styles.featureItem}>✔ Step-by-step instructions</div>
            <div style={styles.featureItem}>✔ Preparation time</div>
          </div>
          <p style={styles.text}>
            We also display recipes in carousels by theme (Vegan, Chicken, Quick Meals, etc.).
          </p>
          <p style={styles.textHighlight}>
            Very soon, you will be able to save favorite recipes and come back to them anytime.
          </p>
        </section>

        {/* About the Creator */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>👨‍💻 About the Creator</h2>
          <p style={styles.text}>
            This website was built by <strong>Netanel</strong>, a passionate Full Stack developer and food lover 🍲🔥
          </p>
          <p style={styles.text}>
            Hi! I'm Netanel Madar, a Full Stack developer and cooking enthusiast.
            I built this project to combine two things I love — <strong>code and food</strong>.
          </p>
          <p style={styles.textHighlight}>
            This website will keep growing and improving. Stay tuned! ❤
          </p>
        </section>

        {/* The Story */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>📖 The Story Behind the Website</h2>
          <p style={styles.text}>
            The idea started with a simple question: <em>"What should I cook today?"</em>
          </p>
          <p style={styles.text}>
            Google was too messy… and cooking should be simple.
            I also wanted to build a real project for my portfolio —
            and since I love good food… the idea was born.
          </p>
          <blockquote style={styles.quote}>
            Chef Now aims to give you a good recipe in less than 10 seconds. Just open, search, cook. No stress.
          </blockquote>
        </section>

        {/* Features */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>🧩 Features</h2>
          <div style={styles.featureGrid}>
            <div style={styles.feature}>🔎 Smart recipe search</div>
            <div style={styles.feature}>🖼 Clean and modern recipe cards</div>
            <div style={styles.feature}>🎠 Carousels by theme</div>
            <div style={styles.feature}>📄 Full recipe details page</div>
            <div style={styles.feature}>⭐ Favorites system (Coming Soon)</div>
            <div style={styles.feature}>🌍 More APIs coming soon</div>
            <div style={styles.feature}>👨‍🍳 User recipe uploads (Future)</div>
          </div>
        </section>

        {/* Contact */}
        <section style={styles.section} className="about-section">
          <h2 style={styles.sectionTitle}>📞 Contact</h2>
          <p style={styles.text}>You can reach me here:</p>
          <div style={styles.contactGrid}>
            <div style={styles.contactItem} className="about-contact-item">
              <span style={styles.contactIcon}>📧</span>
              <span style={styles.contactLabel}>Email:</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('netaneldama@gmail.com');
                  alert('Email copied to clipboard! ✅');
                }}
                style={{
                  ...styles.contactValue, 
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  color: "inherit",
                  textDecoration: "underline"
                }}
              >
                netaneldama@gmail.com
              </button>
            </div>
            <div style={styles.contactItem} className="about-contact-item">
              <span style={styles.contactIcon}>📸</span>
              <span style={styles.contactLabel}>Instagram:</span>
              <a 
                href="https://www.instagram.com/netanel_madarmusice?igsh=MXU4bW8xMGYwMzZ4Zg==" 
                target="_blank"
                rel="noopener noreferrer"
                style={styles.contactValue}
              >
                @netanel_madarmusice
              </a>
            </div>
            <div style={styles.contactItem} className="about-contact-item">
              <span style={styles.contactIcon}>💼</span>
              <span style={styles.contactLabel}>LinkedIn:</span>
              <span style={styles.contactValue}>Ginies Madar</span>
            </div>
            <div style={styles.contactItem} className="about-contact-item">
              <span style={styles.contactIcon}>🎥</span>
              <span style={styles.contactLabel}>YouTube:</span>
              <a 
                href="https://youtube.com/channel/UC2g2s3T5tKN7bCMjockxW0Q?si=irstVhesNG_AncFn" 
                target="_blank"
                rel="noopener noreferrer"
                style={styles.contactValue}
              >
                Netanel Madar Music
              </a>
            </div>
            <div style={styles.contactItem} className="about-contact-item">
              <span style={styles.contactIcon}>💬</span>
              <span style={styles.contactLabel}>WhatsApp:</span>
              <span style={styles.contactValue}>
                +972 53-537-8985
              </span>
            </div>
          </div>
        </section>

       
      
      </div>
    </div>
  );
}

export default About;

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1f1410, #2a1915)",
    color: "#f5e6d3",
    paddingTop: "calc(var(--nav-height, 70px) + 20px)",
    paddingBottom: "60px",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px",
  },
  heroSection: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    marginBottom: "50px",
    padding: "30px",
    background: "rgba(45, 24, 16, 0.6)",
    borderRadius: "20px",
    border: "2px solid rgba(255, 140, 66, 0.3)",
    boxShadow: "0 10px 40px rgba(29, 15, 10, 0.8)",
    flexWrap: "wrap",
  },
  chefImageWrapper: {
    flex: "0 0 280px",
    minWidth: "280px",
  },
  chefImage: {
    width: "100%",
    height: "auto",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(255, 140, 66, 0.4)",
    border: "3px solid rgba(255, 201, 71, 0.5)",
    transform: "rotateY(0deg)",
    transition: "transform 1.5s ease",
  },
  heroText: {
    flex: "1",
    minWidth: "300px",
  },
  heroDescription: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#f5e6d3",
    marginBottom: "16px",
  },
  quoteBadge: {
    display: "inline-block",
    padding: "12px 24px",
    background: "linear-gradient(135deg, rgba(255, 140, 66, 0.2), rgba(255, 201, 71, 0.2))",
    border: "2px solid rgba(255, 201, 71, 0.5)",
    borderRadius: "25px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffc947",
    marginTop: "10px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  mainTitle: {
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: "700",
    color: "#ffc947",
    textShadow: "0 2px 10px rgba(255, 201, 71, 0.3)",
    marginBottom: "10px",
  },
  sectionTitleLarge: {
    fontSize: "clamp(28px, 4vw, 36px)",
    fontWeight: "700",
    color: "#ffc947",
    textShadow: "0 2px 10px rgba(255, 201, 71, 0.3)",
    marginBottom: "10px",
  },
  section: {
    background: "rgba(45, 24, 16, 0.5)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 140, 66, 0.2)",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#ff8c42",
    marginBottom: "16px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#f5e6d3",
    marginBottom: "12px",
  },
  textHighlight: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#ffc947",
    fontWeight: "500",
    marginBottom: "12px",
  },
  quote: {
    borderLeft: "4px solid #ff8c42",
    paddingLeft: "20px",
    fontStyle: "italic",
    color: "#ffc947",
    fontSize: "16px",
    lineHeight: "1.8",
    marginTop: "16px",
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    margin: "16px 0",
  },
  featureItem: {
    padding: "8px 12px",
    background: "rgba(255, 140, 66, 0.1)",
    borderRadius: "8px",
    fontSize: "15px",
    borderLeft: "3px solid #ff8c42",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },
  feature: {
    padding: "12px 16px",
    background: "rgba(255, 140, 66, 0.15)",
    border: "1px solid rgba(255, 140, 66, 0.3)",
    borderRadius: "12px",
    fontSize: "15px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  contactGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "16px",
  },
  contactItem: {
    padding: "12px 16px",
    background: "rgba(255, 140, 66, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  contactIcon: {
    fontSize: "20px",
  },
  contactLabel: {
    fontWeight: "600",
    color: "#ff8c42",
    minWidth: "80px",
  },
  contactValue: {
    color: "#f5e6d3",
    textDecoration: "none",
    transition: "color 0.3s ease",
    wordWrap: "break-word",
    overflow: "hidden",
    flex: "1",
    minWidth: "0",
  },
  futureList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "16px",
  },
  futureItem: {
    padding: "12px 16px",
    background: "rgba(255, 201, 71, 0.1)",
    border: "1px solid rgba(255, 201, 71, 0.3)",
    borderRadius: "10px",
    fontSize: "15px",
    borderLeft: "4px solid #ffc947",
  },
};
