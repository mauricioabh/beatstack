"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { stopNodeDrag } from "@/components/editor/nodes/BaseNode";

type TagInputProps = {
  tags: string[];
  suggestions: readonly string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ tags, suggestions, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !tags.includes(s) &&
      s.toLowerCase().includes(input.toLowerCase()) &&
      input.length > 0,
  );

  return (
    <div className="space-y-1.5">
      <div className="flex min-h-6 flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-0.5 pr-0.5 text-xs">
            {tag}
            <button
              type="button"
              className="ml-0.5 rounded-sm p-0.5 hover:bg-muted"
              onClick={() => removeTag(tag)}
              onMouseDown={stopNodeDrag}
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder="Type and press Enter"
        className="h-7 text-xs"
        onMouseDown={stopNodeDrag}
      />
      {filteredSuggestions.length > 0 && (
        <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
          {filteredSuggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
              onClick={() => addTag(s)}
              onMouseDown={stopNodeDrag}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
