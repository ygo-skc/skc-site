import '../../css/main-pages/card-browse.css'
import '../../css/main-pages/product-information.css'
import '../../css/main-pages/archetype.css'

import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import FetchHandler from '../../helper/FetchHandler'
import * as DownstreamServices from '../../helper/DownstreamServices'

import Breadcrumb from '../header-footer/Breadcrumb'
import ArchetypeHeader from '../archetype/ArchetypeHeader'
import ArchetypeStatSheets from '../archetype/ArchetypeStatSheets'
import ArchetypeMembers from '../archetype/ArchetypeMembers'
import ArchetypeMembership from '../archetype/ArchetypeMembership'
import { archetypeStats } from '../archetype/archetypeStats'
import { useHistoryEntryState } from '../util/useHistoryEntry'

// the archetype has answered, so coming back to it can show it without fetching again
const isArchetypeSettled = (archetype: YGOArchetype.Data | undefined) => archetype !== undefined

/*
 * one archetype at a glance: the header, the stat sheets, the members (cards named after it) and, apart from them, the cards
 * whose name doesn't say whether they're in it. an unknown archetype is a 404 from the suggestion engine, which goes to the error page
 */
export default function ArchetypeInformation() {
	// each archetype gets its own mount (see Routes), so the name from the URL doesn't change while the page is up
	const { archetypeName = '' } = useParams<{ archetypeName: string }>()
	const [archetype, setArchetype, isRestored] = useHistoryEntryState<YGOArchetype.Data | undefined>('archetype', undefined, isArchetypeSettled)

	useEffect(() => {
		if (isRestored) return

		FetchHandler.handleFetch<YGOArchetype.Data>(`${DownstreamServices.SKC_SUGGESTION_ENDPOINTS.archetype}/${encodeURIComponent(archetypeName)}`, (data) =>
			// a list with no cards may come back as null
			setArchetype({ ...data, inheritMembers: data.inheritMembers ?? [], qualifiedMembers: data.qualifiedMembers ?? [], excludedMembers: data.excludedMembers ?? [] })
		)
	}, [archetypeName, isRestored, setArchetype])

	// the stats count every member - qualified cards are in the archetype too, they just aren't named after it
	const stats = useMemo(() => archetype && archetypeStats([...archetype.inheritMembers, ...archetype.qualifiedMembers]), [archetype])
	const name = archetype?.archetype ?? archetypeName

	return (
		<div className='generic-container'>
			<title>{`SKC - Archetype: ${name}`}</title>
			<meta name='description' content={`Every ${name} card - card types, attributes, monsters by ATK and the full list`} />
			<meta name='keywords' content={`YuGiOh, archetype, ${name}, The Supreme Kings Castle`} />

			<Breadcrumb crumbs={['Home', name]} />

			<ArchetypeHeader name={name} stats={stats} />

			{(!stats || stats.cards > 0) && <ArchetypeStatSheets stats={stats} />}

			<ArchetypeMembers cards={archetype?.inheritMembers} qualified={archetype?.qualifiedMembers.length} />

			{archetype && <ArchetypeMembership archetype={name} qualified={archetype.qualifiedMembers} excluded={archetype.excludedMembers} />}
		</div>
	)
}
