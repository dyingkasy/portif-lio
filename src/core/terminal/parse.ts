export interface ParsedCommand {
  name: string;
  args: string[];
}

export function parseCommand(input: string): ParsedCommand {
  const tokens = tokenize(input.trim());

  if (tokens.length === 0) {
    return { name: "", args: [] };
  }

  return {
    name: tokens[0].toLowerCase(),
    args: tokens.slice(1)
  };
}

function tokenize(value: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: `"` | `'` | null = null;

  for (const char of value) {
    if ((char === `"` || char === `'`) && (!quote || quote === char)) {
      quote = quote ? null : (char as `"` | `'`);
      continue;
    }

    if (!quote && /\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}
