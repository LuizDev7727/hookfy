import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function SectionTitle({ className, ...props }: ComponentProps<'h3'>) {
	return (
		<h3
			className={cn('text-base font-semibold text-zinc-100', className)}
			{...props}
		/>
	)
}
