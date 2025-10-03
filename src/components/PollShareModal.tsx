"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PollShareModalProps {
  pollId: number;
}

export function PollShareModal({ pollId }: PollShareModalProps) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const pollUrl = typeof window !== "undefined"
    ? `${window.location.origin}/polls/${pollId}`
    : `/polls/${pollId}`;

  const handleDownloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `poll-${pollId}-qr.png`;
    link.click();
  };

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
            <div>
              <label className="block text-sm mb-1">QR Code</label>
              <div className="flex justify-center py-2">
                <QRCodeCanvas value={pollUrl} size={128} ref={qrRef} />
              </div>
              <p className="text-xs text-muted-foreground text-center">Scan to open poll</p>
              <div className="flex justify-center mt-2">
                <Button type="button" size="sm" variant="outline" onClick={handleDownloadQR}>
                  Download QR
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
