"use client";

import { useEffect, useRef, useCallback } from 'react';
import { animate, createTimeline as createAnimeTimeline, stagger, onScroll } from 'animejs';

export { animate };

/**
 * Senior-level animation utilities using animejs v4
 * Provides reusable animation patterns for the entire application
 */

// Animation presets for consistent feel across the app
export const animationPresets = {
  // Page enter/exit
  pageEnter: {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: 'easeOutExpo',
  },
  pageExit: {
    opacity: [1, 0],
    translateY: [0, -20],
    duration: 400,
    easing: 'easeInExpo',
  },

  // Card animations
  cardEnter: {
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    duration: 700,
    easing: 'easeOutExpo',
  },
  cardHover: {
    translateY: -8,
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
    duration: 300,
    easing: 'easeOutQuad',
  },

  // Staggered list items
  staggerItem: {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 500,
    easing: 'easeOutExpo',
  },

  // Modal animations
  modalEnter: {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 400,
    easing: 'easeOutExpo',
  },
  modalExit: {
    opacity: [1, 0],
    scale: [1, 0.95],
    duration: 300,
    easing: 'easeInExpo',
  },

  // Form field focus
  fieldFocus: {
    borderColor: '#bc3a28',
    boxShadow: '0 0 0 3px rgba(188, 58, 40, 0.15)',
    duration: 200,
    easing: 'easeOutQuad',
  },

  // Button press
  buttonPress: {
    scale: [1, 0.97, 1],
    duration: 150,
    easing: 'easeOutQuad',
  },

  // Fade in/out
  fadeIn: {
    opacity: [0, 1],
    duration: 300,
    easing: 'easeOutQuad',
  },
  fadeOut: {
    opacity: [1, 0],
    duration: 200,
    easing: 'easeInQuad',
  },

  // Slide animations
  slideUp: {
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutExpo',
  },
  slideDown: {
    translateY: [-20, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutExpo',
  },
  slideLeft: {
    translateX: [30, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutExpo',
  },
  slideRight: {
    translateX: [-30, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutExpo',
  },

  // Scale animations
  scaleIn: {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutExpo',
  },
  scaleOut: {
    scale: [1, 0.95],
    opacity: [1, 0],
    duration: 300,
    easing: 'easeInExpo',
  },

  // Loading spinner
  spinner: {
    rotate: '1turn',
    duration: 1000,
    easing: 'linear',
    loop: true,
  },

  // Pulse animation
  pulse: {
    scale: [1, 1.05, 1],
    duration: 1500,
    easing: 'easeInOutQuad',
    loop: true,
  },

  // Shimmer effect
  shimmer: {
    backgroundPosition: ['-200% center', '200% center'],
    duration: 1500,
    easing: 'linear',
    loop: true,
  },
};

// Stagger configurations
export const staggerPresets = {
  fast: { start: 0, each: 30 },
  normal: { start: 0, each: 50 },
  slow: { start: 0, each: 80 },
  cascade: { start: 100, each: 60 },
  reverse: { start: 300, each: -50 },
};

// Easing functions
export const easings = {
  easeOutExpo: 'easeOutExpo',
  easeOutQuad: 'easeOutQuad',
  easeInExpo: 'easeInExpo',
  easeInOutQuad: 'easeInOutQuad',
  linear: 'linear',
  spring: 'spring(1, 80, 10, 0)',
  bounce: 'spring(1, 50, 5, 0)',
  elastic: 'spring(1, 60, 3, 0)',
};

/**
 * Create a timeline with consistent defaults
 */
export function createTimeline(options = {}) {
  const tl = createAnimeTimeline(options);
  return tl;
}

/**
 * Animate elements with stagger
 */
export function staggerElements(elements: Element[], preset: keyof typeof staggerPresets = 'normal', customAnimation = {}) {
  const staggerPreset = staggerPresets[preset];
  return animate(elements, {
    ...animationPresets.staggerItem,
    delay: stagger(staggerPreset.each, { start: staggerPreset.start }),
    ...customAnimation,
  });
}

/**
 * Animate page transition
 */
export function animatePageTransition(
  exitElements: Element[],
  enterElements: Element[],
  onComplete?: () => void
) {
  const tl = createTimeline();

  tl.add(exitElements, {
    ...animationPresets.pageExit,
  })
    .add(enterElements, {
      ...animationPresets.pageEnter,
    }, '-=200');

  if (onComplete) {
    (tl as any).finished.then(onComplete);
  }

  return tl;
}

/**
 * Animate modal open/close
 */
export function animateModal(modal: Element, isOpening: boolean) {
  return animate(modal, {
    ...(isOpening ? animationPresets.modalEnter : animationPresets.modalExit),
  });
}

/**
 * Animate card hover
 */
export function animateCardHover(card: Element, isHovering: boolean) {
  return animate(card, {
    ...(isHovering ? animationPresets.cardHover : {
      translateY: 0,
      boxShadow: 'none',
      duration: 300,
      easing: 'easeOutQuad',
    }),
  });
}

/**
 * Animate button press
 */
export function animateButtonPress(button: Element) {
  return animate(button, animationPresets.buttonPress);
}

/**
 * Animate form field focus
 */
export function animateFieldFocus(field: Element, isFocused: boolean) {
  return animate(field, {
    ...(isFocused ? animationPresets.fieldFocus : {
      borderColor: 'var(--border)',
      boxShadow: 'none',
      duration: 200,
      easing: 'easeOutQuad',
    }),
  });
}

/**
 * Animate list items with stagger
 */
export function animateList(items: Element[], preset: keyof typeof staggerPresets = 'normal') {
  return staggerElements(items, preset);
}

/**
 * Animate counter
 */
export function animateCounter(element: Element, from: number, to: number, duration = 1000) {
  return animate(
    {
      value: from
    },
    {
      value: to,
      duration,
      easing: 'easeOutExpo',
      update: (anim: any) => {
        if (element) {
          element.textContent = Math.round(anim.animations[0].currentValue).toLocaleString();
        }
      },
    });
}

/**
 * Animate progress bar
 */
export function animateProgress(progress: Element, to: number, duration = 800) {
  return animate(progress, {
    width: `${to}%`,
    duration,
    easing: 'easeOutExpo',
  });
}

/**
 * Animate height (for accordions, etc.)
 */
export function animateHeight(element: Element, height: number | 'auto', duration = 400) {
  if (height === 'auto') {
    const currentHeight = (element as HTMLElement).offsetHeight;
    (element as HTMLElement).style.height = 'auto';
    const targetHeight = (element as HTMLElement).offsetHeight;
    (element as HTMLElement).style.height = `${currentHeight}px`;
    
    return animate(element, {
      height: targetHeight,
      duration: 400,
      easing: 'easeOutExpo',
    });
  }
  
  return animate(element, {
    height,
    duration,
    easing: 'easeOutExpo',
  });
}

/**
 * Animate width
 */
export function animateWidth(element: Element, width: number | 'auto', duration = 400) {
  if (width === 'auto') {
    const currentWidth = (element as HTMLElement).offsetWidth;
    (element as HTMLElement).style.width = 'auto';
    const targetWidth = (element as HTMLElement).offsetWidth;
    (element as HTMLElement).style.width = `${currentWidth}px`;
    
    return animate(element, {
      width: targetWidth,
      duration: 400,
      easing: 'easeOutExpo',
    });
  }
  
  return animate(element, {
    width,
    duration,
    easing: 'easeOutExpo',
  });
}

/**
 * Create scroll-triggered animation
 */
export function createScrollAnimation(
  element: Element,
  animation: any,
  options = {}
) {
  return onScroll({
    target: element,
    ...options,
    onUpdate: (anim: any) => {
      const progress = anim.progress;
      animate(element, {
        ...animation,
        duration: 0,
        easing: 'linear',
      }).seek(progress);
    },
  });
}

/**
 * Animate page load with stagger
 */
export function animatePageLoad(
  sections: Element[],
  options = {}
) {
  const tl = createTimeline();

  sections.forEach((section, index) => {
    const sectionElements = section.querySelectorAll('[data-animate]');
    
    tl.add(section, {
      ...animationPresets.pageEnter,
      delay: index * 200,
    });

    if (sectionElements.length > 0) {
      tl.add(sectionElements, {
        ...animationPresets.staggerItem,
        delay: stagger(50, { start: 100 }),
      }, `-=${400}`);
    }
  });

  return tl;
}

/**
 * Animate form validation
 */
export function animateValidation(field: Element, isValid: boolean) {
  const color = isValid ? '#22c55e' : '#ef4444';
  
  return animate(field, {
    borderColor: color,
    boxShadow: `0 0 0 3px ${isValid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
    duration: 300,
    easing: 'easeOutQuad',
  });
}

/**
 * Animate toast notification
 */
export function animateToast(toast: Element, isEntering: boolean) {
  return animate(toast, {
    ...(isEntering 
      ? { ...animationPresets.slideRight, opacity: [0, 1] }
      : { ...animationPresets.slideRight, opacity: [1, 0], direction: 'reverse' }),
  });
}

/**
 * Create a magnetic hover effect
 */
export function createMagneticEffect(element: Element, strength = 0.3) {
  let animation: any = null;

  const handleMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    if (animation) animation.pause();
    
    animation = animate(element, {
      translateX: x * strength,
      translateY: y * strength,
      duration: 400,
      easing: 'easeOutExpo',
    });
  };

  const handleLeave = () => {
    if (animation) animation.pause();
    animate(element, {
      translateX: 0,
      translateY: 0,
      duration: 600,
      easing: 'easeOutElastic(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMove);
  element.addEventListener('mouseleave', handleLeave);

  return () => {
    element.removeEventListener('mousemove', handleMove);
    element.removeEventListener('mouseleave', handleLeave);
    if (animation) animation.pause();
  };
}

/**
 * Create a ripple effect
 */
export function createRipple(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.3;
    pointer-events: none;
    transform: scale(0);
  `;
  ripple.style.color = 'currentColor';

  element.appendChild(ripple);

  animate(ripple, {
    scale: [0, 2],
    opacity: [0.3, 0],
    duration: 600,
    easing: 'easeOutQuad',
    complete: () => ripple.remove(),
  });
}

/**
 * Create a floating animation
 */
export function floatElement(element: Element, distance = 10, duration = 3000) {
  return animate(element, {
    translateY: [-distance, distance],
    duration,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop: true,
  });
}

/**
 * Create a typing animation
 */
export function typeText(element: Element, text: string, speed = 50) {
  return new Promise<void>((resolve) => {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    };
    type();
  });
}

/**
 * Create a counter with easing
 */
export function countUp(element: Element, end: number, duration = 2000, decimals = 0) {
  const start = 0;
  const obj = { value: start };
  
  return animate(obj, {
    value: end,
    duration,
    easing: 'easeOutExpo',
    update: () => {
      const value = obj.value;
      if (element) {
        element.textContent = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    },
  });
}

/**
 * Create a morphing shape animation
 */
export function morphPath(element: SVGPathElement, toPath: string, duration = 800) {
  return animate(element, {
    d: toPath,
    duration,
    easing: 'easeInOutQuad',
  });
}

/**
 * Create a parallax scroll effect
 */
export function createParallax(elements: Element[], speeds: number[]) {
  const animations = elements.map((element, index) => {
    const speed = speeds[index] || 0.5;
    return onScroll({
      target: element,
      onUpdate: (anim: any) => {
        const translateY = -anim.progress * 100 * speed;
        animate(element, {
          translateY,
          duration: 0,
          easing: 'linear',
        });
      },
    });
  });

  return () => animations.forEach((a: any) => a.pause());
}

/**
 * Create a text reveal animation
 */
export function revealText(element: HTMLElement, options = {}) {
  const text = element.textContent || '';
  const words = text.split(' ');
  element.innerHTML = words.map(w => `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${w}</span>`).join(' ');
  
  const spans = element.querySelectorAll('span');
  
  return animate(spans, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: 'easeOutExpo',
    delay: stagger(50),
    ...options,
  });
}

/**
 * Create a loading skeleton animation
 */
export function skeletonAnimation(element: Element) {
  return animate(element, {
    backgroundPosition: ['-200% center', '200% center'],
    duration: 1500,
    easing: 'linear',
    loop: true,
  });
}

/**
 * Create a focus ring animation
 */
export function focusRing(element: Element) {
  return animate(element, {
    boxShadow: [
      '0 0 0 0 var(--ring)',
      '0 0 0 4px var(--ring)',
      '0 0 0 0 var(--ring)',
    ],
    duration: 1500,
    easing: 'easeOutQuad',
    loop: true,
  });
}

/**
 * Batch animate multiple elements
 */
export function batchAnimate(
  animations: Array<{ elements: Element | Element[]; animation: any }>
) {
  const tl = createTimeline();
  
  animations.forEach(({ elements, animation }) => {
    tl.add(elements, animation);
  });
  
  return tl;
}

export default {
  presets: animationPresets,
  stagger: staggerPresets,
  easings,
  createTimeline,
  staggerElements,
  animatePageTransition,
  animateModal,
  animateCardHover,
  animateButtonPress,
  animateFieldFocus,
  animateList,
  animateCounter,
  animateProgress,
  animateHeight,
  animateWidth,
  createScrollAnimation,
  animatePageLoad,
  animateValidation,
  animateToast,
  createMagneticEffect,
  createRipple,
  floatElement,
  typeText,
  countUp,
  morphPath,
  createParallax,
  revealText,
  skeletonAnimation,
  focusRing,
  batchAnimate,
  animate,
};