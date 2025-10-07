import { HeaderWidgetProps } from "@/components/home/header.widget";
import { formatNumber } from "@/utils/persianNumber";
import { FooterWidget } from "@/components/home/widgets/footer";
import { TimesWidget } from "@/components/home/widgets/times";
import { Skeleton } from "@heroui/skeleton";

export const widgetConfig = (
  totalRevenue: number,
  totalRevenueLoading: boolean,
  loading: boolean,
  periodRevenue: number,
  periodRevenueLoading: boolean,
  selectedPeriod: "day" | "week" | "month" | "year",
  onChange: (value: "day" | "week" | "month" | "year") => void
): HeaderWidgetProps[] => [
  {
    header: {
      icon: "Wallet",
      title: "کل سرمایه",
    },
    main: {
      value: totalRevenueLoading ? (
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      ) : (
        `
        ${formatNumber(totalRevenue, "price", {
          wrapWithLTR: false,
        })} ت
        `
      ),
    },
    styles: {
      bg: "bg-gray4",
      fontSize: "text-6xl",
    },
  },
  {
    header: {
      icon: "ChartSpline",
      title: "میزان فروش",
    },
    main: {
      value: periodRevenueLoading ? (
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      ) : (
        <TimesWidget
          loading={loading}
          periodRevenue={periodRevenue}
          selected={selectedPeriod}
          onChange={onChange}
        />
      ),
    },
    styles: {
      bg: "bg-gray4",
    },
  },
  {
    header: {
      icon: "CreditCard",
      title: "شماره کارت",
    },
    main: {
      value: formatNumber("6037000000000000", "card", {
        wrapWithLTR: true,
      }) as string,
    },
    footer: {
      optionalValue: <FooterWidget ownerName="امیرعلی الله وردی" />,
    },
    styles: {
      fontSize: "text-3xl",
      bg: "bg-gray4",
    },
  },
];
