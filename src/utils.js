/**
 * Return a country flag based on country code.
 *
 * @param {string} countryCode Country to retrieve.
 * @return {*} Emoji.
 */
export function getEmojiFlag( countryCode ) {
	return String.fromCodePoint(
		...countryCode
			.toUpperCase()
			.split( '' )
			.map( ( char ) => 127397 + char.charCodeAt() )
	);
}
