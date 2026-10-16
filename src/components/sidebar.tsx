import { CopyIcon } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { WebhooksList } from '@/components/webhooks-list'

export function Sidebar() {
	// A origem só existe no cliente; calcular no effect evita mismatch de hidratação
	const [origin, setOrigin] = useState('')

	useEffect(() => {
		setOrigin(window.location.origin)
	}, [])

	const captureUrl = `${origin}/api/capture`

	return (
		<div className="flex h-screen flex-col">
			<div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
				<div className="flex items-baseline">
					<span className="font-semibold text-zinc-100">hook</span>
					<span className="font-normal text-zinc-400">.fy</span>
				</div>
			</div>

			<div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
				<div className="flex-1 min-w-0 flex items-center gap-1 text-xs font-mono text-zinc-300">
					<span className="truncate">{captureUrl}</span>
				</div>
				<IconButton
					icon={<CopyIcon className="size-4" />}
					onClick={() => navigator.clipboard.writeText(captureUrl)}
				/>
			</div>

			<Suspense fallback={<p className="p-4 text-zinc-400">Carregando...</p>}>
				<WebhooksList />
			</Suspense>
		</div>
	)
}
