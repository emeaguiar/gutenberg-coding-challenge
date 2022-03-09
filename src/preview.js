/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import continentNames from '../assets/continent-names.json';
import continents from '../assets/continents.json';
import { getEmojiFlag } from './utils';

export default function Preview( { countryCode, relatedPosts, isLoading } ) {
	const emojiFlag = getEmojiFlag( countryCode );
	const hasRelatedPosts = relatedPosts?.length > 0;

	return (
		<div className="xwp-country-card">
			<div
				className="xwp-country-card__media"
				data-emoji-flag={ emojiFlag }
			>
				<div className="xwp-country-card-flag">{ emojiFlag }</div>
			</div>
			<h3
				className="xwp-country-card__heading"
				dangerouslySetInnerHTML={ {
					__html: sprintf(
						/* translators: %1$s: country name, %2$s country code, %3$s continent name */
						__(
							`Hello from <strong>%1$s</strong> (<span className="xwp-country-card__code">%2$s</span>) %3$s!`,
							'xwp-country-card'
						),
						countries[ countryCode ],
						countryCode,
						continentNames[ continents[ countryCode ] ]
					),
				} }
			></h3>
			<div className="xwp-country-card__related-posts">
				<h3 className="xwp-country-card__related-posts__heading">
					{ isLoading &&
						__( 'Retrieving data…', 'xwp-country-card' ) }

					{ ! isLoading &&
						hasRelatedPosts &&
						sprintf(
							/* translators: %s: number of found related posts */
							_n(
								'There is %d related post:',
								'There are %d related posts:',
								1,
								'xwp-country-card'
							),
							relatedPosts.length
						) }

					{ ! isLoading &&
						! hasRelatedPosts &&
						__( 'No related posts.', 'xwp-country-card' ) }
				</h3>
				{ hasRelatedPosts && (
					<ul className="xwp-country-card__related-posts-list">
						{ relatedPosts.map( ( relatedPost, index ) => (
							<li key={ index } className="related-post">
								<a
									className="link"
									href={ relatedPost.link }
									data-post-id={ relatedPost.id }
								>
									<h3 className="title">
										{ relatedPost.title }
									</h3>
									<p
										className="excerpt"
										dangerouslySetInnerHTML={ {
											__html: relatedPost.excerpt,
										} }
									></p>
								</a>
							</li>
						) ) }
					</ul>
				) }
			</div>
		</div>
	);
}
