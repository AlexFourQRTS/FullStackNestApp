import { ArrowRight, MessageCircle, FileText, Image, Zap } from "lucide-react";
import { Link } from "wouter";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to{" "}
            <span className={styles.heroHighlight}>Panda</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your all-in-one platform for blogging, chatting, sharing media, and staying updated with the latest technology news.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/chat">
              <button className={styles.primaryButton}>
                <MessageCircle className="h-5 w-5" />
                Start Chatting
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/blog">
              <button className={styles.secondaryButton}>
                <FileText className="h-5 w-5" />
                Read Blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresTitle}>Everything You Need</div>
          <p className={styles.featuresSubtitle}>
            Discover all the powerful features that make Panda your go-to platform for content and communication.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FileText className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Blog</h3>
              <p className={styles.featureDescription}>
                Share your thoughts and read engaging articles with beautiful code syntax highlighting.
              </p>
              <Link href="/blog">
                <button className={styles.featureButton}>
                  Explore <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Chat</h3>
              <p className={styles.featureDescription}>
                Join real-time conversations with anonymous usernames and instant messaging.
              </p>
              <Link href="/chat">
                <button className={styles.featureButton}>
                  Join Chat <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Media</h3>
              <p className={styles.featureDescription}>
                Upload and share photos, videos, audio files, and documents with ease.
              </p>
              <Link href="/media">
                <button className={styles.featureButton}>
                  View Gallery <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Zap className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Tech News</h3>
              <p className={styles.featureDescription}>
                Stay updated with the latest technology trends and innovations.
              </p>
              <Link href="/technologies">
                <button className={styles.featureButton}>
                  Discover <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Available</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>File Storage</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>Live</span>
              <span className={styles.statLabel}>Chat</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>Free</span>
              <span className={styles.statLabel}>Forever</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
