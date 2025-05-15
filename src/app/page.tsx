"use client";
import { StockAutocomplete } from "@/components/StockAutocomplete";
import { Routes } from "@/lib/routes";
import { useRouter } from 'next/navigation';
import { useCallback } from "react";

export default function Home() {
  const router = useRouter();

  const openStockDetails = useCallback((stockId: string) => {
    router.push(Routes.stockDetails(stockId));
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl dark:text-neutral-200 font-bold text-center w-full">Search Stock</h1>
        <StockAutocomplete onStockSelected={openStockDetails} />
      </main>
    </div>
  );
}
