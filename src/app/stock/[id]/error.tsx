'use client';

import { Button } from "@/components/ui/button";


export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<main className="flex flex-col gap-4 items-center py-4 sm:py-20">
			<h1 className="text-2xl dark:text-neutral-200 font-bold text-center w-full">Something went wrong!</h1>
			<p className="text-muted-foreground text-center">{error.message}</p>
			<Button
				onClick={reset}
			>
				Try again
			</Button>
		</main>
	)
}