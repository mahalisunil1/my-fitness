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
      <div className={styles.header}>
        <h2 className={styles.title}>ARCHITECTS</h2>
      </div>

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
    </div>
  );
}
