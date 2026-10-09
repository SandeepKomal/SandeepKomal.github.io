import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const words = text.split(' ');
  const total = text.length;
  // Character offset where each word starts (+1 per word for the space)
  const starts = words.map((_, w) => words.slice(0, w).reduce((sum, word) => sum + word.length + 1, 0));

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, w) => (
        <span key={w}>
          {/* Keep each word intact so lines only break between words */}
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, c) => {
              const start = (starts[w] + c) / total;
              return (
                <Char key={c} char={char} progress={scrollYProgress} range={[start, start + 1 / total]} />
              );
            })}
          </span>{' '}
        </span>
      ))}
    </p>
  );
}
