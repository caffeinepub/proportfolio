import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  bio: string;
}

export function AboutSection({ bio }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  // Split bio into pull-quote (first sentence) and rest
  const firstDot = bio.indexOf(". ");
  const pullQuote =
    firstDot > 0
      ? bio.slice(0, firstDot + 1)
      : bio.slice(0, Math.min(bio.length, 120));
  const rest = firstDot > 0 ? bio.slice(firstDot + 2) : "";

  return (
    <section id="about" className="apple-light">
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32"
        ref={ref}
      >
        {/* Label */}
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground/30 mb-4 block">
          About
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-start"
        >
          {/* Pull quote */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="font-display text-2xl md:text-3xl font-light leading-snug text-foreground"
          >
            {pullQuote}
          </motion.p>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {rest ? (
              <p
                className="text-base leading-relaxed"
                style={{ color: "oklch(0.47 0 0)" }}
              >
                {rest}
              </p>
            ) : (
              <p
                className="text-base leading-relaxed"
                style={{ color: "oklch(0.47 0 0)" }}
              >
                {bio}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
