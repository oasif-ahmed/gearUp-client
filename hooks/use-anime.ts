"use client";
import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function useAnime(animationConfig: anime.AnimeParams) {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = anime({
        targets: elementRef.current,
        ...animationConfig,
      });
    }
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [animationConfig]);

  return elementRef;
}
