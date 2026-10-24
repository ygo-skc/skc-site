import { FC, useCallback, useState } from 'react'
import { Button, Chip, Popover, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { YGOCardColorIndicator } from 'skc-rcl'

type FilterPill = { label: string; groups: { name: string; heading: string }[] }

// each pill edits one or more criteria groups from the browse criteria endpoint
const pills: FilterPill[] = [
	{ label: 'Card type', groups: [{ name: 'cardColors', heading: 'Card type' }] },
	{ label: 'Attribute', groups: [{ name: 'attributes', heading: 'Attribute' }] },
	{ label: 'Monster type', groups: [{ name: 'monsterTypes', heading: 'Monster type' }] },
	{
		label: 'Level / Rank / Link',
		groups: [
			{ name: 'levels', heading: 'Level' },
			{ name: 'ranks', heading: 'Rank' },
			{ name: 'linkRatings', heading: 'Link rating' },
		],
	},
	{ label: 'Sub type', groups: [{ name: 'monsterSubTypes', heading: 'Sub type' }] },
]

const isSame = (a: YGOData.CardBrowseValues, b: YGOData.CardBrowseValues) => a.name === b.name && a.value === b.value

// levels, ranks and link ratings read as bare numbers under their heading
const optionLabel = (option: YGOData.CardBrowseValues) => option.value.replace(/^(Level|Rank|Link Rating) /, '')

/*
 * dropdown pills under the criteria field - a quicker way to edit the same selection than typing. a pill with picks turns near-black
 * and names its first pick (+N for the rest); its popover holds the group's options as toggle chips
 */
const CardBrowseFilters: FC<{
	options: YGOData.CardBrowseValues[]
	selectedCriteria: YGOData.CardBrowseValues[]
	onChange: (selectedCriteria: YGOData.CardBrowseValues[]) => void
}> = ({ options, selectedCriteria, onChange }) => {
	const [open, setOpen] = useState<{ pill: FilterPill; anchor: HTMLElement }>()

	const toggle = useCallback(
		(option: YGOData.CardBrowseValues) =>
			onChange(selectedCriteria.some((picked) => isSame(picked, option)) ? selectedCriteria.filter((picked) => !isSame(picked, option)) : [...selectedCriteria, option]),
		[onChange, selectedCriteria]
	)

	const clear = useCallback(
		(pill: FilterPill) => onChange(selectedCriteria.filter((picked) => !pill.groups.some((group) => group.name === picked.name))),
		[onChange, selectedCriteria]
	)

	return (
		<div className='card-browse-filters' role='group' aria-label='Filters'>
			{pills.map((pill) => {
				const picks = selectedCriteria.filter((picked) => pill.groups.some((group) => group.name === picked.name))
				const isOpen = open?.pill === pill

				return (
					<Button
						key={pill.label}
						className={`card-browse-pill${picks.length > 0 ? ' card-browse-pill--active' : ''}`}
						aria-haspopup='dialog'
						aria-expanded={isOpen}
						endIcon={<ExpandMoreIcon />}
						onClick={(event) => setOpen({ pill, anchor: event.currentTarget })}
					>
						{pill.label}
						{picks.length > 0 && ' '}
						{picks.length > 0 && (
							<Typography variant='inherit' component='span' className='card-browse-pill__picks'>
								{picks[0].value}
								{picks.length > 1 && ` +${picks.length - 1}`}
							</Typography>
						)}
					</Button>
				)
			})}

			<Popover
				open={open !== undefined}
				anchorEl={open?.anchor}
				onClose={() => setOpen(undefined)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
				slotProps={{ paper: { className: 'card-browse-filters__popover', role: 'dialog', 'aria-label': open?.pill.label } }}
			>
				{open?.pill.groups.map((group) => {
					const groupOptions = options.filter((option) => option.name === group.name)
					if (groupOptions.length === 0) return null

					return (
						<section key={group.name} className='card-browse-filters__group' aria-label={group.heading}>
							{open.pill.groups.length > 1 && (
								<Typography variant='subtitle2' component='h2' className='card-browse-filters__heading'>
									{group.heading}
								</Typography>
							)}
							<div className='card-browse-filters__options'>
								{groupOptions.map((option) => (
									<Chip
										key={option.value}
										className='card-browse-option'
										aria-pressed={selectedCriteria.some((picked) => isSame(picked, option))}
										aria-label={option.value}
										icon={
											group.name === 'cardColors' ? (
												<span className='card-browse-option__frame' aria-hidden='true'>
													<YGOCardColorIndicator cardColor={option.value as YGOCard.Color} />
												</span>
											) : undefined
										}
										label={optionLabel(option)}
										onClick={() => toggle(option)}
									/>
								))}
							</div>
						</section>
					)
				})}
				{open && (
					<div className='card-browse-filters__footer'>
						<Button className='card-browse-filters__clear' onClick={() => clear(open.pill)}>
							Clear
						</Button>
						<Button variant='contained' disableElevation className='card-browse-filters__done' onClick={() => setOpen(undefined)}>
							Done
						</Button>
					</div>
				)}
			</Popover>
		</div>
	)
}

export default CardBrowseFilters
