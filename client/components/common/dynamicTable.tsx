"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { formatNumber } from "@/utils/persianNumber";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  pages: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function DynamicTable<T extends { _id?: string }>({
  columns,
  data = [], // ← default به آرایه خالی برای جلوگیری از undefined
  total,
  page,
  pages,
  loading = false, // ← default false
  onPageChange,
}: DynamicTableProps<T>) {
  return (
    <div className="w-full">
      <div className="text-sm text-right text-zinc-500 my-2">
        {formatNumber(total, "price")} عنوان یافت شده
      </div>
      <Table
        aria-label="Dynamic data table"
        className="min-w-full border border-zinc-800 rounded-2xl"
        shadow="none"
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn key={col.key as string}>{col.label}</TableColumn>
          ))}
        </TableHeader>

        {loading ? ( // ← شرطی کردن TableBody برای loading
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <Spinner label="در حال بارگذاری..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody
            items={data} // ← همیشه آرایه معتبر
            emptyContent={
              <div className="text-center text-zinc-400 py-6">
                هیچ داده‌ای یافت نشد.
              </div>
            }
          >
            {(item) => (
              <TableRow key={item._id || Math.random()}>
                {columns.map((col) => (
                  <TableCell key={col.key as string}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>

      {pages > 1 && (
        <div dir="ltr" className="flex justify-center items-center mt-4">
          <Pagination
            page={page}
            total={pages}
            onChange={(p) => onPageChange && onPageChange(p)}
            showControls
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
