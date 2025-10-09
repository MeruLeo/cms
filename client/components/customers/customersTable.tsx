"use client";
import React, { useEffect, useState } from "react";
import { useProductStore } from "@/stores/product.store";
import { DynamicTable } from "@/components/common/dynamicTable";
import { IProduct } from "@/types/product.type";
import { Button } from "@heroui/button";
import { ArrowUpDown, Eye, Trash2, SearchIcon } from "lucide-react";
import { formatNumber } from "@/utils/persianNumber";
import { ConfirmModal } from "@/components/common/confirm";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";

export default function ProductsTable() {
  const { products, total, pages, loading, fetchAllProducts, deleteProduct } =
    useProductStore();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const limit = 10;

  const getSortParams = () => {
    let sort = "-createdAt";
    const params: any = { search: searchTerm, page, limit };

    switch (activeTab) {
      case "bestselling":
        sort = "-salesCount";
        break;
      case "lowselling":
        sort = "salesCount";
        break;
      case "outofstock":
        params.status = "out_of_stock";
        break;
    }

    params.sort = sort;
    return params;
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAllProducts(getSortParams());
    }, 400);
    return () => clearTimeout(delay);
  }, [page, searchTerm, activeTab]);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    await deleteProduct(selectedId);
    addToast({ title: "محصول با موفقیت حذف شد", color: "success" });
    await fetchAllProducts(getSortParams());
    setConfirmLoading(false);
    setConfirmOpen(false);
    setSelectedId(null);
  };

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
            as={"a"}
            href={`/store/${item.slug}`}
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
        placeholder="جستجو در محصولات، دسته‌بندی‌ها و ..."
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
          <Tab key="all" title="همه محصولات" />
          <Tab key="bestselling" title="پرفروش‌ترین" />
          <Tab key="lowselling" title="کم‌فروش‌ترین" />
          <Tab key="outofstock" title="ناموجودها" />
        </Tabs>
      </div>

      <DynamicTable<IProduct>
        columns={columns}
        data={products}
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
        title="تایید حذف محصول"
        description="آیا از حذف این محصول اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        loading={confirmLoading}
      />
    </div>
  );
}
