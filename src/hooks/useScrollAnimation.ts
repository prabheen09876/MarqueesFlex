import { useEffect, useRef } from 'react';

type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'float' | 'pulse';

interface ScrollAnimationOptions {
  type?: AnimationType;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    type = 'fadeIn',
    delay = 0,
    threshold = 0.1,
    rootMargin = '50px'
  } = options;
  
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = '0';
            element.style.animation = `${type} 0.8s ease-out forwards ${delay}s`;
            element.style.visibility = 'visible';
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      elementRef.current.style.opacity = '0';
      elementRef.current.style.visibility = 'hidden';
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [type, delay, threshold, rootMargin]);

  return elementRef;
}
