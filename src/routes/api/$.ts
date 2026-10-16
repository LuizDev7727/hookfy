import { createFileRoute } from '@tanstack/react-router'

const handle = async ({ request }: { request: Request }) => {
	// Import dinâmico: mantém db/pg fora do bundle do cliente
	const { app } = await import('@/server/app')
	return app.fetch(request)
}

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
			OPTIONS: handle,
			HEAD: handle
		}
	}
})
