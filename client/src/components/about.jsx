import React from "react";

function About() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>🌟 About – Chef Now</h1>
        </div>

        {/* What Is the Purpose */}
        <section style={styles.section}>
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
        <section style={styles.section}>
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
        <section style={styles.section}>
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
        <section style={styles.section}>
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
        <section style={styles.section}>
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
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📞 Contact</h2>
          <p style={styles.text}>You can reach me here:</p>
          <div style={styles.contactGrid}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📧</span>
              <span style={styles.contactLabel}>Email:</span>
              <span style={styles.contactValue}>netanel@example.com</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📸</span>
              <span style={styles.contactLabel}>Instagram:</span>
              <span style={styles.contactValue}>@chef_now</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>💼</span>
              <span style={styles.contactLabel}>LinkedIn:</span>
              <span style={styles.contactValue}>Coming soon</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🎥</span>
              <span style={styles.contactLabel}>YouTube:</span>
              <span style={styles.contactValue}>Cooking channel coming soon</span>
            </div>
          </div>
        </section>

        {/* Future */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🚀 In The Future</h2>
          <div style={styles.futureList}>
            <div style={styles.futureItem}>🔍 Search by ingredients</div>
            <div style={styles.futureItem}>📊 Calories & nutrition info</div>
            <div style={styles.futureItem}>🤖 AI recipe generator</div>
            <div style={styles.futureItem}>👤 User accounts & saved recipes</div>
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
