import React from "react";
import * as jalaali from "jalaali-js";

type FormatType = "card" | "phone" | "price" | "date";

type Options = {
  wrapWithLTR?: boolean;
  useLRM?: boolean;
};

/** تبدیل عدد به رقم فارسی */
const toPersianDigits = (str: string) =>
  str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

/** تبدیل تاریخ میلادی به تاریخ شمسی */
const toJalali = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return "";
  }

  const { jy, jm, jd } = jalaali.toJalaali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );

  return `${jy}/${jm.toString().padStart(2, "0")}/${jd
    .toString()
    .padStart(2, "0")}`;
};

export function formatNumber(
  input: string | number | Date,
  type: FormatType,
  options: Options = {}
): string | React.ReactNode {
  let digits = String(input).replace(/\D/g, "");
  let formatted = "";

  switch (type) {
    case "card": {
      digits = digits.slice(0, 16);
      formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
      formatted = formatted.trim();
      break;
    }

    case "phone": {
      digits = digits.slice(0, 11);
      if (!digits.startsWith("09") || digits.length < 11) {
        formatted = "";
      } else {
        formatted = digits;
      }
      break;
    }

    case "price": {
      formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      break;
    }

    case "date": {
      formatted = toJalali(input as Date | string);
      break;
    }

    default:
      formatted = digits;
  }

  const persian = toPersianDigits(formatted);

  if (options.wrapWithLTR) {
    return (
      <span
        dir="ltr"
        style={{ direction: "ltr", unicodeBidi: "isolate" as "isolate" }}
      >
        {persian}
      </span>
    );
  }

  if (options.useLRM) {
    return "\u200E" + persian;
  }

  return persian;
}
