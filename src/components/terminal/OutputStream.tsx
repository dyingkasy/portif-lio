import { useEffect, useRef } from "react";
import type { TerminalLine } from "../../types";

interface OutputStreamProps {
  lines: TerminalLine[];
}

export default function OutputStream({ lines }: OutputStreamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="terminal-output"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {lines.map((line) => (
        <p key={line.id} className={`line line-${line.kind}`}>
          {line.text}
        </p>
      ))}
    </div>
  );
}
