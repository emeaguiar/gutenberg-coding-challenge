/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { BlockControls } from '@wordpress/block-editor';
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

export default function Edit( { attributes, setAttributes, context } ) {
	const { countryCode, relatedPosts } = attributes;
	const { postId } = context;
	const options = Object.keys( countries ).map( ( code ) => ( {
		value: code,
		label: `${ getEmojiFlag( code ) } ${ countries[ code ] } — ${ code }`,
	} ) );

	const [ isPreview, setPreview ] = useState();

	useEffect( () => setPreview( countryCode ), [ countryCode ] );

	const handleChangeCountry = () => {
		if ( isPreview ) {
			setPreview( false );
		} else if ( countryCode ) {
			setPreview( true );
		}
	};

	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode && countryCode !== newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	const foundPosts = useSelect(
		( select ) => {
			return select( 'core' ).getEntityRecords( 'postType', 'post', {
				exclude: postId,
				search: countries[ countryCode ],
			} );
		},
		[ countryCode, postId ]
	);

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

	return (
		<>
			<BlockControls>
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
		</>
	);
}
