import { FC, useEffect } from 'react'
import { Avatar, Badge, Button, Skeleton, Typography } from '@mui/material'
import '../../../css/util/discord-presence.css'
import { useHistoryEntryState } from '../useHistoryEntry'

// discord's public widget - who's online, and an invite. Read with a plain fetch: FetchHandler adds a CLIENT_ID header discord's CORS doesn't allow
export const DISCORD_WIDGET = 'https://discord.com/api/guilds/659477868799197185/widget.json'

type DiscordStatus = 'online' | 'idle' | 'dnd'

type DiscordWidget = {
	instant_invite: string | null
	presence_count: number
	channels: { id: string; name: string }[]
	members: { id: string; username: string; avatar_url: string; status: DiscordStatus; game?: { name: string } }[]
}

// a few rows keep the sheet beside Trending - discord's widget lists up to 100 members
export const MAX_MEMBERS = 5

// read after the name, since the dot on the avatar is decorative
const STATUS_WORDS: Record<DiscordStatus, string> = { online: 'online', idle: 'idle', dnd: 'do not disturb' }

// the header and a few member rows, held while the widget loads
const PresenceSkeleton: FC = () => (
	<div className='discord-presence' aria-hidden='true' data-testid='discord-presence-skeleton'>
		<div className='discord-presence__header'>
			<div>
				<Typography variant='h6'>
					<Skeleton width='9rem' />
				</Typography>
				<Typography variant='caption'>
					<Skeleton width='12rem' />
				</Typography>
			</div>
			<Skeleton className='discord-presence__join-skeleton' variant='rounded' width={63} height={29} />
		</div>
		<ul className='discord-presence__members'>
			{[0, 1, 2].map((row) => (
				<li key={row} className='discord-presence__member'>
					<Skeleton variant='circular' width={30} height={30} />
					<Typography variant='body2'>
						<Skeleton width='50%' />
					</Typography>
				</li>
			))}
		</ul>
	</div>
)

const isWidgetSettled = (widget: DiscordWidget | null | undefined) => widget !== undefined

// "Join the Discord" under card of the day - who's on, the public channels and the members online. Hidden if the widget can't be read
const DiscordPresence: FC = () => {
	// undefined while loading, null when the widget can't be read
	const [widget, setWidget, isRestored] = useHistoryEntryState<DiscordWidget | null | undefined>('discord-widget', undefined, isWidgetSettled)

	useEffect(() => {
		if (isRestored) return

		const controller = new AbortController()

		fetch(DISCORD_WIDGET, { signal: controller.signal })
			.then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
			.then(setWidget)
			.catch(() => {
				// an abort is the effect cleaning up (and re-running in strict mode), not the widget failing
				if (!controller.signal.aborted) setWidget(null)
			})

		return () => controller.abort()
	}, [isRestored, setWidget])

	if (widget === undefined) return <PresenceSkeleton />
	if (!widget?.instant_invite) return null

	const numHidden = widget.members.length - MAX_MEMBERS
	const summary = [widget.presence_count > 0 ? `${widget.presence_count} online` : 'Nobody online right now', ...widget.channels.map((channel) => `#${channel.name}`)]

	return (
		<section className='discord-presence' aria-labelledby='discord-presence-heading'>
			<div className='discord-presence__header'>
				<div>
					<Typography variant='h6' component='h2' id='discord-presence-heading'>
						Join the Discord
					</Typography>
					<Typography variant='caption' component='p' className='discord-presence__summary'>
						{widget.presence_count > 0 && <span className='discord-presence__dot discord-presence__dot--online' aria-hidden='true' />}
						{summary.join(' · ')}
					</Typography>
				</div>
				<Button className='discord-presence__join' href={widget.instant_invite} target='_blank' rel='noopener noreferrer'>
					Join
				</Button>
			</div>

			{widget.members.length > 0 && (
				<ul className='discord-presence__members' aria-label='Members online'>
					{widget.members.slice(0, MAX_MEMBERS).map((member) => (
						<li key={member.id} className='discord-presence__member'>
							<Badge
								className={`discord-presence__status discord-presence__status--${member.status}`}
								overlap='circular'
								variant='dot'
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								aria-hidden='true'
							>
								<Avatar alt='' src={member.avatar_url}>
									{member.username.charAt(0)}
								</Avatar>
							</Badge>
							<Typography variant='body2' component='span' className='discord-presence__name'>
								{member.username}
								<span className='visually-hidden'>, {STATUS_WORDS[member.status] ?? member.status}</span>
							</Typography>{' '}
							{member.game && (
								<Typography variant='caption' component='span' className='discord-presence__game'>
									{member.game.name}
								</Typography>
							)}
						</li>
					))}
				</ul>
			)}
			{numHidden > 0 && (
				<Typography variant='caption' component='p' className='discord-presence__more'>
					+{numHidden} more online
				</Typography>
			)}
		</section>
	)
}

export default DiscordPresence
