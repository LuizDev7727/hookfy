const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 60 * 60 * 24 * 365],
	['month', 60 * 60 * 24 * 30],
	['day', 60 * 60 * 24],
	['hour', 60 * 60],
	['minute', 60]
]

export function formatDistanceToNow(date: Date | string) {
	const seconds = (new Date(date).getTime() - Date.now()) / 1000

	for (const [unit, size] of units) {
		if (Math.abs(seconds) >= size) {
			return rtf.format(Math.trunc(seconds / size), unit)
		}
	}

	return rtf.format(Math.trunc(seconds), 'second')
}
