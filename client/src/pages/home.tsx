import { ArrowRight, MessageCircle, FileText, Image, Zap, Users, ListTodo, Shield } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import styles from "./home.module.css";

export default function Home() {
  const { isAuthenticated } = useAuth();

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
            {isAuthenticated ? (
              <Link href="/dashboard">
                <button className={styles.primaryButton}>
                  <ListTodo className="h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className={styles.primaryButton}>
                  <Shield className="h-5 w-5" />
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            )}
            <Link href="/login">
              <button className={styles.secondaryButton}>
                <Users className="h-5 w-5" />
                {isAuthenticated ? "Switch Account" : "Login"}
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
              {isAuthenticated ? (
                <Link href="/tasks">
                  <button className={styles.featureButton}>
                    View Tasks <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className={styles.featureButton}>
                    Get Started <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Shield className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Role-Based Access</h3>
              <p className={styles.featureDescription}>
                Secure role management with USER, MANAGER, and ADMIN levels. Each role has specific permissions and capabilities.
              </p>
              {isAuthenticated ? (
                <Link href="/request-role">
                  <button className={styles.featureButton}>
                    Request Role <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className={styles.featureButton}>
                    Learn More <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Team Collaboration</h3>
              <p className={styles.featureDescription}>
                Managers can oversee team tasks, assign work to team members, and track progress across projects.
              </p>
              {isAuthenticated ? (
                <Link href="/team-tasks">
                  <button className={styles.featureButton}>
                    Team View <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className={styles.featureButton}>
                    Join Team <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Zap className="h-8 w-8" />
              </div>
              <h3 className={styles.featureTitle}>Request System</h3>
              <p className={styles.featureDescription}>
                Users can request role elevation with justification. Admins review and approve requests with full audit trail.
              </p>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <button className={styles.featureButton}>
                    Dashboard <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className={styles.featureButton}>
                    Discover <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
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