"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import NavigationOverlay from './NavigationOverlay';
import TrainersSection from './TrainersSection';
import trainerStyles from './TrainersSection.module.css';

export default function Hero() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trainersRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const services = [
    { id: '01', title: 'PERSONAL TRAINING', desc: 'ONE-ON-ONE ELITE COACHING', img: '/service_pt_1778594443249.png' },
    { id: '02', title: 'NUTRITION PLANS', desc: 'DATA-DRIVEN DIETARY STRATEGIES', img: '/service_nutrition_1778594458380.png' },
    { id: '03', title: 'RECOVERY SUITE', desc: 'ADVANCED POST-WORKOUT THERAPY', img: '/service_recovery_1778594482360.png' },
    { id: '04', title: 'GROUP CLASSES', desc: 'HIGH-INTENSITY COLLECTIVE ENERGY', img: '/service_group_1778594504863.png' },
    { id: '05', title: 'MENTAL FORTITUDE', desc: 'MINDSET SHIFT & FOCUS', img: '/service_mindset_1778594521235.png' }
  ];

  useEffect(() => {
    if (isInitialized.current) return;

    const gsapScript = document.createElement('script');
    gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    gsapScript.async = true;
    document.body.appendChild(gsapScript);

    const obScript = document.createElement('script');
    obScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Observer.min.js";
    obScript.async = true;
    document.body.appendChild(obScript);

    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const onScriptsLoaded = () => {
      if (isInitialized.current) return;
      const gsap = (window as any).gsap;
      const Observer = (window as any).Observer;
      if (!gsap || !Observer) return;

      gsap.registerPlugin(Observer);
      isInitialized.current = true;

      gsap.set([fgRef.current, bgRef.current], { filter: "grayscale(0) contrast(1)" });

      const reveal = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.5 } });
      reveal
        .from(fgRef.current, { opacity: 0, y: 50, duration: 1.5 })
        .from(".char-reveal", { yPercent: 110, stagger: 0.05, duration: 1.2 }, "-=1.2")
        .from(".cta-char-reveal", { yPercent: 110, stagger: 0.02, duration: 0.8 }, "-=0.8")
        .from(".stagger-ui", { opacity: 0, y: 15, stagger: 0.1, duration: 1 }, "-=1");

      // TIMELINE 1: Hero → Services Section reveal (snaps once)
      const sectionTimeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
      sectionTimeline
        .to(".char-reveal, .cta-char-reveal", { yPercent: 110, stagger: 0.02, duration: 0.75 })
        .to(`.${styles.motivationalText}, .${styles.bottomRight}, .${styles.ctaBtn}`, { opacity: 0, y: 20, duration: 0.45 }, "-=0.6")
        .to(fgRef.current, { scale: 0.95, filter: "grayscale(0.5) contrast(1.1)", duration: 1.1 }, "-=0.4")
        .to(bgRef.current, { filter: "grayscale(0.4) contrast(1.05)", opacity: 0.8, duration: 1.1 }, "-=1.1")
        .to(`.${styles.servicesSheet}`, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.75")
        .to("#section-badge-cutout", { y: 0, x: "-50%", opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.75");

      // TIMELINE 2: Services → Trainers reveal
      const trainersTimeline = gsap.timeline({ paused: true });
      trainersTimeline
        .to(`.${styles.servicesSheet}`, { opacity: 0, y: 50, duration: 0.8, ease: "power2.in" })
        .set(`.${trainerStyles.trainersContainer}`, { visibility: 'visible', pointerEvents: 'auto' })
        // Dynamic smooth transition of badge cutout to stark dark mode
        .to("#section-badge-cutout", { 
          backgroundColor: "rgba(18, 18, 18, 0.8)", 
          borderColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          duration: 0.5,
          ease: "sine.inOut"
        }, 0)
        // Cross-fade text content
        .to("#section-badge-text", { opacity: 0, y: -8, duration: 0.2 })
        .call(function(this: any) {
          const textEl = document.getElementById("section-badge-text");
          if (textEl) {
            textEl.textContent = trainersTimeline.reversed() ? "OUR SERVICES" : "THE ARCHITECTS";
          }
        })
        .to("#section-badge-text", { opacity: 1, y: 0, color: "#ffffff", duration: 0.2 })
        .to(`.${trainerStyles.trainersContainer}`, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.5")
        .from(`.${trainerStyles.accordionPanel}`, { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .from(`.${trainerStyles.viewAllWrapper}`, { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" }, "-=0.4");

      let inServices = false;    
      let inTrainers = false;
      let isSnapping = false;    
      let railPos = 0;
      let trainerActiveIndex = 0;
      let activeIndex = 0;
      let lastSnapTime = 0; // Strict timestamp-based momentum throttle

      Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        preventDefault: true,
        tolerance: 5,
        onChange: (self: any) => {
          const now = Date.now();
          // Synchronous high-momentum decay safeguard
          if (now - lastSnapTime < 850) return;
          if (isSnapping) return;
          
          // GSAP Observer deltaY is positive for wheel-down, but negative for drag-up.
          // To ensure swipe-up (finger going up) scrolls down on mobile, we invert the delta for touch/pointer events.
          const isDrag = self.event && (self.event.type.includes('touch') || self.event.type.includes('pointer'));
          const normalizedDeltaY = isDrag ? -self.deltaY : self.deltaY;
          
          // Effortless threshold calibration: 10px on mobile for butter-smooth snap, 25px for desktop wheel
          const threshold = isDrag ? 10 : 25;
          if (Math.abs(normalizedDeltaY) < threshold) return;
          
          const dir = normalizedDeltaY > 0 ? 1 : -1;

          if (!inServices) {
            // ── HERO STATE ──
            if (dir > 0) {
              isSnapping = true;
              lastSnapTime = Date.now();
              sectionTimeline.play().eventCallback('onComplete', () => {
                inServices = true;
                // Initial highlight (no horizontal shift on mobile)
                const shiftX = window.innerWidth > 768 ? 20 : 0;
                gsap.to(`.hub-item-0`, { opacity: 1, x: shiftX, duration: 0.4 });
                gsap.to(`.hub-preview-0`, { opacity: 1, scale: 1, duration: 0.8 });
                
                // Debounce lock release so lingering swipe momentum is swallowed
                setTimeout(() => {
                  isSnapping = false;
                }, 400);
              });
            }
          } else if (inTrainers) {
            // ── TRAINERS STATE (SNAPPING STEP-BY-STEP) ──
            const allPanels = document.querySelectorAll(`.${trainerStyles.accordionPanel}`);
            const panels = Array.from(allPanels).filter(el => window.getComputedStyle(el).display !== 'none');
            const total = panels.length;

            if (dir > 0) {
              // Swipe up / scroll down
              if (trainerActiveIndex < total - 1) {
                isSnapping = true;
                lastSnapTime = Date.now();
                trainerActiveIndex++;
                
                panels.forEach((panel, i) => {
                  if (i === trainerActiveIndex) {
                    panel.classList.add(trainerStyles.active);
                  } else {
                    panel.classList.remove(trainerStyles.active);
                  }
                });
                
                setTimeout(() => {
                  isSnapping = false;
                }, 500);
              }
            } else {
              // Swipe down / scroll up
              if (trainerActiveIndex > 0) {
                isSnapping = true;
                lastSnapTime = Date.now();
                trainerActiveIndex--;
                
                panels.forEach((panel, i) => {
                  if (i === trainerActiveIndex) {
                    panel.classList.add(trainerStyles.active);
                  } else {
                    panel.classList.remove(trainerStyles.active);
                  }
                });
                
                setTimeout(() => {
                  isSnapping = false;
                }, 500);
              } else {
                // At the first trainer, transition back to Services
                isSnapping = true;
                lastSnapTime = Date.now();
                trainersTimeline.reverse().eventCallback('onReverseComplete', () => {
                  inTrainers = false;
                  trainerActiveIndex = 0;
                  activeIndex = services.length - 1;
                  railPos = 1;
                  
                  setTimeout(() => {
                    isSnapping = false;
                  }, 400);
                });
              }
            }
          } else {
            // ── SERVICES STATE (SNAPPING STEP-BY-STEP) ──
            if (dir > 0) {
              // Swipe up / scroll down
              if (activeIndex < services.length - 1) {
                isSnapping = true;
                lastSnapTime = Date.now();
                const nextIndex = activeIndex + 1;
                
                // Cross-fade indicators and previews
                const shiftX = window.innerWidth > 768 ? 20 : 0;
                gsap.to(`.${styles.hubItem}`, { opacity: 0.15, x: 0, duration: 0.4 });
                gsap.to(`.hub-item-${nextIndex}`, { opacity: 1, x: shiftX, duration: 0.4 });
                
                gsap.to(`.hub-preview-${activeIndex}`, { opacity: 0, scale: 0.95, duration: 0.6 });
                gsap.to(`.hub-preview-${nextIndex}`, { opacity: 1, scale: 1, duration: 0.6 });
                
                activeIndex = nextIndex;
                railPos = activeIndex / (services.length - 1);
                
                // Lock scroll to allow animation to complete
                setTimeout(() => {
                  isSnapping = false;
                }, 600);
              } else {
                // At the last service, transition to trainers
                isSnapping = true;
                lastSnapTime = Date.now();
                trainersTimeline.play().eventCallback('onComplete', () => {
                  inTrainers = true;
                  railPos = 1;
                  trainerActiveIndex = 0;
                  
                  // Make sure the first panel is active, and others are inactive
                  const allPanels = document.querySelectorAll(`.${trainerStyles.accordionPanel}`);
                  const panels = Array.from(allPanels).filter(el => window.getComputedStyle(el).display !== 'none');
                  panels.forEach((panel, i) => {
                    if (i === 0) {
                      panel.classList.add(trainerStyles.active);
                    } else {
                      panel.classList.remove(trainerStyles.active);
                    }
                  });
                  
                  // Debounce lock release so lingering swipe momentum is swallowed
                  setTimeout(() => {
                    isSnapping = false;
                  }, 400);
                });
              }
            } else {
              // Swipe down / scroll up
              if (activeIndex > 0) {
                isSnapping = true;
                lastSnapTime = Date.now();
                const prevIndex = activeIndex - 1;
                
                // Cross-fade indicators and previews
                const shiftX = window.innerWidth > 768 ? 20 : 0;
                gsap.to(`.${styles.hubItem}`, { opacity: 0.15, x: 0, duration: 0.4 });
                gsap.to(`.hub-item-${prevIndex}`, { opacity: 1, x: shiftX, duration: 0.4 });
                
                gsap.to(`.hub-preview-${activeIndex}`, { opacity: 0, scale: 0.95, duration: 0.6 });
                gsap.to(`.hub-preview-${prevIndex}`, { opacity: 1, scale: 1, duration: 0.6 });
                
                activeIndex = prevIndex;
                railPos = activeIndex / (services.length - 1);
                
                // Lock scroll to allow animation to complete
                setTimeout(() => {
                  isSnapping = false;
                }, 600);
              } else {
                // At the first service, transition back to Hero
                isSnapping = true;
                lastSnapTime = Date.now();
                sectionTimeline.reverse().eventCallback('onReverseComplete', () => {
                  inServices = false;
                  railPos = 0;
                  activeIndex = 0;
                  
                  // Debounce lock release so lingering swipe momentum is swallowed
                  setTimeout(() => {
                    isSnapping = false;
                  }, 400);
                });
              }
            }
          }
        }
      });

      // ── Parallax driver ──
      const applyParallax = (x: number, y: number) => {
        gsap.to(bgRef.current,   { x: x * -20, y: y * -20, duration: 1.2, ease: "power2.out" });
        gsap.to(textRef.current, { x: x * -8,  y: y * -8,  duration: 1,   ease: "power2.out" });
        gsap.to(fgRef.current,   { x: x * 30,  y: y * 30,  duration: 1.5, ease: "power2.out" });
      };

      const isMobile = window.matchMedia("(pointer: coarse)").matches;

      if (!isMobile) {
        const handleMouseMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = (e.clientY / window.innerHeight) * 2 - 1;
          applyParallax(x, y);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      } else {
        const handleOrientation = (e: DeviceOrientationEvent) => {
          const x = gsap.utils.clamp(-1, 1, (e.gamma ?? 0) / 20);
          const y = gsap.utils.clamp(-1, 1, ((e.beta ?? 45) - 45) / 20);
          applyParallax(x, y);
        };
        const attachGyro = () => window.addEventListener('deviceorientation', handleOrientation);
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const onFirstTouch = () => {
            (DeviceOrientationEvent as any).requestPermission().then((s: string) => { if (s === 'granted') attachGyro(); });
            window.removeEventListener('touchstart', onFirstTouch);
          };
          window.addEventListener('touchstart', onFirstTouch, { once: true });
        } else {
          attachGyro();
        }
      }
    };

    gsapScript.onload = () => { if ((window as any).Observer) onScriptsLoaded(); };
    obScript.onload = () => { if ((window as any).gsap) onScriptsLoaded(); };
    return () => { };
  }, []);

  return (
    <div className={styles.heroContainer}>
      
      <div className={styles.layerBg} ref={bgRef}>
        <Image src="/hero-parallax/bg_light.png" alt="Gym" fill style={{ objectFit: 'cover' }} priority />
      </div>

      <div className={styles.layerText} ref={textRef}>
        <div className={styles.giantTextWrapper}>
          <div className={styles.lineGroup}>
            {"MY".split("").map((char, index) => (
              <span key={`my-${index}`} className={styles.charContainer}>
                <span className="char-reveal" style={{ display: 'inline-block' }}>{char}</span>
              </span>
            ))}
          </div>
          <div className={styles.lineGroup}>
            {"FITNESS.".split("").map((char, index) => (
              <span key={`fitness-${index}`} className={styles.charContainer}>
                <span className="char-reveal" style={{ display: 'inline-block', color: char === "." ? "#facc15" : "inherit" }}>
                  {char}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.layerFg} ref={fgRef}>
        <Image src="/hero-parallax/fg_light.png" alt="Model" fill style={{ objectFit: 'contain', objectPosition: 'bottom center' }} priority />
      </div>

      <div className={styles.uiOverlay}>
        <div className={`${styles.topLeft} stagger-ui`}>
          <div className={styles.rotatingBadge}>
            <svg viewBox="0 0 100 100" width="120" height="120">
              <defs><path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/></defs>
              <text fontSize="12" fill="#000" letterSpacing="2" fontWeight="600"><textPath href="#circle">MY FITNESS • EXCEPTIONAL TRAINING •</textPath></text>
            </svg>
            <div className={styles.badgeCenterDot}></div>
          </div>
        </div>

        <div className={`${styles.topRight} stagger-ui`}>
          <button className={styles.menuBtn} onClick={() => setIsNavOpen(true)}>
            <span className={styles.menuLine}></span><span className={styles.menuLine}></span>
          </button>
        </div>

        <div className={`${styles.bottomLeft} stagger-ui`}>
          <div className={styles.motivationalText}>
            STRONG BODY.<br/>STRONG MIND.<br/><br/>
            <span style={{ fontWeight: 400, opacity: 0.6 }}>BECOME YOUR<br/>BEST VERSION.</span>
          </div>
          <button className={styles.ctaBtn}>
            <span className={styles.ctaTextWrapper}>
              {"JOIN THE ELITE".split("").map((char, index) => (
                <span key={index} className={styles.ctaCharContainer}>
                  <span className="cta-char-reveal" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                    {char}
                  </span>
                </span>
              ))}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        <div className={`${styles.bottomRight} stagger-ui`}>
          <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
        </div>
      </div>

      <div className={styles.servicesSheet}>
        <div className={styles.editorialHub}>
          <div className={styles.hubLeft}>
            <div className={styles.hubList}>
              {services.map((service, i) => (
                <div key={service.id} className={`${styles.hubItem} hub-item-${i}`}>
                  <span className={styles.hubIndex}>0{service.id}</span>
                  <h4 className={styles.hubTitle}>{service.title}</h4>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.hubRight}>
            {services.map((service, i) => (
              <div key={`preview-${service.id}`} className={`${styles.hubPreview} hub-preview-${i}`}>
                <div className={styles.previewVisual}>
                  <Image src={service.img} alt={service.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.previewContent}>
                  <h5 className={styles.previewTitle}>{service.title}</h5>
                  <p className={styles.previewDesc}>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Top-Center Badge Cutout */}
      <div className={styles.badgeCutout} id="section-badge-cutout">
        <span className={styles.badgeDot}></span>
        <span className={styles.badgeText} id="section-badge-text">OUR SERVICES</span>
      </div>

      <TrainersSection />
      <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  );
}
