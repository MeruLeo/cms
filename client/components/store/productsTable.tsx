"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "@/stores/product.store";
import { DynamicTable } from "@/components/common/dynamicTable";
import { IProduct } from "@/types/product.type";
import { Button } from "@heroui/button";
import { Eye, Trash2 } from "lucide-react";
import { formatNumber } from "@/utils/persianNumber";

export default function ProductsTable() {
  const { products, total, pages, loading, fetchAllProducts, deleteProduct } =
    useProductStore();

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchAllProducts({ page, limit, sort: "-createdAt" });
  }, [page]);

  const columns = [
    { key: "title", label: "عنوان" },
    { key: "category", label: "دسته‌بندی" },
    {
      key: "price",
      label: "قیمت",
      render: (item: IProduct) => `${formatNumber(item.price, "price")} تومان`,
    },
    {
      key: "stockCount",
      label: "موجودی",
      render: (item: IProduct) =>
        item.stockCount > 0 ? (
          <span className="text-green-500">
            {formatNumber(item.stockCount, "price")}
          </span>
        ) : (
          <span className="text-red-500">اتمام موجودی</span>
        ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (item: IProduct) => {
        const map: Record<string, string> = {
          available: "فعال",
          out_of_stock: "ناموجود",
          discontinued: "توقف تولید",
        };
        return map[item.status] || "-";
      },
    },
    {
      key: "actions",
      label: "عملیات",
      render: (item: IProduct) => (
        <div className="flex gap-2">
          <Button
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
            onPress={() => deleteProduct(item._id!)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4 w-full">
      <DynamicTable<IProduct>
        columns={columns}
        data={products}
        total={total}
        page={page}
        pages={pages}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}
