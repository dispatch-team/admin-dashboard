"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCcw, Filter, MoreHorizontal, Info, X, Package, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable";
import { useAuth } from "@/context/AuthContext";
import { getShipments, ShipmentListResponse, ShipmentResponse } from "@/lib/shipments";
import { useI18n } from "@/intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const pageSize = 15;

function statusVariant(status?: string) {
  if (!status) return "secondary";
  const normalized = status.toLowerCase();
  if (normalized.includes("delivered")) return "default";
  if (normalized.includes("cancelled") || normalized.includes("failed")) return "destructive";
  if (normalized.includes("pending")) return "secondary";
  return "secondary";
}

export default function AdminShipmentsPage() {
  const { getValidAccessToken } = useAuth();
  const t = useI18n("dashboards");
  const tCommon = useI18n("common");

  const [data, setData] = useState<ShipmentListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  const [selectedShipment, setSelectedShipment] = useState<ShipmentResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [weightMin, setWeightMin] = useState<string>("");
  const [weightMax, setWeightMax] = useState<string>("");
  const [feeMin, setFeeMin] = useState<string>("");
  const [feeMax, setFeeMax] = useState<string>("");

  const fetchShipments = useCallback(
    async (currentPage: number) => {
      setIsLoading(true);
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setError(tCommon("authRequired"));
          return;
        }

        const params: any = {
          page: currentPage,
          page_size: pageSize,
        };

        if (statusFilter !== "all") params.status = statusFilter;
        if (weightMin) params.weight_min = weightMin;
        if (weightMax) params.weight_max = weightMax;
        if (feeMin) params.fee_min = feeMin;
        if (feeMax) params.fee_max = feeMax;

        const response = await getShipments(token, params);
        setData(response);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load shipments:", err);
        setError(err.message || tCommon("error"));
      } finally {
        setIsLoading(false);
      }
    },
    [getValidAccessToken, statusFilter, weightMin, weightMax, feeMin, feeMax, tCommon]
  );

  useEffect(() => {
    fetchShipments(page);
  }, [page, fetchShipments]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, weightMin, weightMax, feeMin, feeMax]);

  const filteredShipments = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data.shipments;
    return data.shipments.filter((shipment) =>
      (shipment.code || shipment.description || shipment.merchant?.company_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(localSearch);
  };

  const totalPages = data ? Math.max(1, Math.ceil((data.total || 0) / (data.page_size || pageSize))) : 1;

  const clearFilters = () => {
    setStatusFilter("all");
    setWeightMin("");
    setWeightMax("");
    setFeeMin("");
    setFeeMax("");
    setSearchQuery("");
    setLocalSearch("");
  };

  const hasActiveFilters = 
    statusFilter !== "all" || 
    weightMin !== "" || 
    weightMax !== "" || 
    feeMin !== "" || 
    feeMax !== "" || 
    searchQuery !== "";

  const columns = [
    {
      key: "code",
      header: t("admin.code"),
      className: "py-4",
      render: (item: ShipmentResponse) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-foreground">
            {item.code || item.id.substring(0, 8)}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {item.merchant?.company_name || t("admin.unknownMerchant")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.status"),
      render: (item: ShipmentResponse) => (
        <Badge 
          variant={statusVariant(item.status)} 
          className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        >
          {item.status ? t(`admin.filter${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}` as any) : t("admin.filterPending")}
        </Badge>
      ),
    },
    {
      key: "total_fee",
      header: t("admin.fee"),
      render: (item: ShipmentResponse) => (
        <span className="text-xs font-bold text-foreground">
          {item.total_fee ? `${item.total_fee.toLocaleString()} ETB` : "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: t("admin.created"),
      render: (item: ShipmentResponse) => (
        <span className="text-[11px] text-muted-foreground font-medium">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">{t("admin.shipmentsTitle")}</h1>
          <p className="text-muted-foreground text-lg font-medium">{t("admin.shipmentsSubtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchShipments(page)} className="rounded-2xl h-12 px-6 border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300">
          <RefreshCcw className="h-4 w-4 mr-2" />
          <span className="font-bold">{tCommon("refresh")}</span>
        </Button>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="flex items-center gap-3 w-full rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md px-5 py-3.5 transition-all duration-300 hover:border-primary/40 hover:bg-card/60 group shadow-lg shadow-black/5">
            <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder={tCommon("searchPlaceholder")}
              className="border-0 bg-transparent p-0 text-base focus-visible:ring-0 placeholder:text-muted-foreground/60 font-medium"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="rounded-2xl h-[54px] px-6 font-bold shadow-lg shadow-primary/20"
          >
            {tCommon("search")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border/60 hover:bg-primary/5 relative">
                <Filter className="h-4 w-4 mr-2" />
                <span className="font-bold">{t("admin.advancedFilters")}</span>
                {(statusFilter !== "all" || weightMin || weightMax || feeMin || feeMax) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] border-l-border/40 bg-card/95 backdrop-blur-2xl">
              <SheetHeader className="pb-8">
                <SheetTitle className="text-2xl font-black tracking-tight">{t("admin.advancedFilters")}</SheetTitle>
                <SheetDescription className="font-medium opacity-70">
                  {t("admin.advancedFiltersDescription")}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(100vh-250px)] px-1">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                    {t("admin.filterStatus")}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus:ring-primary/20 transition-all">
                      <SelectValue placeholder={tCommon("selectStatus")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-xl font-medium">{tCommon("allStatuses")}</SelectItem>
                      <SelectItem value="pending" className="rounded-xl font-medium">{t("admin.filterPending")}</SelectItem>
                      <SelectItem value="assigned_to_courier" className="rounded-xl font-medium">{t("admin.filterAssignedToCourier")}</SelectItem>
                      <SelectItem value="assigned_to_driver" className="rounded-xl font-medium">{t("admin.filterAssignedToDriver")}</SelectItem>
                      <SelectItem value="picked_up" className="rounded-xl font-medium">{t("admin.filterPickedUp")}</SelectItem>
                      <SelectItem value="delivered" className="rounded-xl font-medium text-primary">{t("admin.filterDelivered")}</SelectItem>
                      <SelectItem value="failed" className="rounded-xl font-medium text-destructive">{t("admin.filterFailed")}</SelectItem>
                      <SelectItem value="cancelled" className="rounded-xl font-medium text-destructive">{t("admin.filterCancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                      {t("admin.filterMinWeight")}
                    </label>
                    <Input 
                      type="number"
                      placeholder={tCommon("min")} 
                      className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                      value={weightMin}
                      onChange={(e) => setWeightMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                      {t("admin.filterMaxWeight")}
                    </label>
                    <Input 
                      type="number"
                      placeholder={tCommon("max")} 
                      className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                      value={weightMax}
                      onChange={(e) => setWeightMax(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                      {t("admin.filterMinFee")}
                    </label>
                    <Input 
                      type="number"
                      placeholder={tCommon("min")} 
                      className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                      value={feeMin}
                      onChange={(e) => setFeeMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                      {t("admin.filterMaxFee")}
                    </label>
                    <Input 
                      type="number"
                      placeholder={tCommon("max")} 
                      className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                      value={feeMax}
                      onChange={(e) => setFeeMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <SheetFooter className="absolute bottom-8 left-8 right-8 gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-2xl h-12 font-bold hover:bg-destructive/5 hover:text-destructive"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("admin.clearFilters")}
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
                    {t("admin.applyFilters")}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
             <Button 
               variant="ghost" 
               size="sm" 
               className="rounded-xl h-10 px-3 text-muted-foreground hover:text-destructive font-bold"
               onClick={clearFilters}
             >
               <X className="h-4 w-4" />
             </Button>
          )}
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive font-semibold flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {error}
          </div>
        )}
        
        <DataTable
          columns={columns}
          data={filteredShipments}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => {
            setSelectedShipment(item);
            setIsDetailsOpen(true);
          }}
          emptyMessage={isLoading ? t("admin.loadingShipments") : t("admin.noShipments")}
        />
        
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-bold bg-muted/30 px-4 py-2 rounded-full">
            {t("admin.showingOfShipments", { count: filteredShipments.length, total: data?.total || 0 })}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl h-11 px-5 border-border/60 font-bold hover:bg-primary/5 transition-all"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              {tCommon("prev")}
            </Button>
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary font-bold text-sm">
              {page}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl h-11 px-5 border-border/60 font-bold hover:bg-primary/5 transition-all"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              {tCommon("next")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-border/40 bg-card/90 backdrop-blur-3xl shadow-3xl p-0 overflow-hidden">
          <div className="p-8 pb-4 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-black tracking-tight">{selectedShipment?.code || t("admin.shipmentDetails")}</DialogTitle>
                <div className="flex items-center gap-2">
                   <Badge variant={statusVariant(selectedShipment?.status)} className="rounded-full px-3 font-bold uppercase text-[9px] tracking-widest">
                     {selectedShipment?.status ? t(`admin.filter${selectedShipment.status.charAt(0).toUpperCase() + selectedShipment.status.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}` as any) : t("admin.filterPending")}
                   </Badge>
                   <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">
                     {selectedShipment?.merchant?.company_name}
                   </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 pt-6 space-y-8">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("admin.fee")}</p>
                 <p className="text-xl font-black text-primary">{selectedShipment?.total_fee?.toLocaleString()} ETB</p>
               </div>
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("admin.weight")}</p>
                 <p className="text-base font-bold text-foreground">{selectedShipment?.weight_kg} kg</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="mt-1 h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                   <MapPin className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("admin.pickupAddress")}</p>
                   <p className="text-sm font-semibold leading-snug">{selectedShipment?.start_address || "—"}</p>
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                   <MapPin className="h-4 w-4 text-primary" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("admin.deliveryAddress")}</p>
                   <p className="text-sm font-semibold leading-snug">{selectedShipment?.end_address || "—"}</p>
                 </div>
               </div>
            </div>

            <div className="space-y-2.5">
               <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("admin.description")}</p>
               <div className="rounded-2xl bg-muted/30 p-4 border border-border/40">
                 <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                   {selectedShipment?.description || t("admin.noDescription")}
                 </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-2">
               <div className="flex items-center gap-3">
                 <Clock className="h-4 w-4 text-muted-foreground" />
                 <div className="space-y-0.5">
                   <p className="text-[9px] uppercase font-black text-muted-foreground opacity-60">{t("admin.created")}</p>
                   <p className="text-xs font-bold">{selectedShipment?.created_at ? new Date(selectedShipment.created_at).toLocaleDateString() : "—"}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Package className="h-4 w-4 text-muted-foreground" />
                 <div className="space-y-0.5">
                   <p className="text-[9px] uppercase font-black text-muted-foreground opacity-60">{t("admin.items")}</p>
                   <p className="text-xs font-bold">{selectedShipment?.items?.length || 0} {tCommon("units")}</p>
                 </div>
               </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
