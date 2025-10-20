import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/admin/login");
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Planora</h1>
          <p className={styles.heroSubtitle}>Your Event Planning Solution</p>
          <div className={styles.heroDescription}>
            <p>An Event Management System with Task Coordination</p>
            <p>Plan events, assign responsibilities, and keep your committee organized - all in one platform.</p>
          </div>
          <button 
            onClick={handleGetStarted} 
            className={styles.getStartedButton}
          >
            Login  <ArrowRight className={styles.arrowIcon} />
          </button>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.eventsGrid}>
            <div className={styles.eventCard}>
              <h3>Easy Planning</h3>
              <p>Create and manage events with intuitive tools</p>
              <button onClick={handleGetStarted} className={styles.cardButton}>
                Learn More
              </button>
            </div>

            <div className={styles.eventCard}>
              <h3>Task Management</h3>
              <p>Assign and track responsibilities effectively</p>
              <button onClick={handleGetStarted} className={styles.cardButton}>
                Get Started
              </button>
            </div>

            <div className={styles.eventCard}>
              <h3>Team Collaboration</h3>
              <p>Work together seamlessly with your committee</p>
              <button onClick={handleGetStarted} className={styles.cardButton}>
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Empowering seamless event management experiences</p>
      </footer>
    </div>
  );
}
