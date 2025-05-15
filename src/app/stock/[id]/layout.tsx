"use client";

import { StockAutocomplete } from "@/components/StockAutocomplete"
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
	children?: React.ReactNode;
}

export default function Layout(props: Props) {
	const { children } = props;

	const router = useRouter();

	const openStockDetails = useCallback((stockId: string) => {
		router.push(Routes.stockDetails(stockId));
	}, []);

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border shadow-xs sticky top-0 z-50 bg-inherit">
				<div className="flex items-center gap-4 px-4">
					<Link
						href={Routes.home()}
					>
						<Image
							className="dark:invert"
							src="/logo.svg"
							alt="App logo"
							width={36}
							height={36}
							priority
						/>
					</Link>
					<StockAutocomplete onStockSelected={openStockDetails} />
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4 isolate">
				{children}
			</div>
		</>
	)
}
