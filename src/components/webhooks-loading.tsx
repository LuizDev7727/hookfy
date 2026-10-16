import { Skeleton } from '@/components/ui/skeleton'

const ITEMS_COUNT = 20

const skeletonItems = Array.from(
	{ length: ITEMS_COUNT },
	(_, index) => `webhook-skeleton-${index}`
)

export function WebhooksLoading() {
	return (
		<div className="flex-1 overflow-y-auto">
			<div className="space-y-1 p-2">
				{skeletonItems.map((key) => (
					<div key={key} className="rounded-lg">
						<div className="flex items-start gap-3 px-4 py-2.5">
							<Skeleton className="size-4 shrink-0 rounded-[4px] bg-zinc-700" />

							<div className="flex flex-1 min-w-0 items-start gap-3">
								<div className="flex w-12 shrink-0 justify-end">
									<Skeleton className="h-4 w-10 bg-zinc-700" />
								</div>
								<div className="flex-1 min-w-0 space-y-1.5">
									<Skeleton className="h-3 w-full bg-zinc-700" />
									<Skeleton className="h-3 w-20 bg-zinc-800" />
								</div>
							</div>

							<Skeleton className="size-8 shrink-0 rounded-lg bg-zinc-800" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
