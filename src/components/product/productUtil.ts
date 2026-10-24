const typeLabels: Record<string, string> = {
	Pack: 'Packs',
	Deck: 'Decks',
	Set: 'Sets',
	Promo: 'Promos',
}

// plural label for a product type, e.g. Pack -> Packs ("Other" stays as it is)
export const productTypeLabel = (type: string): string => typeLabels[type] ?? type

// the year a product came out, from its YYYY-MM-DD release date
export const releaseYear = (product: YGOProduct.Info) => +product.productReleaseDate.slice(0, 4)
