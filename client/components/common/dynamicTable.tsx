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
  data,
  total,
  page,
  pages,
  loading,
  onPageChange,
}: DynamicTableProps<T>) {
  return (
    <div className="w-full">
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

        <TableBody
          items={data}
          isLoading={loading}
          loadingContent={
            <div className="flex justify-center items-center py-8">
              <Spinner label="در حال بارگذاری..." />
            </div>
          }
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

      <div className="text-sm text-zinc-500 text-center mt-2">
        مجموع: {formatNumber(total, "price")} مورد
      </div>
    </div>
  );
}
