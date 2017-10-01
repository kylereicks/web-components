/**
 * An accordion web component. Based on the recommendations
 * at https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
 *
 * @summary   An accordion web component.
 *
 * @since     0.1.0
 * @classdesc Anonymous class extending HTMLElement.
 */
window.customElements.define( 'component-accordion', class extends HTMLElement {

	/**
	 * @summary Convert a selector-rules object into a CSS string.
	 *
	 * @since 0.1.0
	 *
	 * @param {object} ruleObject An object with a selector property (string) and a rules property (array).
	 * @returns {string} A CSS string.
	 */
	generateStyleString( ruleObject ) {
		return ruleObject.selector + '{' + ruleObject.rules.join('') + '}';
	}

	/**
	 * @summary Apply the default style rules to the Shadow DOM.
	 *
	 * @since 0.1.0
	 *
	 * @see generateStyleString
	 *
	 * @returns {object} The accordion HTMLElement instance.
	 */
	setStyles() {
		const styleStrings = [
			{
				selector: ':host > * + *',
				rules: [
					'border-top: 1px solid rgba( 0, 0, 0, 0.25 );',
					'border-left: 1px solid rgba( 0, 0, 0, 0.25 );',
					'border-right: 1px solid rgba( 0, 0, 0, 0.25 );',
				]
			},
			{
				selector: 'section > h1,section > h2,section > h3,section > h4,section > h5,section > h6',
				rules: [
					'margin: 0;',
				]
			},
			{
				selector: 'section[expanded] > h1,section[expanded] > h2,section[expanded] > h3,section[expanded] > h4,section[expanded] > h5,section[expanded] > h6',
				rules: [
					'border-bottom: 1px solid rgba( 0, 0, 0, 0.25 );',
				]
			},
			{
				selector: '.accordion-control',
				rules: [
					'background: none;',
					'border: 0;',
					'font-size: 1rem;',
					'margin: 0;',
					'padding: 1em 1.5em;',
					'text-align: left;',
					'width: 100%;'
				]
			},
			{
				selector: '.accordion-control:before',
				rules: [
					'content:  "\u25BC";'
				]
			},
			{
				selector: '.accordion-control[aria-expanded="true"]:before',
				rules: [
					'content:  "\u25B2";'
				]
			},
			{
				selector: 'section article',
				rules: [
					'margin: 0;',
					'padding: 1em 1.5em;',
				]
			},
			{
				selector: 'section:last-child',
				rules: [
					'border-bottom: 1px solid rgba( 0, 0, 0, 0.25 );',
				]
			},
			{
				selector: '.accordion-control:hover, .accordion-control:focus',
				rules: [
					'background: rgba( 0, 0, 0, 0.25 );',
				]
			},
			{
				selector: 'section:not([expanded]) article',
				rules: ['display: none;']
			}
		].map( this.generateStyleString );

		if ( ! this.componentStyle ) {
			this.componentStyle = this.shadowRoot.appendChild( document.createElement( 'style' ) ).sheet;
		}

		if ( ! this.componentStyle.rules.length || [].reduce.call( this.componentStyle.rules, ( ruleMatch, rule ) => ruleMatch || styleStrings.join('') === rule.cssText, false ) ) {
			styleStrings.forEach( ( styleString, index ) => {
				this.componentStyle.insertRule( styleString, index );
			} );
		}

		return this;
	}

	/**
	 * @summary Add the component HTML to the Shadow DOM.
	 *
	 * @since 0.1.0
	 *
	 * @returns {object} The accordion HTMLElement instance.
	 */
	render() {
		const sections = [].reduce.call(  this.childNodes, ( sectionsArray, node ) => {

			if ( 1 !== node.nodeType || 'SECTION' !== node.tagName ) {
				return sectionsArray;
			}

			const { button, article } = [].reduce.call( node.childNodes, function( sectionObject, node ) {
				if ( 1 !== node.nodeType ) {
					return sectionObject;
				}
				if ( -1 !== node.tagName.search( /H[1-6]/ ) ) {
					if ( null === sectionObject.button ) {
						let headingText = node.innerHTML;
						node.innerHTML = '';
						sectionObject.button = node.appendChild( document.createElement( 'button' ) );
						sectionObject.button.appendChild( document.createTextNode( headingText ) );
					} else {
						sectionObject.button = false;
					}
				}
				if ( 'ARTICLE' === node.tagName ) {
					if ( null === sectionObject.article ) {
						sectionObject.article = node;
					} else {
						sectionObject.article = false;
					}
				}

				return sectionObject;
			}, { button: null, article: null } );

			if ( ! button || ! article ) {
				return sectionsArray;
			}

			const observeAndUpdateAriaAttributes = new MutationObserver( function( button, article ) {
				if ( this.hasAttribute( 'expanded' ) ) {
					button.setAttribute( 'aria-expanded', true );
					article.setAttribute( 'aria-hidden', false );
					if ( ! this.hasAttribute( 'allow-all-closed' ) ) {
						button.setAttribute( 'aria-disabled', true );
					}
				} else {
					button.setAttribute( 'aria-expanded', false );
					article.setAttribute( 'aria-hidden', true );
					button.removeAttribute( 'aria-disabled' );
				}
			}.bind( node, button, article ) );

			const sectionId = node.id || Math.random().toString( 36 ).slice( 2 );

			this.buttons.push( button );
			this.articles.push( article );

			button.setAttribute( 'id', 'control-' + sectionId );
			article.setAttribute( 'id', 'content-' + sectionId );
			button.setAttribute( 'aria-controls', article.id );
			article.setAttribute( 'aria-labelledby', button.id );

			button.classList.add( 'accordion-control' );
			button.setAttribute( 'role', 'tab' );
			article.classList.add( 'accordion-content' );
			article.setAttribute( 'role', 'tabpanel' );

			observeAndUpdateAriaAttributes.observe( node, { attributes: true, attributeOldValue: true, attributeFilter: [ 'expanded' ] } );

			if ( node.hasAttribute( 'expanded' ) ) {
				node.setAttribute( 'expanded', true );
			}

			button.addEventListener( 'click', event => {
				event.preventDefault();
				if ( ! this.hasAttribute( 'allow-all-open' ) ) {
					[].forEach.call( this.shadowRoot.childNodes, section => {
						if ( 'SECTION' !== section.tagName ) {
							return;
						}
						section.removeAttribute( 'expanded' )
					} );
				}
				if ( node.hasAttribute( 'expanded' ) && ( this.hasAttribute( 'allow-all-closed' ) || [].reduce.call( this.shadowRoot.childNodes, ( sectionCount, section ) => section.hasAttribute( 'expanded' ) ? ++sectionCount : sectionCount, 0 ) > 1 ) ) {
					node.removeAttribute( 'expanded' );
				} else {
					node.setAttribute( 'expanded', true );
				}
			} );

			sectionsArray.push( node );

			return sectionsArray;
		}, [] );

		this.setStyles();
		this.setAttribute( 'role', 'tablist' );

		if ( ! this.hasAttribute( 'allow-all-open' ) ) {
			this.setAttribute( 'aria-multiselectable', 'true' );
		}

		sections.forEach( section => this.shadowRoot.appendChild( section ) );

		return this;
	}

	/**
	 * @summary Set up keyboard events based on the accessibility guidelines at w3.org.
	 *
	 * @since 0.1.0
	 *
	 * @returns {object} The accordion HTMLElement instance.
	 */
	setKeybordEvents() {
		// https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
		this.addEventListener( 'keydown', (event) => {
			const target = event.path[0];
			const key = event.which.toString();
			const ctrlModifier = ( event.ctrlKey && key.match( /33|34/ ) );

			if ( target.classList.contains( 'accordion-control' ) ) {
				if ( key.match( /38|40/ ) || ctrlModifier ) {
					const index = this.buttons.indexOf(target);
					const direction = (key.match(/34|40/)) ? 1 : -1;
					const length = this.buttons.length;
					const newIndex = (index + length + direction) % length;

					this.buttons[ newIndex ].focus();

					event.preventDefault();
				} else if ( key.match( /35|36/ ) ) {
					switch ( key ) {
						case '36':
							this.buttons[0].focus();
							break;
						case '35':
							this.buttons[ this.buttons.length - 1 ].focus();
							break;
					}

					event.preventDefault();
				}
			} else if ( ctrlModifier ) {
				this.articles.forEach( function ( panel, index ) {
					if ( panel.contains( target ) ) {
						this.buttons[index].focus();

						event.preventDefault();
					}
				} );
			}
		} );
		return this;
	}

	/**
	 * @summary Initialize the Shadow DOM and setup buttons and articles arrays.
	 *
	 * @since 0.1.0
	 *
	 * @returns {object} The accordion HTMLElement instance.
	 */
	constructor() {
		super();
		let shadowRoot = this.attachShadow( { mode: 'open' } );
		this.buttons = [];
		this.articles = [];

		return this;
	}


	/**
	 * @summary Render and set keyboard events when the element is added to the DOM. Re-render on updates to the childList.
	 *
	 * @since 0.1.0
	 *
	 * @returns {object} The accordion HTMLElement instance.
	 */
	connectedCallback() {
		const observeAndRender = new MutationObserver( mutations => this.render() );
		this.render();
		this.setKeybordEvents();
		observeAndRender.observe( this, { childList: true } );

		return this;
	}
} );
