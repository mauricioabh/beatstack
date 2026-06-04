"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { callGeminiApi } from "@/lib/ai-client";
import { parsePromptEvaluation, type PromptEvaluation } from "@/lib/ai-config";
import { PROMPT_EVALUATOR_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { extractJsonFromAiText } from "@/lib/parse-ai-json";

type PromptEvaluateDialogProps = {
  prompt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: PromptEvaluation | null;
  loading: boolean;
};

function scoreBadgeClass(score: number): string {
  if (score >= 7) return "bg-emerald-600 text-white hover:bg-emerald-600";
  if (score >= 4) return "bg-amber-500 text-white hover:bg-amber-500";
  return "bg-red-600 text-white hover:bg-red-600";
}

export function PromptEvaluateDialog({
  prompt,
  open,
  onOpenChange,
  evaluation,
  loading,
}: PromptEvaluateDialogProps) {
  const copyImproved = async () => {
    if (!evaluation?.improved_prompt) return;
    try {
      await navigator.clipboard.writeText(evaluation.improved_prompt);
      toast.success("Improved prompt copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Prompt evaluation</DialogTitle>
          <DialogDescription className="line-clamp-2 font-mono text-xs">
            {prompt}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        {!loading && evaluation && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Score</span>
              <Badge className={scoreBadgeClass(evaluation.score)}>
                {evaluation.score}/10
              </Badge>
            </div>

            <div>
              <p className="mb-1 font-medium">Strengths</p>
              <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                {evaluation.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1 font-medium">Suggestions</p>
              <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                {evaluation.suggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium">Improved prompt</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void copyImproved()}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
              <p className="rounded-md border bg-muted/30 p-2 font-mono text-xs leading-relaxed">
                {evaluation.improved_prompt}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type EvaluatePromptButtonProps = {
  prompt: string;
  disabled?: boolean;
};

export function EvaluatePromptButton({
  prompt,
  disabled,
}: EvaluatePromptButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<PromptEvaluation | null>(null);

  const handleEvaluate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Nothing to evaluate");
      return;
    }

    setOpen(true);
    setLoading(true);
    setEvaluation(null);

    try {
      const responseText = await callGeminiApi(
        PROMPT_EVALUATOR_SYSTEM_PROMPT,
        trimmed,
      );
      setEvaluation(parsePromptEvaluation(extractJsonFromAiText(responseText)));
    } catch (err) {
      setOpen(false);
      const message =
        err instanceof Error ? err.message : "Could not evaluate prompt";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || loading}
        onClick={() => void handleEvaluate()}
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Sparkles className="size-3.5" />
        )}
        Evaluate prompt ✨
      </Button>
      <PromptEvaluateDialog
        prompt={prompt}
        open={open}
        onOpenChange={setOpen}
        evaluation={evaluation}
        loading={loading}
      />
    </>
  );
}
