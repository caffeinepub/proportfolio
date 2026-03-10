import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  dark?: boolean;
  gray?: boolean;
}

export function SectionWrapper({
  id,
  title,
  children,
  action,
  dark = false,
  gray = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const bg = dark ? "apple-dark" : gray ? "apple-gray" : "apple-light";

  return (
    <section id={id} ref={ref} className={`${bg} relative`}>
      <div className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Section label — sticky pill */}
        <div className="mb-4">
          <span
            className={`text-xs font-semibold tracking-[0.18em] uppercase ${
              dark ? "text-white/40" : "text-foreground/30"
            }`}
          >
            {title}
          </span>
        </div>

        {/* Headline row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-14 scroll-mt-20"
        >
          <h2
            className={`font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none ${
              dark ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </h2>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </motion.div>

        {children}
      </div>
    </section>
  );
}
