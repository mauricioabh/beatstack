"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PromptHistoryPanel } from "@/components/library/PromptHistoryPanel";
import { WorkspaceCard } from "@/components/library/WorkspaceCard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { createWorkspace, loadWorkspaces, type Workspace } from "@/lib/workspaces";

type LibraryTab = "songs" | "workspaces" | "history";

function tabFromPathname(pathname: string): LibraryTab {
  if (pathname.startsWith("/library/history")) return "history";
  return "workspaces";
}

export function LibraryPage() {
  const pathname = usePathname();
  const [tab, setTab] = useState<LibraryTab>(() => tabFromPathname(pathname));
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const refresh = useCallback(() => {
    setWorkspaces(loadWorkspaces());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setTab(tabFromPathname(pathname));
  }, [pathname]);

  useEffect(() => {
    const onUpdated = () => refresh();
    window.addEventListener("beatstack:workspaces-updated", onUpdated);
    return () =>
      window.removeEventListener("beatstack:workspaces-updated", onUpdated);
  }, [refresh]);

  const handleTabChange = (value: string) => {
    const next = value as LibraryTab;
    setTab(next);
    if (next === "history") {
      window.history.replaceState(null, "", "/library/history");
    } else if (next === "workspaces") {
      window.history.replaceState(null, "", "/library");
    }
  };

  const handleCreateWorkspace = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Enter a workspace name");
      return;
    }
    createWorkspace(trimmed);
    setNewName("");
    setNewOpen(false);
    refresh();
    toast.success("Workspace created");
  };

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList variant="line" className="mb-6 h-auto w-fit gap-6 bg-transparent p-0">
          <TabsTrigger
            value="songs"
            className="px-0 pb-2 text-sm font-semibold data-[state=active]:text-foreground"
          >
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="workspaces"
            className="px-0 pb-2 text-sm font-semibold data-[state=active]:text-foreground"
          >
            Workspaces
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="px-0 pb-2 text-sm font-semibold data-[state=active]:text-foreground"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-0 min-h-0 flex-1">
          <p className="text-sm text-muted-foreground">
            Saved songs will appear here soon.
          </p>
        </TabsContent>

        <TabsContent
          value="workspaces"
          className="mt-0 flex min-h-0 flex-1 flex-col"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
            <Button type="button" size="sm" onClick={() => setNewOpen(true)}>
              <Plus className="size-4" />
              New Workspace
            </Button>
          </div>

          {workspaces.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No workspaces yet. Create one to save presets from Create.
            </p>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {workspaces.map((ws) => (
                <WorkspaceCard key={ws.id} workspace={ws} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0 min-h-0 flex-1">
          <PromptHistoryPanel />
        </TabsContent>
      </Tabs>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="My workspace"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateWorkspace();
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateWorkspace}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
