"use client";

import React from 'react';
import styles from './TrainersSection.module.css';

interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
}

const trainers: Trainer[] = [
  { id: '01', name: 'MARCUS', role: 'HEAD OF PERFORMANCE', specialty: 'BIOMECHANICS & STRENGTH', image: '/trainers/trainer1.png' },
  { id: '02', name: 'ELARA', role: 'ELITE STRENGTH COACH', specialty: 'FUNCTIONAL HYPERTROPHY', image: '/trainers/trainer2.png' },
  { id: '03', name: 'KAIRO', role: 'RECOVERY SPECIALIST', specialty: 'NEUROMUSCULAR RESET', image: '/trainers/trainer3.png' },
  { id: '04', name: 'SIENNA', role: 'MOBILITY EXPERT', specialty: 'KINETIC CHAIN REPAIR', image: '/trainers/trainer1.png' },
  { id: '05', name: 'JAX', role: 'CONDITIONING LEAD', specialty: 'AEROBIC ENDURANCE', image: '/trainers/trainer2.png' }
];

export default function TrainersSection() {
  return (
    <div className={styles.trainersContainer}>
      <div className={styles.accordionContainer}>
        {trainers.map((trainer, index) => (
          <div 
            key={trainer.id} 
            className={`${styles.accordionPanel} ${index === 0 ? styles.active : ''}`}
            data-index={index}
          >
            <div 
              className={styles.panelBg}
              style={{ backgroundImage: `url(${trainer.image})` }}
            ></div>
            <div className={styles.panelOverlay}></div>
            
            <div className={styles.panelContent}>
              <div className={styles.panelTop}>
                <span className={styles.panelNumber}>0{index + 1}</span>
                <div className={styles.panelNameVertical}>{trainer.name}</div>
              </div>
              
              <div className={styles.panelBottom}>
                <h3 className={styles.panelName}>{trainer.name}</h3>
                <span className={styles.panelRole}>{trainer.role}</span>
                <span className={styles.panelSpecialty}>{trainer.specialty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Beautiful View All Button */}
      <div className={styles.viewAllWrapper}>
        <button className={styles.viewAllBtn}>
          <span className={styles.btnDot}></span>
          <span className={styles.btnText}>VIEW ALL ARCHITECTS</span>
          <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
