"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  UserPlus,
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Star,
  Trash2,
  Download,
  RefreshCcw,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/intl";
import {
  getShipmentTimeline,
  type ShipmentTimelineResponse,
  type TimelineAction,
  type TimelineSource,
} from "@/lib/analytics";


function isNumericId(v?: string | null): boolean {
  return !!v && /^\d+$/.test(v) && Number(v) > 0;
}

const ACTION_ICONS: Record<TimelineAction, React.ElementType> = {
  create: Plus,
  update: Pencil,
  assign: UserPlus,
  dispatch: Truck,
  pickup: Package,
  deliver: CheckCircle2,
  fail: AlertTriangle,
  cancel: Ban,
  rate: Star,
  delete: Trash2,
  export: Download,
};

function actionVariant(action: TimelineAction): "default" | "secondary" | "destructive" | "outline" {
  if (action === "deliver") return "default";
  if (action === "fail" || action === "cancel" || action === "delete") return "destructive";
  return "secondary";
}

function dotColor(action: TimelineAction): string {
  if (action === "deliver") return "bg-primary";
  if (action === "fail" || action === "cancel" || action === "delete") return "bg-destructive";
  return "bg-muted-foreground/40";
}


interface ShipmentTimelineProps {
  shipmentId?: string | null;
  isOpen: boolean;
}

export function ShipmentTimeline({ shipmentId, isOpen }: ShipmentTimelineProps) {
  const { getValidAccessToken } = useAuth();
  const t = useI18n("dashboards");

  const [timeline, setTimeline] = useState<ShipmentTimelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isNotFound: boolean } | null>(null);

  const fetchTimeline = useCallback(async () => {
    if (!isNumericId(shipmentId)) return;

    setIsLoading(true);
    setError(null);
    setTimeline(null);

    try {
      const token = await getValidAccessToken();
      if (!token) {
        setError({ message: t("admin.timeline.loadFailed"), isNotFound: false });
        return;
      }
      const data = await getShipmentTimeline(token, shipmentId!);
      setTimeline(data);
    } catch (err: any) {
      if (err?.status === 404) {
        setError({ message: t("admin.timeline.noHistory"), isNotFound: true });
      } else {
        setError({ message: t("admin.timeline.loadFailed"), isNotFound: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, [shipmentId, getValidAccessToken, t]);

  useEffect(() => {
    if (isOpen && isNumericId(shipmentId)) {
      fetchTimeline();
    } else {
      setTimeline(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, shipmentId, fetchTimeline]);

  if (!isNumericId(shipmentId)) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
        <Clock className="h-7 w-7 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground font-medium">
          {t("admin.timeline.noHistoryAvailable")}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 items-start">
            <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-3 w-48 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
        <Clock className="h-7 w-7 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground font-medium">{error.message}</p>
        {!error.isNotFound && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-8 px-4 text-xs font-bold"
            onClick={fetchTimeline}
          >
            <RefreshCcw className="h-3 w-3 mr-1.5" />
            {t("admin.timeline.retry")}
          </Button>
        )}
      </div>
    );
  }

  if (!timeline || timeline.events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
        <Clock className="h-7 w-7 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground font-medium">
          {t("admin.timeline.noHistory")}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-80 pr-1">
      <ol className="relative pl-4">
        {timeline.events.map((event, idx) => {
          const Icon = ACTION_ICONS[event.action] ?? Clock;
          const isLast = idx === timeline.events.length - 1;
          const actor = event.user_id || t("admin.timeline.system");
          const sourceLabel = t(`admin.timeline.source.${event.source as TimelineSource}`) || event.source;
          const actionLabel = t(`admin.timeline.action.${event.action as TimelineAction}`) || event.action;

          let formattedTime = "";
          let relativeTime = "";
          try {
            const date = new Date(event.timestamp);
            formattedTime = format(date, "MMM d, yyyy HH:mm");
            relativeTime = formatDistanceToNow(date, { addSuffix: true });
          } catch {
            formattedTime = event.timestamp;
          }

          return (
            <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border/50" />
              )}

              <div
                className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border/40 bg-card ${dotColor(event.action)}/10`}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={actionVariant(event.action)}
                    className="rounded-full px-2 py-0 h-5 text-[9px] font-black uppercase tracking-widest"
                  >
                    {actionLabel}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-semibold truncate">
                    {actor}
                    {" · "}
                    {t("admin.timeline.via")} {sourceLabel}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground leading-snug">
                  {event.description}
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-medium" title={relativeTime}>
                  {formattedTime}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </ScrollArea>
  );
}
