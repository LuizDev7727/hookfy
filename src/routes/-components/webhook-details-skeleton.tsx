import { Skeleton } from '@/components/ui/skeleton'

const OVERVIEW_ROWS = ['method', 'status-code', 'content-type', 'content-length']
const HEADERS_ROWS = ['header-1', 'header-2', 'header-3', 'header-4', 'header-5']

function SectionTableSkeleton({ rows }: { rows: string[] }) {
	return (
		<div className="overflow-hidden rounded-lg border border-zinc-700">
			<table className="w-full">
				<tbody>
					{rows.map((row) => (
						<tr key={row} className="border-b border-zinc-700 last:border-0">
							<td className="w-1/3 p-3 bg-zinc-800/50 border-r border-zinc-700">
								<Skeleton className="h-4 w-24 bg-zinc-700" />
							</td>
							<td className="p-3">
								<Skeleton className="h-4 w-full max-w-64 bg-zinc-800" />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export function WebhookDetailsSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="space-y-4 border-b border-zinc-700 p-6">
				<div className="flex items-center gap-3">
					<Skeleton className="h-5 w-14 rounded-full bg-zinc-700" />
					<Skeleton className="h-6 w-48 bg-zinc-700" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-32 bg-zinc-800" />
					<span className="w-px h-4 bg-zinc-700" />
					<Skeleton className="h-4 w-40 bg-zinc-800" />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<div className="space-y-6 p-6">
					<div className="space-y-4">
						<Skeleton className="h-5 w-36 bg-zinc-700" />
						<SectionTableSkeleton rows={OVERVIEW_ROWS} />
					</div>

					<div className="space-y-4">
						<Skeleton className="h-5 w-20 bg-zinc-700" />
						<SectionTableSkeleton rows={HEADERS_ROWS} />
					</div>

					<div className="space-y-4">
						<Skeleton className="h-5 w-32 bg-zinc-700" />
						<Skeleton className="h-40 w-full rounded-lg bg-zinc-800" />
					</div>
				</div>
			</div>
		</div>
	)
}
