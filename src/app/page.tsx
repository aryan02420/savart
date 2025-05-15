"use client";
import { StockAutocomplete } from "@/components/StockAutocomplete";
import { Routes } from "@/lib/routes";
import { useRouter } from 'next/navigation';
import { useCallback } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const openStockDetails = useCallback((stockId: string) => {
    router.push(Routes.stockDetails(stockId));
  }, []);

  return (
    <div className="grid place-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 min-h-min justify-center items-center w-full">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="App logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="text-2xl dark:text-neutral-200 font-bold text-center">Search Stock</h1>
        <StockAutocomplete onStockSelected={openStockDetails} />
      </main>
    </div>
  );
}
