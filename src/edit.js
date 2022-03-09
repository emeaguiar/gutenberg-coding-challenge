/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import './editor.scss';
import { getEmojiFlag } from './utils';
import Preview from './preview';

const options = Object.keys( countries ).map( ( code ) => ( {
	value: code,
	label: `${ getEmojiFlag( code ) } ${ countries[ code ] } — ${ code }`,
} ) );

export default function Edit( { attributes, setAttributes, context } ) {
	const { countryCode, relatedPosts } = attributes;
	const { postId } = context;

	const [ isPreview, setPreview ] = useState();

	/**
	 * Search related posts.
	 */
	const { foundPosts, isLoading } = useSelect(
		( select ) => {
			const postArgs = [
				'postType',
				'post',
				{
					exclude: postId,
					search: countries[ countryCode ],
				},
			];

			return {
				foundPosts: select( 'core' ).getEntityRecords( ...postArgs ) || [],
				isLoading: select( 'core/data' ).isResolving(
					'core',
					'getEntityRecords',
					postArgs
				),
			};
		},
		[ countryCode, postId ]
	);

	/**
	 * Show preview with selected flag on change of country.
	 */
	useEffect( () => setPreview( countryCode ), [ countryCode ] );

	/**
	 * Store related posts in block attributes.
	 */
	useEffect( () => {
		setAttributes( {
			relatedPosts:
				foundPosts?.map( ( relatedPost ) => ( {
					...relatedPost,
					title: relatedPost.title?.rendered || relatedPost.link,
					excerpt: relatedPost.excerpt?.rendered || '',
				} ) ) || [],
		} );
	}, [ foundPosts, setAttributes ] );

	/**
	 * Toggle preview when clicking toolbar icon.
	 */
	const handleChangeCountry = () => {
		setPreview( ! isPreview );
	};

	/**
	 * Update country code based on selection.
	 *
	 * @param {string} newCountryCode Selected country code.
	 */
	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode && countryCode !== newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	return (
		<div { ...useBlockProps() }>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Change Country', 'xwp-country-card' ) }
						icon={ edit }
						onClick={ handleChangeCountry }
						disabled={ ! Boolean( countryCode ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div>
				{ isPreview ? (
					<Preview
						countryCode={ countryCode }
						relatedPosts={ relatedPosts }
						isLoading={ isLoading }
					/>
				) : (
					<Placeholder
						icon={ globe }
						label={ __( 'XWP Country Card', 'xwp-country-card' ) }
						isColumnLayout={ true }
						instructions={ __(
							'Type in a name of a country you want to display on you site.',
							'xwp-country-card'
						) }
					>
						<ComboboxControl
							label={ __( 'Country', 'xwp-country-card' ) }
							hideLabelFromVision
							options={ options }
							value={ countryCode }
							onChange={ handleChangeCountryCode }
							allowReset={ true }
						/>
					</Placeholder>
				) }
			</div>
		</div>
	);
}
