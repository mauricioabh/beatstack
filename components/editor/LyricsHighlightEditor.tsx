"use client";

import {
  useMemo,
  useRef,
  type ChangeEvent,
  type UIEvent,
} from "react";
import {
  LYRICS_TAG_REGEX,
  SUNO_LYRICS_CHAR_LIMIT,
} from "@/lib/lyrics-constants";
import { cn } from "@/lib/utils";

type LyricsHighlightEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

function highlightLyrics(text: string): React.ReactNode[] {
  if (!text) return ["\u00a0"];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = new RegExp(LYRICS_TAG_REGEX.source, "g");
  let match: RegExpExecArray | null = regex.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`${match.index}-${match[0]}`} className="text-[0.9em] text-[#A78BFA]">
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : ["\u00a0"];
}

export function LyricsHighlightEditor({
  value,
  onChange,
  disabled = false,
  className,
}: LyricsHighlightEditorProps) {
  const highlightRef = useRef<HTMLDivElement>(null);

  const highlighted = useMemo(() => highlightLyrics(value), [value]);

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    const highlight = highlightRef.current;
    if (!highlight) return;
    highlight.scrollTop = event.currentTarget.scrollTop;
    highlight.scrollLeft = event.currentTarget.scrollLeft;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const atLimit = value.length > SUNO_LYRICS_CHAR_LIMIT;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={highlightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-auto rounded-md border border-border bg-zinc-950 p-3 pb-8 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground"
      >
        {highlighted}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        onScroll={syncScroll}
        disabled={disabled}
        spellCheck={false}
        className="relative min-h-[300px] w-full resize-y rounded-md border border-border bg-transparent p-3 pb-8 font-mono text-sm leading-relaxed text-transparent caret-foreground selection:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div
        className={cn(
          "pointer-events-none absolute right-3 bottom-2 text-xs",
          atLimit ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {value.length.toLocaleString()} / {SUNO_LYRICS_CHAR_LIMIT.toLocaleString()}
      </div>
    </div>
  );
}
