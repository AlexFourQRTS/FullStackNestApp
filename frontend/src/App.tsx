import { ArrowRight, Shield, Users, ListTodo, Zap } from "lucide-react";
import "./home.css";

export default function App() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to{" "}
            <span className="hero-highlight">RoleFlow</span>
          </h1>
          <p className="hero-subtitle">
            Your role-based task management platform with secure authentication, role elevation requests, and collaborative team workflows.
          </p>
          <div className="hero-buttons">
            <button className="primary-button">
              <Shield className="icon" />
              Get Started
              <ArrowRight className="icon" />
            </button>
            <button className="secondary-button">
              <Users className="icon" />
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-title">Everything You Need</div>
          <p className="features-subtitle">
            Discover all the powerful features that make RoleFlow your go-to platform for role-based task management and team collaboration.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ListTodo className="icon-large" />
              </div>
              <h3 className="feature-title">Task Management</h3>
              <p className="feature-description">
                Create, assign, and track tasks with priority levels and status updates. Perfect for personal and team productivity.
              </p>
              <button className="feature-button">
                Coming Soon <ArrowRight className="icon-small" />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield className="icon-large" />
              </div>
              <h3 className="feature-title">Role-Based Access</h3>
              <p className="feature-description">
                Secure role management with USER, MANAGER, and ADMIN levels. Each role has specific permissions and capabilities.
              </p>
              <button className="feature-button">
                Coming Soon <ArrowRight className="icon-small" />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users className="icon-large" />
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Managers can oversee team tasks, assign work to team members, and track progress across projects.
              </p>
              <button className="feature-button">
                Coming Soon <ArrowRight className="icon-small" />
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap className="icon-large" />
              </div>
              <h3 className="feature-title">Request System</h3>
              <p className="feature-description">
                Users can request role elevation with justification. Admins review and approve requests with full audit trail.
              </p>
              <button className="feature-button">
                Coming Soon <ArrowRight className="icon-small" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">User Roles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Real-time</span>
              <span className="stat-label">Updates</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Secure</span>
              <span className="stat-label">Access Control</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}