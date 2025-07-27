<template>
  <div id="app">
    <!-- Navigation Header -->

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Make AI Learning
          <span class="gradient-text">Simple and Powerful</span>
        </h1>
        <p class="hero-subtitle">
          AIforUs is a desktop application designed for AI learners. Featuring rich datasets, visualization tools, and interactive tutorials to help you master machine learning and data science with ease.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="downloadApp">Free Download</button>
          <button class="btn-secondary">Watch Demo</button>
        </div>
        <p class="hero-note">Requires macOS 12.0 or later</p>
      </div>
      <div class="hero-visual">
        <div class="app-preview">
          <div class="app-window">
            <div class="window-header">
              <div class="window-controls">
                <span class="control red"></span>
                <span class="control yellow"></span>
                <span class="control green"></span>
              </div>
              <div class="window-title">AIforUs</div>
            </div>
            <div class="window-content">
              <div class="sidebar">
                <div class="nav-item active">📊 Analytics</div>
                <div class="nav-item">📚 Tutorials</div>
                <div class="nav-item">🛠️ Tools</div>
              </div>
              <div class="main-content">
                <div class="dataset-card">
                  <div class="card-image penguin"></div>
                  <h4>Penguin Dataset</h4>
                </div>
                <div class="dataset-card">
                  <div class="card-image titanic"></div>
                  <h4>Titanic</h4>
                </div>
                <div class="dataset-card">
                  <div class="card-image diamond"></div>
                  <h4>Diamond Data</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="container">
        <h2 class="section-title">Powerful AI Learning Tools</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Data Visualization</h3>
            <p>Intuitive charts and visualization tools to help you understand data patterns and trends</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Machine Learning Models</h3>
            <p>Built-in classic algorithms, from regression to neural networks, everything you need</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>Interactive Tutorials</h3>
            <p>Clear step-by-step tutorials, from AI basics to advanced applications</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🗂️</div>
            <h3>Rich Datasets</h3>
            <p>Curated public datasets covering various domains and difficulty levels</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Showcase -->
    <section class="showcase-section">
      <div class="container">
        <div class="showcase-content">
          <div class="showcase-text">
            <h2>AIforUs Desktop</h2>
            <p class="showcase-subtitle">Professional and User-friendly AI Learning Environment</p>
            <p class="showcase-description">
              A desktop application tailored for AI learners. No complex configuration required, ready to use out of the box.
              From data import to model training, from visualization to result analysis, enjoy a seamless end-to-end experience.
            </p>
            <div class="showcase-actions">
              <button class="btn-primary" @click="downloadApp">Download Now</button>
              <button class="btn-secondary">Learn More</button>
            </div>
          </div>
          <div class="showcase-image">
            <div class="device-mockup">
              <div class="screen-content">
                <div class="neural-network">
                  <div class="node"></div>
                  <div class="node"></div>
                  <div class="node"></div>
                  <div class="connection"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Products</h4>
            <ul>
              <li><a href="#">AIforUs Desktop</a></li>
              <li><a href="#">Datasets</a></li>
              <li><a href="#">Tutorials</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">User Guide</a></li>
              <li><a href="#">Technical Support</a></li>
              <li><a href="#">Community Forum</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 AIforUs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AIforUsHome",
  mounted() {
    // Add smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },
  methods: {
    downloadApp() {
      this.$router.push('/login') // 跳转到登录页面
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1d1d1f;
}

/* Navigation */
.nav-header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 40px;
}

.nav-menu a {
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 400;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #007AFF;
}

.btn-download {
  background: #007AFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-download:hover {
  background: #0056CC;
}

/* Hero Section */
.hero-section {
  padding: 120px 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  min-height: 80vh;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #007AFF, #5856D6, #AF52DE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 20px;
  color: #86868b;
  margin-bottom: 40px;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.btn-primary {
  background: #007AFF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #0056CC;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #007AFF;
  border: 2px solid #007AFF;
  padding: 10px 22px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #007AFF;
  color: white;
}

.hero-note {
  color: #86868b;
  font-size: 14px;
}

/* App Preview */
.app-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-window {
  width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.window-header {
  background: #f6f6f6;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e5e7;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red { background: #ff5f57; }
.control.yellow { background: #ffbd2e; }
.control.green { background: #28ca42; }

.window-title {
  font-weight: 500;
  color: #1d1d1f;
}

.window-content {
  display: flex;
  height: 300px;
}

.sidebar {
  width: 140px;
  background: #f6f6f6;
  padding: 16px;
}

.nav-item {
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 4px;
}

.nav-item.active {
  background: #007AFF;
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.dataset-card {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.card-image {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  margin: 0 auto 8px;
}

.card-image.penguin { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); }
.card-image.titanic { background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); }
.card-image.diamond { background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%); }

.dataset-card h4 {
  font-size: 12px;
  color: #1d1d1f;
}

/* Features Section */
.features-section {
  padding: 80px 20px;
  background: #f5f5f7;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 60px;
  color: #1d1d1f;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.feature-card {
  background: white;
  padding: 40px 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1d1d1f;
}

.feature-card p {
  color: #86868b;
  line-height: 1.6;
}

/* Showcase Section */
.showcase-section {
  padding: 80px 20px;
}

.showcase-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.showcase-text h2 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1d1d1f;
}

.showcase-subtitle {
  font-size: 24px;
  color: #86868b;
  margin-bottom: 24px;
}

.showcase-description {
  color: #86868b;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.showcase-actions {
  display: flex;
  gap: 16px;
}

.device-mockup {
  width: 400px;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.screen-content {
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neural-network {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: center;
}

.node {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

/* Footer */
.footer {
  background: #1d1d1f;
  color: white;
  padding: 60px 20px 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  color: #86868b;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid #424245;
  color: #86868b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .showcase-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>