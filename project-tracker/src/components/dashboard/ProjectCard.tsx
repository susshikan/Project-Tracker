import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  title: string;
  content: string;
  status?: string; 
}

export function ProjectCard({ title, content, status = "ongoing" }: GlassCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "ongoing":
      default:
        return "bg-yellow-400";
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-sm p-5 rounded-2xl border border-white/20 shadow-lg",
        "bg-white/10 backdrop-blur-xl text-white transition hover:bg-white/20"
      )}
    >
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span
          className={cn("w-3 h-3 rounded-full animate-pulse", getStatusColor(status))}
        />
        <span className="text-xs font-medium capitalize opacity-80">{status}</span>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{content}</p>
      </div>
    </div>
  );
}
