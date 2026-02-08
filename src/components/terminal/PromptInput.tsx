import { useEffect, useState } from "react";
import type { Lang } from "../../types";

interface PromptInputProps {
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onAutocomplete: (value: string) => string;
  onSubmit: (value: string) => Promise<void>;
  history: string[];
  lang: Lang;
  disabled: boolean;
}

export default function PromptInput({
  inputValue,
  onInputValueChange,
  onAutocomplete,
  onSubmit,
  history,
  lang,
  disabled
}: PromptInputProps) {
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    setHistoryIndex(-1);
  }, [history.length]);

  return (
    <form
      className="terminal-prompt"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(inputValue);
      }}
    >
      <label htmlFor="terminal-input" className="prompt-label">
        visitor@portfolio:~$ 
      </label>
      <input
        id="terminal-input"
        autoFocus
        disabled={disabled}
        value={inputValue}
        onChange={(event) => onInputValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            const next = onAutocomplete(inputValue);
            onInputValueChange(next);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();

            if (history.length === 0) {
              return;
            }

            const nextIndex =
              historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(nextIndex);
            onInputValueChange(history[nextIndex]);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();

            if (history.length === 0) {
              return;
            }

            if (historyIndex === -1) {
              return;
            }

            const nextIndex = historyIndex + 1;

            if (nextIndex >= history.length) {
              setHistoryIndex(-1);
              onInputValueChange("");
              return;
            }

            setHistoryIndex(nextIndex);
            onInputValueChange(history[nextIndex]);
          }
        }}
        placeholder={lang === "pt" ? "digite um comando" : "type a command"}
        autoComplete="off"
        spellCheck={false}
      />
    </form>
  );
}
