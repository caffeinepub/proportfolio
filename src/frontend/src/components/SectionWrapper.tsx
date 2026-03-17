import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionWrapper({ id, title, children, action }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      id={id}
      ref={ref}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
            {title}
          </h2>
          {action}
        </div>
        {children}
      </motion.div>
    </section>
  );
}
