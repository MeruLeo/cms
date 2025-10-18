"use client";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/order.store";
import { DynamicTable } from "@/components/common/dynamicTable";
import { IOrder, OrderStatus } from "@/types/order.type";
import { Button } from "@heroui/button";
import { ArrowUpDown, Eye, Trash2, SearchIcon } from "lucide-react";
import { formatNumber } from "@/utils/persianNumber";
import { ConfirmModal } from "@/components/common/confirm";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { FindOrdersOptions } from "@/services/order.service";

export default function OrdersTable() {
  const { orders, total, pages, loading, fetchAllOrders, deleteOrder } =
    useOrderStore();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const limit = 10;

  const getSortParams = (): FindOrdersOptions => {
    const sort = "-createdAt";
    const filters: FindOrdersOptions["filters"] = {
      search: searchTerm,
    };

    if (activeTab !== "all") {
      filters.status = activeTab as OrderStatus;
    }

    return {
      filters,
      page,
      limit,
      sort,
    };
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAllOrders(getSortParams());
    }, 400);
    return () => clearTimeout(delay);
  }, [page, searchTerm, activeTab, fetchAllOrders]);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    await deleteOrder(selectedId);
    addToast({ title: "سفارش با موفقیت حذف شد", color: "success" });
    await fetchAllOrders(getSortParams());
    setConfirmLoading(false);
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "در حال بررسی",
    [OrderStatus.PROCESSING]: "در حال پردازش",
    [OrderStatus.SHIPPED]: "ارسال شده",
    [OrderStatus.DELIVERED]: "تحویل شده",
    [OrderStatus.CANCELED]: "لغو شده",
  };

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    [OrderStatus.PROCESSING]:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    [OrderStatus.SHIPPED]:
      "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    [OrderStatus.DELIVERED]:
      "bg-green-500/10 text-green-400 border border-green-500/20",
    [OrderStatus.CANCELED]:
      "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  const columns = [
    { key: "code", label: "کد سفارش" },
    {
      key: "user",
      label: "کاربر",
      render: (item: IOrder) =>
        item.user?.fullName || item.user?.username || "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (item: IOrder) => (
        <span
          className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[item.status] || "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}
        >
          {statusMap[item.status] || item.status}
        </span>
      ),
    },
    {
      key: "totalAmount",
      label: "مجموع مبلغ",
      render: (item: IOrder) =>
        `${formatNumber(item.totalAmount, "price")} تومان`,
    },
    {
      key: "createdAt",
      label: "تاریخ ایجاد",
      render: (item: IOrder) =>
        new Date(item.createdAt).toLocaleDateString("fa-IR"),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (item: IOrder) => (
        <div className="flex gap-2">
          <Button
            as={"a"}
            href={`/orders/${item._id}`}
            isIconOnly
            color="primary"
            size="sm"
            variant="flat"
            aria-label="View"
          >
            <Eye size={16} />
          </Button>
          <Button
            isIconOnly
            color="danger"
            size="sm"
            variant="flat"
            aria-label="Delete"
            onPress={() => handleOpenConfirm(item._id!)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4 w-full">
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        aria-label="Search"
        radius="lg"
        classNames={{
          inputWrapper: "bg-gray4 w-[350px] border border-gray3",
          input: "text-sm",
        }}
        placeholder="جستجو در سفارشات، کاربران و ..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />

      <div className="gap-2 flex flex-col justify-start items-start">
        <div className="flex gap-2">
          <ArrowUpDown />
          <h6>مرتب‌سازی بر اساس</h6>
        </div>
        <Tabs
          radius="lg"
          selectedKey={activeTab}
          onSelectionChange={(key) => {
            setActiveTab(key as string);
            setPage(1);
          }}
        >
          <Tab key="all" title="همه سفارشات" />
          <Tab key={OrderStatus.PENDING} title="در حال بررسی" />
          <Tab key={OrderStatus.PROCESSING} title="در حال پردازش" />
          <Tab key={OrderStatus.SHIPPED} title="ارسال شده" />
          <Tab key={OrderStatus.DELIVERED} title="تحویل شده" />
          <Tab key={OrderStatus.CANCELED} title="لغو شده" />
        </Tabs>
      </div>

      <DynamicTable<IOrder>
        columns={columns}
        data={orders}
        total={total}
        page={page}
        pages={pages}
        loading={loading}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        title="تایید حذف سفارش"
        description="آیا از حذف این سفارش اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        loading={confirmLoading}
      />
    </div>
  );
}
