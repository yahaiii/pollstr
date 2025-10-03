"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PollShareModalProps {
  pollId: number;
}

export function PollShareModal({ pollId }: PollShareModalProps) {
  const [open, setOpen] = useState(false);
  const pollUrl = typeof window !== "undefined"
    ? `${window.location.origin}/polls/${pollId}`
    : `/polls/${pollId}`;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Poll</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Poll Link</label>
              <input
                type="text"
                value={pollUrl}
                readOnly
                className="w-full px-2 py-1 border rounded bg-gray-100 text-sm"
                onClick={e => (e.target as HTMLInputElement).select()}
              />
              <Button
                type="button"
                size="sm"
                className="mt-2"
                onClick={() => navigator.clipboard.writeText(pollUrl)}
              >
                Copy Link
              </Button>
            </div>
            {/* QR code will be added in step 3 */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
