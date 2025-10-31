"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

const steps = [
  {
    title: "Project Created",
    description: "Initial setup completed and repository initialized.",
    date: "2025-09-20",
    status: "done",
  },
  {
    title: "Development Started",
    description: "Core modules and base layout implementation.",
    date: "2025-09-25",
    status: "done",
  },
  {
    title: "Code Review",
    description: "Pending review from senior developer.",
    date: "2025-10-02",
    status: "in-progress",
  },
  {
    title: "Deployment",
    description: "Scheduled for testing and production deployment.",
    date: "2025-10-10",
    status: "upcoming",
  },
]

export default function VerticalActivityStepper() {
  return (
    <Card className="w-full max-w-md mx-auto border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-6">Project Timeline</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-muted-foreground/20" />

        {/* Steps */}
        <div className="flex flex-col space-y-8">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const icon =
              step.status === "done" ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : step.status === "in-progress" ? (
                <Clock className="h-5 w-5 text-amber-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )

            return (
              <div key={index} className="relative flex items-start gap-4">
                {/* Icon marker */}
                <div className="z-10 mt-[2px] bg-background rounded-full p-[2px]">
                  {icon}
                </div>

                {/* Step content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{step.description}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {step.status.replace("-", " ")}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                  {!isLast && <Separator className="mt-4 opacity-20" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
