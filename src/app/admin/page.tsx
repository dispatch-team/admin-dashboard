"use client";

import { useEffect, useState } from "react";
import { Users, Truck, List, PackageCheck } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useI18n } from "@/intl";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const t = useI18n("dashboards");
  const { getValidAccessToken } = useAuth();
  const [stats, setStats] = useState({
    merchants: 0,
    couriers: 0,
    shipments: 0,
    activeShipments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) return;

        // Fetch merchants count
        const merchantsRes = await fetch("/api/admin/merchants?page=1&page_size=1", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merchantsData = await merchantsRes.json();

        // Fetch couriers count
        const couriersRes = await fetch("/api/admin/couriers?page=1&page_size=1", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const couriersData = await couriersRes.json();

        // Fetch shipments count
        const shipmentsRes = await fetch("/api/shipments?page=1&page_size=1", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const shipmentsData = await shipmentsRes.json();

        setStats({
          merchants: merchantsData.total || 0,
          couriers: couriersData.total || 0,
          shipments: shipmentsData.total || 0,
          activeShipments: 0, // Placeholder
        });
      } catch (err) {
        console.error("Dashboard: Failed to load stats", err);
      }
    };
    fetchStats();
  }, [getValidAccessToken]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("admin.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("admin.welcome")}
        </p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <StatsCard
            title={t("admin.totalMerchants")}
            value={stats.merchants.toString()}
            icon={Users}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title={t("admin.totalCouriers")}
            value={stats.couriers.toString()}
            icon={Truck}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title={t("admin.totalShipments")}
            value={stats.shipments.toString()}
            icon={List}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title={t("admin.activeShipments")}
            value={stats.activeShipments.toString()}
            icon={PackageCheck}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-3xl border border-border/50 p-8 min-h-[400px] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
             <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("admin.platformGrowth")}</h3>
          <p className="text-muted-foreground max-w-sm">
             {t("admin.platformGrowthSubtitle")}
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 p-8 min-h-[400px] shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
             <List className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("admin.shipmentVolume")}</h3>
          <p className="text-muted-foreground max-w-sm">
             {t("admin.shipmentVolumeSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
