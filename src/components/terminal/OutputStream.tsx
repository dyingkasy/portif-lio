import type { TerminalLine } from "../../types";

interface OutputStreamProps {
  lines: TerminalLine[];
}

export default function OutputStream({ lines }: OutputStreamProps) {
  return (
    <div className="terminal-output" role="log" aria-live="polite" aria-relevant="additions">
      {lines.map((line) => (
        <p key={line.id} className={`line line-${line.kind}`}>
          {line.text}
        </p>
      ))}
    </div>
  );
}
