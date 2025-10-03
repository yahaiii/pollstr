"use client";
import React, { useState } from "react";
import { PollList } from "@/components/PollList";
import type { Poll } from "@/types";

interface DashboardTabsProps {
  myPolls: Poll[];
  votedPolls: Poll[];
}

export function DashboardTabs({ myPolls, votedPolls }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"created" | "voted">("created");
  const tabs = [
    { key: "created", label: "My Polls" },
    { key: "voted", label: "Voted Polls" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 mb-6 w-full justify-center">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors w-full sm:w-auto ${activeTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab(tab.key as "created" | "voted")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl">
        {activeTab === "created" ? (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-center">Polls I Created</h2>
            {myPolls.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">You haven&apos;t created any polls yet.</div>
            ) : (
              <PollList polls={myPolls} />
            )}
          </section>
        ) : (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-center">Polls I Voted On</h2>
            {votedPolls.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">You haven&apos;t voted on any polls yet.</div>
            ) : (
              <PollList polls={votedPolls} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
