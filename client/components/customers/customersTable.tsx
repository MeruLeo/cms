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
import { useUserStore } from "@/stores/user.store";
import { IUser } from "@/types/user.type";
import { Chip } from "@heroui/chip";

export default function CustomersTable() {
  const { users, pages, loading, total, fetchAllUsers, deleteUser } =
    useUserStore();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const limit = 10;

  const getSortParams = () => {
    let sort = "-createdAt";
    const params: any = { search: searchTerm, page, limit };

    params.sort = sort;
    return params;
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAllUsers(getSortParams());
    }, 400);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    await deleteUser(selectedId);
    addToast({ title: "کاربر با موفقیت حذف شد", color: "success" });
    await fetchAllUsers(getSortParams());
    setConfirmLoading(false);
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const columns = [
    { key: "fullName", label: "نام کامل" },
    { key: "email", label: "ایمیل" },
    {
      key: "role",
      label: "نقش",
      render: (item: IUser) => (item.role === "admin" ? "مدیر" : "مشتری"),
    },
    {
      key: "isActive",
      label: "وضعیت کاربر",
      render: (item: IUser) =>
        item.isActive ? (
          <Chip color="success" variant="faded">
            فعال
          </Chip>
        ) : (
          <Chip color="danger" variant="faded">
            غیرفعال
          </Chip>
        ),
    },
    {
      key: "createdAt",
      label: "تاریخ ثبت",
      render: (item: IUser) =>
        item.createdAt ? formatNumber(item.createdAt, "date") : "-",
    },
    {
      key: "actions",
      label: "عملیات",
      render: (item: IUser) => (
        <div className="flex gap-2">
          <Button
            as={"a"}
            href={`/customers/${item._id}`}
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
        placeholder="جستجو از طریق نام کاربری، ایمیل، نام کامل و ..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />

      <DynamicTable<IUser>
        columns={columns}
        data={users}
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
        title="تایید حذف کاربر"
        description="آیا از حذف این کاربر اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        loading={confirmLoading}
      />
    </div>
  );
}
