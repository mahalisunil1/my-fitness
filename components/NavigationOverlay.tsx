import React, { useEffect } from 'react';
import styles from './NavigationOverlay.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationOverlay({ isOpen, onClose }: Props) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlayContainer}>
      <button className={styles.closeBtn} onClick={onClose}>
        <span className={styles.closeLine}></span>
        <span className={styles.closeLine}></span>
      </button>

      <div className={styles.panelLeft}>
        <div className={styles.navContent}>
          <div className={styles.navLabel}>Navigate</div>
          <nav className={styles.navLinks}>
            <a href="#"><span>01</span> HOME</a>
            <a href="#"><span>02</span> TRAINING</a>
            <a href="#"><span>03</span> FACILITIES</a>
            <a href="#"><span>04</span> COACHES</a>
            <a href="#"><span>05</span> CONTACT</a>
          </nav>
        </div>
      </div>
      
      <div className={styles.panelRight}>
        <div className={styles.extraContent}>
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>LOCATION</h3>
            <p className={styles.infoText}>
              MG WINNER FITNESS<br/>
              Plot No. 246, Lewis Rd, BJB Nagar<br/>
              Bhubaneswar, Odisha 751014, India
            </p>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>MEMBERSHIP</h3>
            <p className={styles.infoText}>join@mgwinner.com<br/>+1 (555) 000-8888</p>
          </div>
          <button className={styles.joinBtn}>JOIN THE ELITE</button>
        </div>
      </div>
    </div>
  );
}
