function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class SessionsScreen {
	constructor() {
		this._localStorage = window.localStorage;

		this._sessionsScreen = document.querySelector('#sessionsScreen');
		this._sessionsList = document.querySelector('.sessionsList');
		this._sessionsScreenButton = document.querySelector('#sessionsScreenButton');
		this._sessionsButtonImage = document.querySelector('.sessionsButtonImage');

		this._sessionScreenVisible = false;

		this._defaultSession = null;
		this._sessionsObject = null;
		this._defaultSessionItem = null;
        
        $("#sessionsScreen").fadeOut(0);

		this._init();
	}

	// Start creating sessions list, register events
	_init() {
		this._sessionsScreenButtonOnClickEvent();

		// Add a delay before calling the lightdm object
		this._updateSessionObject();
	}

	// Register session button on clock event
	// Will open sessions screen
	_sessionsScreenButtonOnClickEvent() {
		this._sessionsScreenButton.addEventListener(
			'click',
				() => {
				// Toggle sessions screen
				this.toggleSessionsScreen();
			}
		);
	}

	// Return session screen visibility bool
	// Global
	getSessionsScreenVisibility() {
		return this._sessionScreenVisible;
	}

	// Show session screen
	showSessionsScreen() {
        this._sessionsScreen.style.display = "block";
        sleep(5).then(() => {
		this._sessionsScreen.classList.add('sessionsScreenShow');
		this._sessionScreenVisible = true;
        });
	}

	// Hide session screen
	hideSessionsScreen() {
		this._sessionsScreen.classList.remove('sessionsScreenShow');
        sleep(410).then(() => {
		this._sessionScreenVisible = false;
        this._sessionsScreen.style.display = "none";
        });
        
        // Give passwordInput focus
        document.querySelector('#passwordInput').focus();
	}

	// Toggle session screen
	toggleSessionsScreen() {
		if (this._sessionScreenVisible) {
			this.hideSessionsScreen();
		} else {
			this.showSessionsScreen();
		}
	}

	// Get lightdm sessions
	// Call function to create list
	_updateSessionObject() {
		this._sessionsObject = lightdm.sessions;
		this._createSessionList();
	}

	// Return default session, global.
	getDefaultSession() {
		return this._defaultSession;
	}

	// Update session list to select default
	_updateSessionItemDefault(item) {
		// Unselect the current item as and remove it as default
		if (this._defaultSessionItem) {
			this._defaultSessionItem.classList.remove('sessionItemDefault');
		}

		// Update the current item and select it as default
		this._defaultSessionItem = item;
		item.classList.add('sessionItemDefault');
	}

	// Update session button image
	_setSessionButtonImage(key) {
		// Update this session button image
		this._sessionsButtonImage.src = `assets/sessions/${key}.png`;
		this._sessionsButtonImage.onerror = () => {
			this._sessionsButtonImage.src = 'assets/sessions/unknown.png';
		};
	}

	// Set the default session for the selected user
	_setSessionListDefault(user) {
        this._defaultSession = _util.cache_get( 'user', user, 'session' )
        
        if ( null === this._defaultSession ) {
            // This user has never logged in before let's enable the system's default
            // session.
            this._defaultSession = lightdm.default_session || lightdm.sessions[0].key;
        }

		// Update session button image
		this._setSessionButtonImage(this._defaultSession);

		const defaultItemID = this._defaultSession + 'Session';
		const defaultSessionItem = document.querySelector(`#${defaultItemID}`);
		this._updateSessionItemDefault(defaultSessionItem);
	}

	// Session item click event
	_sessionItemOnClickEvent(item, key) {
		item.addEventListener(
			'click', 
			() => {
				// Save active session key to variable
				this._defaultSession = key;

				// Hide session screen
				this.hideSessionsScreen();

				// Update the selected session item
				this._updateSessionItemDefault(item);

				// Update session button image
				this._setSessionButtonImage(key);
			}
		);
	}
		
	// Create session list
	_createSessionList() {
		// Generate session list
		for (let i = 0; i < this._sessionsObject.length; i++) {

			const sessionName = this._sessionsObject[parseInt(i, 10)].name;
			const sessionKey = this._sessionsObject[parseInt(i, 10)].key;
			let sessionItem = document.createElement('button');

			sessionItem.className = 'sessionItem';
			sessionItem.id = `${sessionKey}Session`;
			sessionItem.insertAdjacentHTML(
				'beforeend',
				`
				<div id='sessionItemIconContainer'>
					<img id='sessionItemIcon' draggable='false' src='assets/sessions/${sessionKey}.png' 
					onerror='this.src="assets/sessions/unknown.png"'></img>
					<span id='sessionItemName'>${sessionName}</span>
				</div>
				`
			);
			// Create on click event
			this._sessionItemOnClickEvent(sessionItem, sessionKey);

			// Append to item
			this._sessionsList.appendChild(sessionItem);
		}
	}
}
