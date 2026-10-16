import { desc, eq, lt } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '@/db'
import { webhooksTable } from '@/db/webhooks.table'

const captureWebhook = async ({
	request,
	body
}: {
	request: Request
	body: unknown
}) => {
	const url = new URL(request.url)
	const contentType = request.headers.get('content-type')
	const contentLengthHeader = request.headers.get('content-length')
	const contentLength = contentLengthHeader
		? Number(contentLengthHeader)
		: null

	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'

	const result = await db
		.insert(webhooksTable)
		.values({
			method: request.method,
			ip,
			contentType,
			contentLength,
			queryParams: Object.fromEntries(url.searchParams),
			body: typeof body === 'string' && body.length > 0 ? body : null,
			headers: Object.fromEntries(request.headers),
			pathname: url.pathname.replace('/api/capture', '') || '/'
		})
		.returning()

	return { id: result[0].id }
}

// Corpo cru como texto, independente do content-type
const captureOptions = { parse: 'text' } as const

export const app = new Elysia({
	prefix: '/api'
})
	.get('/', () => ({ message: 'Hello Elysia!' }))
	.get(
		'/webhooks',
		async ({ query }) => {
			const { limit, cursor } = query

			const result = await db
				.select({
					id: webhooksTable.id,
					method: webhooksTable.method,
					pathname: webhooksTable.pathname,
					createdAt: webhooksTable.createdAt
				})
				.from(webhooksTable)
				.where(cursor ? lt(webhooksTable.id, cursor) : undefined)
				.orderBy(desc(webhooksTable.id))
				.limit(limit + 1)

			const hasMore = result.length > limit
			const items = hasMore ? result.slice(0, limit) : result
			const nextCursor = hasMore ? items[items.length - 1].id : null

			return { webhooks: items, nextCursor }
		},
		{
			query: t.Object({
				limit: t.Numeric({ minimum: 1, maximum: 100, default: 20 }),
				cursor: t.Optional(t.String())
			})
		}
	)
	.get(
		'/webhooks/:id',
		async ({ params, status }) => {
			const result = await db
				.select()
				.from(webhooksTable)
				.where(eq(webhooksTable.id, params.id))
				.limit(1)

			if (result.length === 0) {
				return status(404, { message: 'Webhook not found.' })
			}

			return { webhook: result[0] }
		},
		{ params: t.Object({ id: t.String() }) }
	)
	.delete(
		'/webhooks/:id',
		async ({ params, status }) => {
			const result = await db
				.delete(webhooksTable)
				.where(eq(webhooksTable.id, params.id))
				.returning()

			if (result.length === 0) {
				return status(404, { message: 'Webhook not found.' })
			}

			return status(204, undefined)
		},
		{ params: t.Object({ id: t.String() }) }
	)
	.all('/capture', captureWebhook, captureOptions)
	.all('/capture/*', captureWebhook, captureOptions)

export type App = typeof app
