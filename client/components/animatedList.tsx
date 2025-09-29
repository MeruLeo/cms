"use client";

import React, {
  useRef,
  useState,
  useEffect,
  UIEvent,
  MouseEventHandler,
  ReactNode,
} from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Chip } from "@heroui/chip";
import { formatNumber } from "@/utils/persianNumber";

// ------------------- UserPreview -------------------
interface UserPreviewProps {
  fullName: string;
  email: string;
  countOfBuys: number;
  createdAt: string;
}

export const UserPreview = ({
  fullName,
  email,
  countOfBuys,
  createdAt,
}: UserPreviewProps) => {
  return (
    <li className="bg-gray3 p-3 gap-4 flex flex-col rounded-4xl">
      <header className="flex justify-between">
        <section>
          <p className="text-xl font-bold mb-2">{fullName}</p>
          <Chip variant="faded">{email}</Chip>
        </section>
        <section className="text-xs text-default-500">{createdAt}</section>
      </header>
      <main className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-default-500 text-sm">خرید موفق</p>
          <p className="text-default-500 text-sm">تیکت ها</p>
        </div>
        <div className="flex flex-col gap-2">
          <Chip size="lg" color="success" variant="flat">
            {formatNumber("5", "price")}
          </Chip>
          <Chip size="lg" color="warning" variant="flat">
            {formatNumber("9", "price")}
          </Chip>
        </div>
      </main>
      <footer>
        <Link
          href={`/`}
          className="flex justify-center items-center gap-2 bg-foreground text-background p-2 rounded-full w-full"
        >
          سوابق
          <ArrowLeft />
        </Link>
      </footer>
    </li>
  );
};

// ------------------- AnimatedItem -------------------
interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// ------------------- AnimatedList -------------------
interface UserItem {
  fullName: string;
  email: string;
  countOfBuys: number;
  createdAt: string;
}

interface AnimatedListProps {
  items: UserItem[];
  onItemSelect?: (item: UserItem, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[400px] gap-2 flex flex-col list-none overflow-y-auto p-4 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-gray3 [&::-webkit-scrollbar-thumb]:bg-gray2 [&::-webkit-scrollbar-thumb]:rounded-[4px]"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
      >
        {items.map((user, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(user, index);
              }
            }}
          >
            <UserPreview {...user} />
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-gray4 to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-gray4 to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
