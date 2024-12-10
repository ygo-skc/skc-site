import { Avatar, Typography } from '@mui/material'
import React, { FC, Fragment, JSX, memo, useCallback, useEffect, useState } from 'react'

type DBSearchOptionsProps = {
	props: React.HTMLAttributes<HTMLLIElement>
	searchSubject: string
	cardNameOption: string
	cardIdOption: string
	monsterTypeOption: string
}

const DBSearchOptions: FC<DBSearchOptionsProps> = memo(
	({ props, searchSubject, cardNameOption, cardIdOption, monsterTypeOption }) => {
		const [imgUrl, setImgUrl] = useState(`https://images.thesupremekingscastle.com/cards/tn/${cardIdOption}.jpg`)
		const [searchSuggestionText, setSearchSuggestionText] = useState<JSX.Element[]>([])

		useEffect(() => {
			const UPPERCASE_SEARCH_TERMS = searchSubject.toUpperCase().trim().split(' ')

			setSearchSuggestionText(
				cardNameOption.split(' ').map((token, ind) => {
					const UPPERCASE_TOKEN = token.toUpperCase()
					const MATCHED_TERM = UPPERCASE_SEARCH_TERMS.find((searchTerm) => UPPERCASE_TOKEN.includes(searchTerm))

					if (MATCHED_TERM == undefined) {
						return <span key={token}>{ind > 0 ? ` ${token}` : token}</span>
					}

					const INDEX_OF_SEARCH_TERM = UPPERCASE_TOKEN.indexOf(MATCHED_TERM)
					const LENGTH_OF_SEARCH_TERM = MATCHED_TERM.length
					return (
						<Fragment key={token}>
							<span>{ind > 0 ? ` ${token.slice(0, INDEX_OF_SEARCH_TERM)}` : token.slice(0, INDEX_OF_SEARCH_TERM)}</span>
							<strong className='search-suggestion-substring-match'>{token.slice(INDEX_OF_SEARCH_TERM, INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}</strong>
							<span>{token.slice(INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}</span>
						</Fragment>
					)
				})
			)
		}, [cardNameOption, searchSubject])

		const onAvatarImgLoadErrorCB = useCallback(() => {
			setImgUrl('https://images.thesupremekingscastle.com/cards/tn/default-card-image.jpg')
		}, [])

		return (
			<li {...props} className='search-suggestions-parent'>
				<Avatar className='card-image-avatar' alt={`${cardNameOption}-Avatar`} src={imgUrl} slotProps={{ img: { onError: onAvatarImgLoadErrorCB } }} />
				<div className='search-suggestions-info-parent'>
					<Typography className='search-suggestion-text' variant='subtitle1'>
						{searchSuggestionText}
					</Typography>
					<Typography variant='body1' className='search-suggestion-text search-suggestion-subheader'>
						{monsterTypeOption}
					</Typography>
				</div>
			</li>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.cardNameOption === nextProps.cardNameOption && prevProps.searchSubject === nextProps.searchSubject
	}
)

DBSearchOptions.displayName = 'DBSearchOptions'
export default DBSearchOptions
