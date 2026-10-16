import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { WebhooksListItem } from '@/components/webhooks-list-item'
import { getTreaty } from '@/lib/treaty'

export function WebhooksList() {
	const loadMoreRef = useRef<HTMLDivElement>(null)
	const observerRef = useRef<IntersectionObserver | null>(null)

	const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])

	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ['webhooks'],
			queryFn: async ({ pageParam }) => {
				const { data, error } = await getTreaty().webhooks.get({
					query: { limit: 20, cursor: pageParam }
				})

				if (error) {
					throw error
				}

				return data
			},
			getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
			initialPageParam: undefined as string | undefined
		})

	const webhooks = data.pages.flatMap((page) => page.webhooks)

	useEffect(() => {
		observerRef.current?.disconnect()

		observerRef.current = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]

				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 }
		)

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current)
		}

		return () => observerRef.current?.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	function handleCheckWebhook(checkedWebhookId: string) {
		setCheckedWebhooksIds((state) =>
			state.includes(checkedWebhookId)
				? state.filter((webhookId) => webhookId !== checkedWebhookId)
				: [...state, checkedWebhookId]
		)
	}

	if (webhooks.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center p-4">
				<p className="text-sm text-zinc-400">No webhooks captured.</p>
			</div>
		)
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="space-y-1 p-2">
				{webhooks.map((webhook) => (
					<WebhooksListItem
						key={webhook.id}
						webhook={webhook}
						onWebhookChecked={handleCheckWebhook}
						isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
					/>
				))}
			</div>

			{hasNextPage && (
				<div className="p-2" ref={loadMoreRef}>
					{isFetchingNextPage && (
						<div className="flex items-center justify-center py-2">
							<Loader2 className="size-5 animate-spin text-zinc-500" />
						</div>
					)}
				</div>
			)}
		</div>
	)
}
