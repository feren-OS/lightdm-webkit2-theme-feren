class Authentication {
	constructor() {
		this._userNameEl = document.querySelector('#userName');
		this._passwordInputEl = document.querySelector('#passwordInput');
		this._passwordInputBox = document.querySelector('#passwordInputBox');
		this._authenticateButton = document.querySelector('#authenticateButton');

		this._userName = '';
		this._password = '';

		this._init();
	}

	// Start authenticating and register events
	_init() {
		this._autologinTimerExpired();
		this._authenticationComplete();
		this._passwordInputOnKeyDownEvent();
		this._authenticateButtonOnClickEvent();
		this.startAuthentication();
	}

	// Start authenticating
	startAuthentication() {
		// Cancel authentication process of there's any
		lightdm.cancel_authentication();

		// Get selected user to authenticate
		this._userName = usersScreen._currentUser;
		lightdm.authenticate(this._userName);
	}

	// You failed to authenticate
	_authenticationFailed() {
		// New authentication session
		this.startAuthentication();

		// Clear passwordInput field
		this._passwordInputEl.value = '';

		// Shake the password prompt for an incorrect password
		$('#passwordInputContainer').effect("shake");
	}

	// You passed to authentication
	_authenticationSuccess() {
        _util.cache_set( sessionsScreen._defaultSession, 'user', this._userName, 'session' );
        // RIP Antergos
        $( 'body' ).fadeOut( 400, () => {
            lightdm.start_session_sync(sessionsScreen.getDefaultSession());
        } );
	}

	// Timer expired, create new authentication session
	_autologinTimerExpired() {
		window.autologin_timer_expired = () => {
			this.startAuthentication();
		};
	}

	// Authentication completed callback
	_authenticationComplete() {
		window.authentication_complete = () => {
			if (lightdm.is_authenticated) {
				this._authenticationSuccess();
			} else {
				this._authenticationFailed();
			}
		};
	}

	// Authenticate on button click
	_authenticateButtonOnClickEvent() {
		this._authenticateButton.addEventListener(
			'click',
			() => {
				// Save input value to variable
				this._password = this._passwordInputEl.value;
				// Validation
				lightdm.respond(String(this._password));
			}
		);
	}

	// Register keydown event
	_passwordInputOnKeyDownEvent() {
		this._passwordInputEl.onkeydown = (e) => {

			// Save input value to variable
			this._password = this._passwordInputEl.value;

			if (e.key === 'Enter') {				
				// Validate
				lightdm.respond(String(this._password));
			}
		};
	}
}

