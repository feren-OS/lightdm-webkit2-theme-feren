/**
 * This should be the base class for all the theme's components. However, webkit's
 * support of extending (subclassing) ES6 classes is not stable enough to use.
 * For now we simply bind this class to a global variable for use in our other classes.
 */
class FerenThemeUtils {

	constructor() {
		this.debug = false;
		this.lang = window.navigator.language.split( '-' )[ 0 ].toLowerCase();
		this.$log_container = $('#logArea');
		this.recursion = 0;
		this.cache_backend = '';

		this.setup_cache_backend();

		return this;
	}

	setup_cache_backend() {
		// Do we have access to localStorage?
		try {
			localStorage.setItem('testing', 'test');
			let test = localStorage.getItem('testing');

			if ('test' === test) {
				// We have access to localStorage
				this.cache_backend = 'localStorage';
			}
			localStorage.removeItem('testing');

		} catch(err) {
			// We do not have access to localStorage. Fallback to cookies.
			console.log(err);
			console.log('INFO: localStorage is not available. Using cookies for cache backend.');
			this.cache_backend = 'Cookies';
		}

		// Just in case...
		if ('' === this.cache_backend) {
			this.cache_backend = 'Cookies';
		}

		console.log(`FerenThemeUtils.cache_backend is: ${this.cache_backend}`);
	}


	/**
	 * Get a key's value from localStorage. Keys can have two or more parts.
	 * For example: "feren:user:john:session".
	 *
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_get() {
		var key = `feren`, value;

		for (var _len = arguments.length, key_parts = new Array(_len), _key = 0; _key < _len; _key++) {
			key_parts[_key] = arguments[_key];
		}

		for ( var part of key_parts ) {
			key += `:${part}`;
		}

		console.log(`cache_get() called with key: ${key}`);

		if ('localStorage' === this.cache_backend) {
			value = localStorage.getItem(key);
		} else if ('Cookies' === this.cache_backend) {
			value = Cookies.get(key);
		} else {
			value = null;
		}

		if (null !== value) {
			console.log(`cache_get() key: ${key} value is: ${value}`);
		}

		return ('undefined' !== typeof(value)) ? value : null;
	}


	/**
	 * Set a key's value in localStorage. Keys can have two or more parts.
	 * For example: "feren:user:john:session".
	 *
	 * @param {string} value - The value to set.
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_set( value ) {
		var key = `feren`, res;

		for (var _len2 = arguments.length, key_parts = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			key_parts[_key2 - 1] = arguments[_key2];
		}

		for ( var part of key_parts ) {
			key += `:${part}`;
		}
		console.log(`cache_set() called with key: ${key} and value: ${value}`);

		if ('localStorage' === this.cache_backend) {
			res = localStorage.setItem( key, value );
		} else if ('Cookies' === this.cache_backend) {
			res = Cookies.set(key, value);
		} else {
			res = null;
		}

		return res;
	}

	is_not_empty( value ) {
		let empty_values = [null, 'null', undefined, 'undefined'];
		return empty_values.findIndex(v => v === value) === -1;
	}
}
