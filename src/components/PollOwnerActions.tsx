"use client";
import React from 'react';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { deletePoll, updatePoll } from "@/lib/supabase";
import type { Poll } from "@/types";

export default function PollOwnerActions({ poll }: { poll: Poll }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.id !== poll.userId) return null;

  const onSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updatePoll(poll.id, { title, description });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update poll");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this poll? This cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deletePoll(poll.id);
      router.push("/polls");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete poll");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Poll</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label htmlFor="edit-title" className="block text-sm mb-1">Title</label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm mb-1">Description</label>
              <Input id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
