"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FolderPlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store";
import {
  addItemToWorkspace,
  createWorkspace,
  defaultItemNameFromPrompt,
  loadWorkspaces,
  type Workspace,
} from "@/lib/workspaces";

export function SaveToWorkspace() {
  const searchParams = useSearchParams();
  const targetWorkspaceId = searchParams.get("workspace");

  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const computedPrompt = useEditorStore((s) => s.computedPrompt);
  const generatedLyrics = useEditorStore((s) => s.generatedLyrics);

  const targetHintShown = useRef(false);
  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [itemName, setItemName] = useState("");
  const [newWorkspaceOpen, setNewWorkspaceOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const canSave =
    computedPrompt.trim().length > 0 && nodes.length > 0;

  const refreshWorkspaces = useCallback(() => {
    setWorkspaces(loadWorkspaces());
  }, []);

  const sortedWorkspaces = useMemo(() => {
    if (!targetWorkspaceId) return workspaces;
    const target = workspaces.find((w) => w.id === targetWorkspaceId);
    if (!target) return workspaces;
    return [
      target,
      ...workspaces.filter((w) => w.id !== targetWorkspaceId),
    ];
  }, [workspaces, targetWorkspaceId]);

  const targetWorkspace = useMemo(
    () => workspaces.find((w) => w.id === targetWorkspaceId),
    [workspaces, targetWorkspaceId],
  );

  const otherWorkspaces = useMemo(() => {
    if (!targetWorkspace) return sortedWorkspaces;
    return sortedWorkspaces.filter((w) => w.id !== targetWorkspace.id);
  }, [sortedWorkspaces, targetWorkspace]);

  useEffect(() => {
    if (!targetWorkspaceId || targetHintShown.current) return;
    const ws = loadWorkspaces().find((w) => w.id === targetWorkspaceId);
    if (!ws) return;
    targetHintShown.current = true;
    toast.message(`Save your preset to "${ws.name}" when you're ready.`, {
      id: "workspace-save-target",
    });
  }, [targetWorkspaceId]);

  useEffect(() => {
    if (!open) return;
    refreshWorkspaces();
    setItemName(defaultItemNameFromPrompt(computedPrompt));
  }, [open, computedPrompt, refreshWorkspaces]);

  useEffect(() => {
    const onUpdated = () => refreshWorkspaces();
    window.addEventListener("beatstack:workspaces-updated", onUpdated);
    return () =>
      window.removeEventListener("beatstack:workspaces-updated", onUpdated);
  }, [refreshWorkspaces]);

  const saveTo = (workspaceId: string, workspaceName: string) => {
    const name = itemName.trim() || defaultItemNameFromPrompt(computedPrompt);
    const item = addItemToWorkspace(workspaceId, {
      name,
      stylePrompt: computedPrompt,
      lyrics: generatedLyrics,
      nodeGraph: { nodes, edges },
    });
    if (!item) {
      toast.error("Could not save to workspace");
      return;
    }
    setOpen(false);
    toast.success(`Saved to ${workspaceName}`);
  };

  const handleCreateAndSave = () => {
    const trimmed = newWorkspaceName.trim();
    if (!trimmed) {
      toast.error("Enter a workspace name");
      return;
    }
    const ws = createWorkspace(trimmed);
    setNewWorkspaceOpen(false);
    setNewWorkspaceName("");
    saveTo(ws.id, ws.name);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canSave}
        onClick={() => setOpen(true)}
        title={
          canSave
            ? "Save style prompt, lyrics, and graph to a workspace"
            : "Build a prompt on the canvas first"
        }
      >
        <FolderPlus className="size-3.5" />
        Save to workspace
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save to workspace</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="save-item-name">Preset name</Label>
            <Input
              id="save-item-name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Preset name"
            />
          </div>

          {targetWorkspace && (
            <Button
              type="button"
              className="w-full"
              onClick={() => saveTo(targetWorkspace.id, targetWorkspace.name)}
            >
              Save to {targetWorkspace.name}
            </Button>
          )}

          <div className="max-h-48 space-y-1 overflow-y-auto py-1">
            {sortedWorkspaces.length === 0 ? (
              <p className="py-2 text-center text-sm text-muted-foreground">
                No workspaces yet. Create one below.
              </p>
            ) : otherWorkspaces.length === 0 && targetWorkspace ? null : (
              otherWorkspaces.map((ws) => (
                <Button
                  key={ws.id}
                  type="button"
                  variant="ghost"
                  className="h-auto w-full justify-start py-2 font-normal"
                  onClick={() => saveTo(ws.id, ws.name)}
                >
                  <span className="truncate">{ws.name}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {ws.items.length} preset{ws.items.length === 1 ? "" : "s"}
                  </span>
                </Button>
              ))
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setNewWorkspaceOpen(true)}
          >
            <Plus className="size-3.5" />
            New workspace
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={newWorkspaceOpen} onOpenChange={setNewWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-ws-name-save">Workspace name</Label>
            <Input
              id="new-ws-name-save"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="My workspace"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateAndSave();
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewWorkspaceOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateAndSave}>
              Create & save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
