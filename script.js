import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cards = document.querySelectorAll(".sticky-cards .card");
  const totalCards = cards.length;
  const segmentSize = 1 / totalCards;

  const cardYOffset = 5;
  const cardScaleStep = 0.075;

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + i * cardYOffset,
      scale: 1 - i * cardScaleStep,
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1,
      );
      const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

      cards.forEach((card, i) => {
        if (i < activeIndex) {
          gsap.set(card, {
            yPercent: -250,
            rotationX: 35,
          });
        } else if (i === activeIndex) {
          gsap.set(card, {
            yPercent: gsap.utils.interpolate(-50, -200, segProgress),
            rotationX: gsap.utils.interpolate(0, 35, segProgress),
            scale: 1,
          });
        } else {
          const behindIndex = i - activeIndex;
          const currentYOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
          });
        }
      });
    },
  });
});
