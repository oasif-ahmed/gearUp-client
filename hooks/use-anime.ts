"use client";
import { useEffect, useRef } from 'react';
import * as anime from 'animejs';

export function useAnime(targets: any, animationConfig: any) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      // animejs v4 uses animate(targets, parameters) function
      const animation = anime.animate(targets || elementRef.current, {
        ...animationConfig,
      });
      return () => {
        animation.pause();
      };
    }
  }, [animationConfig]);

  return elementRef;
}
