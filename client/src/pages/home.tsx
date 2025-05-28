import { ArrowRight, MessageCircle, FileText, Image, Zap, Users, ListTodo, Shield } from "lucide-react";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to{" "}
            <span className={styles.heroHighlight}>RoleFlow</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your role-based task management platform with secure authentication, role elevation requests, and collaborative team workflows.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>
              <Shield className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className={styles.secondaryButton}>
              <Users className="h-5 w-5" />
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresTitle}>Everything You Need</div>
          <p className={styles.featuresSubtitle}>
            Discover all the powerful features that make RoleFlow your go-to platform for role-based task management and team collaboration.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ListTodo className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Task Management</h3>
              <p className={styles.featureDescription}>
                Create, assign, and track tasks with priority levels and status updates. Perfect for personal and team productivity.
              </p>
              <button className={styles.featureButton}>
                Coming Soon <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Shield className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Role-Based Access</h3>
              <p className={styles.featureDescription}>
                Secure role management with USER, MANAGER, and ADMIN levels. Each role has specific permissions and capabilities.
              </p>
              <button className={styles.featureButton}>
                Coming Soon <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Team Collaboration</h3>
              <p className={styles.featureDescription}>
                Managers can oversee team tasks, assign work to team members, and track progress across projects.
              </p>
              <button className={styles.featureButton}>
                Coming Soon <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Zap className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Request System</h3>
              <p className={styles.featureDescription}>
                Users can request role elevation with justification. Admins review and approve requests with full audit trail.
              </p>
              <button className={styles.featureButton}>
                Coming Soon <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>User Roles</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Tasks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>Real-time</span>
              <span className={styles.statLabel}>Updates</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>Secure</span>
              <span className={styles.statLabel}>Access Control</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}