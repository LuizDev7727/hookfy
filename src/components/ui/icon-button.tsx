import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const iconButton = cva(
	'flex items-center justify-center rounded-lg hover:bg-zinc-700 transition-colors duration-150',
	{
		variants: {
			size: {
				sm: 'size-6',
				md: 'size-8'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
)

interface IconButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof iconButton> {
	icon: ReactNode
}

export function IconButton({
	icon,
	size,
	className,
	...props
}: IconButtonProps) {
	return (
		<button
			type="button"
			className={cn(iconButton({ size }), className)}
			{...props}
		>
			{icon}
		</button>
	)
}
