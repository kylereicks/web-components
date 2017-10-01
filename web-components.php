<?php
/*
 * Plugin Name: Web Components
 * Plugin URI: https://github.com/kylereicks/web-components
 * Description: Web components
 * Version: 0.1.0
 * Author: Kyle Reicks
 * Author URI: https://github.com/kylereicks/
*/
namespace WebComponents;

if ( ! defined( 'WPINC' ) ) {
	die;
}

define( __NAMESPACE__ . '\VERSION', '0.1.0' );

add_action( 'init', __NAMESPACE__ . '\register_admin_scripts_and_styles' );

/**
 * Register scripts and styles.
 *
 * @since 0.1.0
 */
function register_admin_scripts_and_styles() {
	wp_register_script( 'web-component-accordion', plugins_url( 'web-components/components/accordion/component.js' ), array(), \WebComponents\VERSION, false );
	/*
	<?php wp_enqueue_script( 'web-component-accordion' ); ?>
	<component-accordion allow-all-open allow-all-closed>
		<section expanded>
			<button>Accordion Header</button>
			<article>
				<h2>Content Header</h2>
				<p>Content Content 1</p>
			</article>
		</section>
		<section>
			<button>Accordion Header 2</button>
			<article>
				<h2>Content Header</h2>
				<p>Content Content 2</p>
			</article>
		</section>
		<section>
			<button>Accordion Header 3</button>
			<article>
				<h2>Content Header</h2>
				<p>Content Content 3</p>
			</article>
		</section>
	</component-accordion>
	*/
}
