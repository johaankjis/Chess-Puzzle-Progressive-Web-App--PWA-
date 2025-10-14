"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react"

interface MoveFeedbackProps {
  type: "correct" | "incorrect" | "excellent" | "good"
  message: string
  details?: string
}

export function MoveFeedback({ type, message, details }: MoveFeedbackProps) {
  const config = {
    correct: {
      icon: CheckCircle2,
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
      textColor: "text-success",
      iconColor: "text-success",
    },
    incorrect: {
      icon: XCircle,
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      textColor: "text-destructive",
      iconColor: "text-destructive",
    },
    excellent: {
      icon: TrendingUp,
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      textColor: "text-primary",
      iconColor: "text-primary",
    },
    good: {
      icon: AlertCircle,
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
      textColor: "text-accent",
      iconColor: "text-accent",
    },
  }

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type]

  return (
    <Card className={`p-4 ${bgColor} border ${borderColor} animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`font-semibold ${textColor} mb-1`}>{message}</p>
          {details && <p className={`text-sm ${textColor}/80`}>{details}</p>}
        </div>
      </div>
    </Card>
  )
}
