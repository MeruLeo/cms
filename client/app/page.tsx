"use client";

import { useEffect, useState } from "react";
import { widgetConfig } from "@/config/home/widget.config";
import { useOrderStore } from "@/stores/order.store";
import { useUserStore } from "@/stores/user.store";
import { HeaderSection } from "@/components/home/modules/headerSection";
import { MainSection } from "@/components/home/modules/mainSection";
import { FooterSection } from "@/components/home/modules/footerSection";

export default function HomePage() {
  const { fetchAllUsers, users } = useUserStore();
  const {
    fetchAllOrders,
    totalRevenue,
    totalRevenueLoading,
    fetchTotalRevenue,
    periodRevenue,
    periodRevenueLoading,
    fetchPeriodRevenue,
    countOrdersByUser,
    fetchCountOrdersByUser,
    loading,
    orders,
  } = useOrderStore();

  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("day");

  useEffect(() => {
    fetchAllOrders();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    fetchPeriodRevenue(selectedPeriod);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      users.forEach((user) => {
        fetchCountOrdersByUser(user._id);
      });
    }
  }, [users]);

  const handlePeriodChange = (period: "day" | "week" | "month" | "year") => {
    setSelectedPeriod(period);
  };

  const widgets = widgetConfig(
    totalRevenue,
    totalRevenueLoading,
    loading,
    periodRevenue,
    periodRevenueLoading,
    selectedPeriod,
    handlePeriodChange
  );

  return (
    <section className="flex w-full overflow-auto h-fit flex-col items-center justify-center gap-2 py-5 px-4">
      <HeaderSection widgets={widgets} />
      <MainSection />
      <FooterSection users={users} orders={orders} />
    </section>
  );
}
