import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="grid auto-rows-min gap-4 md:grid-cols-2">
			<div className="aspect-3/1">
				<Skeleton className="size-full" />
			</div>
			<div className="aspect-3/1">
				<Skeleton className="size-full" />
			</div>
			<div className="aspect-3/1">
				<Skeleton className="size-full" />
			</div>
			<div className="aspect-3/1">
				<Skeleton className="size-full" />
			</div>
		</div>
	)
}