"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Truck, Search, RefreshCcw, MoreHorizontal, Ban, CheckCircle, Info, Star, Filter, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { buildCourierLogoProxyUrl } from "@/lib/couriers";

interface Courier {
  id: number;
  company_name: string;
  email: string;
  phone_number: string;
  status: string;
  company_address: string;
  website_url: string;
  rating_aggregate: number;
  rating_count: number;
  base_price: number;
  max_weight: number;
  company_logo_id?: string | null;
}

interface CourierListResponse {
  data: Courier[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const pageSize = 15;

export default function CouriersPage() {
  const t = useI18n("couriers");
  const tCommon = useI18n("common");
  const { getValidAccessToken, accessToken } = useAuth();

  const [data, setData] = useState<CourierListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("");
  const [minBasePrice, setMinBasePrice] = useState<string>("");

  const fetchCouriers = useCallback(
    async (currentPage: number) => {
      setIsLoading(true);
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setError(tCommon("authRequired"));
          return;
        }

        const query = new URLSearchParams({
          page: currentPage.toString(),
          page_size: pageSize.toString(),
        });

        if (searchQuery) query.append("company_name", searchQuery);
        if (statusFilter !== "all") query.append("status", statusFilter);
        if (minRating) query.append("min_rating", minRating);
        if (minBasePrice) query.append("min_base_price", minBasePrice);

        const response = await fetch(`/api/admin/couriers?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error(tCommon("error"));
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load couriers:", err);
        setError(err.message || t("loading"));
      } finally {
        setIsLoading(false);
      }
    },
    [getValidAccessToken, searchQuery, statusFilter, minRating, minBasePrice, t, tCommon]
  );

  useEffect(() => {
    fetchCouriers(page);
  }, [page, fetchCouriers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, minRating, minBasePrice]);

  const handleStatusUpdate = async (courierId: number, newStatus: string) => {
    try {
      const token = await getValidAccessToken();
      if (!token) return;

      const response = await fetch(`/api/admin/couriers/${courierId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(tCommon("error"));

      toast.success(`${t("status")} ${tCommon("success")}`);
      fetchCouriers(page);
    } catch (err: any) {
      toast.error(err.message || tCommon("error"));
    }
  };

  const handleSearch = () => {
    setSearchQuery(localSearch);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setMinRating("");
    setMinBasePrice("");
    setSearchQuery("");
    setLocalSearch("");
  };

  const hasActiveFilters = statusFilter !== "all" || minRating !== "" || minBasePrice !== "" || searchQuery !== "";

  const columns = [
    {
      key: "logo",
      header: "",
      className: "w-12 px-2",
      render: (item: Courier) => {
        const logoUrl = buildCourierLogoProxyUrl(item.company_logo_id, accessToken);
        return (
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
            <AvatarImage src={logoUrl || ""} alt={item.company_name} />
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
              {item.company_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      }
    },
    {
      key: "company_name",
      header: t("list"),
      className: "py-4",
      render: (item: Courier) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-sm text-foreground tracking-tight">{item.company_name}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{item.email}</span>
        </div>
      ),
    },
    {
      key: "rating",
      header: t("rating"),
      render: (item: Courier) => (
        <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-1 rounded-lg w-fit">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
            {item.rating_count > 0 
              ? (item.rating_aggregate / item.rating_count).toFixed(1) 
              : "0.0"}
          </span>
          <span className="text-[10px] text-yellow-600/60 dark:text-yellow-400/60 font-medium">({item.rating_count})</span>
        </div>
      )
    },
    {
      key: "status",
      header: t("status"),
      render: (item: Courier) => (
        <Badge 
          variant={item.status === "active" ? "default" : "destructive"} 
          className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        >
          {item.status === "active" ? t("statusActive") : t("statusBanned")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "text-right",
      render: (item: Courier) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/5" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border/50 bg-card/90 backdrop-blur-xl p-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2 py-1.5">{t("actions")}</DropdownMenuLabel>
            {item.status === "active" ? (
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive rounded-xl cursor-pointer py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(item.id, "banned");
                }}
              >
                <Ban className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-semibold text-sm">{t("ban")}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-primary focus:text-primary rounded-xl cursor-pointer py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(item.id, "active");
                }}
              >
                <CheckCircle className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-semibold text-sm">{t("unban")}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground text-lg font-medium">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/couriers/create">
            <Button className="rounded-2xl h-12 px-6 font-black shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              {t("createCourier")}
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => fetchCouriers(page)} className="rounded-2xl h-12 px-6 border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300">
            <RefreshCcw className="h-4 w-4 mr-2" />
            <span className="font-bold">{tCommon("refresh")}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="flex items-center gap-3 w-full rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md px-5 py-3.5 transition-all duration-300 hover:border-primary/40 hover:bg-card/60 group shadow-lg shadow-black/5">
            <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder={t("searchPlaceholder")}
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
                <span className="font-bold">{t("advancedFilters")}</span>
                {(statusFilter !== "all" || minRating !== "" || minBasePrice !== "") && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] border-l-border/40 bg-card/95 backdrop-blur-2xl">
              <SheetHeader className="pb-8">
                <SheetTitle className="text-2xl font-black tracking-tight">{t("advancedFilters")}</SheetTitle>
                <SheetDescription className="font-medium opacity-70">
                  {t("advancedFiltersDescription")}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-8 py-4">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                    {t("filterStatus")}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus:ring-primary/20 transition-all">
                      <SelectValue placeholder={tCommon("selectStatus")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-xl font-medium">{tCommon("allStatuses")}</SelectItem>
                      <SelectItem value="active" className="rounded-xl font-medium text-primary">{t("statusActive")}</SelectItem>
                      <SelectItem value="banned" className="rounded-xl font-medium text-destructive">{t("statusBanned")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                    {t("filterMinRating")}
                  </label>
                  <Input 
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="e.g. 4.5" 
                    className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60 px-1">
                    {t("filterMinBasePrice")}
                  </label>
                  <Input 
                    type="number"
                    min="0"
                    placeholder="e.g. 100" 
                    className="h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 transition-all"
                    value={minBasePrice}
                    onChange={(e) => setMinBasePrice(e.target.value)}
                  />
                </div>
              </div>

              <SheetFooter className="absolute bottom-8 left-8 right-8 gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-2xl h-12 font-bold hover:bg-destructive/5 hover:text-destructive"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  {tCommon("clearFilters")}
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
                    {tCommon("applyFilters")}
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
          data={data?.data || []}
          keyExtractor={(item) => item.id.toString()}
          onRowClick={(item) => {
            setSelectedCourier(item);
            setIsDetailsOpen(true);
          }}
          emptyMessage={isLoading ? t("loading") : t("noResults")}
        />
        
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-bold bg-muted/30 px-4 py-2 rounded-full">
            {t("showingOf", { count: data?.data.length || 0, total: data?.total || 0 })}
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
              <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-xl">
                <AvatarImage src={buildCourierLogoProxyUrl(selectedCourier?.company_logo_id, accessToken) || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                  {selectedCourier?.company_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-black tracking-tight">{selectedCourier?.company_name}</DialogTitle>
                <div className="flex items-center gap-2">
                   <Badge variant={selectedCourier?.status === "active" ? "default" : "destructive"} className="rounded-full px-3 font-bold uppercase text-[9px] tracking-widest">
                     {selectedCourier?.status === "active" ? t("statusActive") : t("statusBanned")}
                   </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 pt-6 space-y-8">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("basePrice")}</p>
                 <p className="text-base font-bold text-foreground">{selectedCourier?.base_price} {tCommon("etb")}</p>
               </div>
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("rating")}</p>
                 <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-base font-bold">
                      {selectedCourier && selectedCourier.rating_count > 0 
                        ? (selectedCourier.rating_aggregate / selectedCourier.rating_count).toFixed(1) 
                        : "0.0"}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter italic">
                      ({selectedCourier?.rating_count} {tCommon("reviews")})
                    </span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("maxWeight")}</p>
                 <p className="text-base font-bold text-foreground">{selectedCourier?.max_weight} {tCommon("kg")}</p>
               </div>
               <div className="space-y-1.5">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("contact")}</p>
                 <p className="text-base font-bold text-foreground truncate">{selectedCourier?.email}</p>
               </div>
            </div>

            <div className="space-y-1.5">
               <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{t("address")}</p>
               <p className="text-base font-bold text-foreground leading-snug">{selectedCourier?.company_address || "—"}</p>
            </div>
            
            {selectedCourier?.website_url && (
              <div className="pt-2">
                 <a 
                   href={selectedCourier.website_url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center justify-center w-full py-3 rounded-2xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all border border-primary/20"
                 >
                   {tCommon("visitWebsite")}
                 </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
