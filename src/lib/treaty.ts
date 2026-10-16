import { treaty } from '@elysia/eden'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import type { App } from '@/server/app'

// A origem é descoberta automaticamente: no navegador pela janela e no SSR pela
// requisição atual (funciona em localhost, Vercel e domínios customizados)
const getOrigin = createIsomorphicFn()
	.server(() => getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin)
	.client(() => window.location.origin)

export const getTreaty = () => treaty<App>(getOrigin()).api
