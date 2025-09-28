import React from "react";

type FormatType = "card" | "phone" | "price";

type Options = {
  wrapWithLTR?: boolean;
  useLRM?: boolean;
};

const toPersianDigits = (str: string) =>
  str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

export function formatNumber(
  input: string | number,
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
