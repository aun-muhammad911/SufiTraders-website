import { m, useInView, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.19, 1, 0.22, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const MotionTag = m[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Word-by-word text reveal for editorial headlines. */
export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <span ref={ref} className={cn("inline", className)}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <m.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1, delay: delay + i * 0.045, ease: EASE }}
          >
            {word}
            {"\u00A0"}
          </m.span>
        </span>
      ))}
    </span>
  );
}

/** Image that scales down into place on reveal, with optional parallax. */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  srcSet,
  sizes,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  srcSet?: string;
  sizes?: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <m.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
        initial={{ scale: 1.18, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </div>
  );
}

export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold"
    />
  );
}

/** Soft highlight that follows the pointer inside its parent section. */
export function MouseHighlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const onLeave = () => setPos({ x: -400, y: -400 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-500"
      style={{
        background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%)`,
      }}
    />
  );
}

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] grid place-items-center grain-navy"
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0, visibility: "hidden" } : {}}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="text-center">
        <div className="font-display text-2xl tracking-[0.35em] text-on-dark">SUFI</div>
        <m.div
          className="mx-auto mt-4 h-px bg-gold"
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 1, ease: EASE }}
        />
      </div>
    </m.div>
  );
}
