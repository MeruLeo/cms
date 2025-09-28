import { HeaderWidgetProps } from "@/components/home/header.widget";
import { formatNumber } from "@/utils/persianNumber";
import { FooterWidget } from "@/components/home/widgets/footer";
import { TimesWidget } from "@/components/home/widgets/times";

export const widgetConfig: HeaderWidgetProps[] = [
  {
    header: {
      icon: "Wallet",
      title: "کل سرمایه",
      optionalValue: "",
    },
    main: {
      value: formatNumber("20000000", "price", {
        wrapWithLTR: false,
      }) as string,
    },
    styles: {
      bg: "bg-gradient-to-tr from-gray3 via-gray4 to-gray4",
      fontSize: "text-6xl",
    },
  },
  {
    header: {
      icon: "ChartSpline",
      title: "میزان فروش",
    },
    main: {
      value: formatNumber("20000000", "price", {
        wrapWithLTR: false,
      }) as string,
    },
    footer: {
      optionalValue: <TimesWidget />,
    },
    styles: {
      bg: "bg-gradient-to-r from-gray3 via-gray4 to-gray4",
    },
  },
  {
    header: {
      icon: "CreditCard",
      title: "شماره کارت",
      optionalValue: "",
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
      bg: "bg-gradient-to-br from-gray3 via-gray4 to-gray4",
    },
  },
];
