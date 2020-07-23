function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class PowerScreen {
	constructor() {
		this._powerObject = [];

		this._powerScreen = document.querySelector('#powerScreen');
		this._powerList = document.querySelector('.powerList');
		this._powerButtonPanel = document.querySelector('#powerButtonsPanel');
		this._powerScreenButton = document.querySelector('#powerScreenButton');
		this._backButton = document.querySelector('#topbackAScreenButton');

		this._powerScreenVisible = false;
        
        $("#powerScreen").fadeOut(0);
        $("#topbackAScreenButton").fadeOut(0);

		this._init();
	}

	_init() {
		this._createPowerObject();
		this._powerScreenButtonOnClickEvent();
		this._backButtonOnClickEvent();
	}

	_powerScreenButtonOnClickEvent() {
		this._powerScreenButton.addEventListener(
			'click',
			() => {
				this.togglePowerScreen();
			}
		);
	}
	_backButtonOnClickEvent() {
		this._backButton.addEventListener(
			'click',
				() => {
				// Toggle back action
				this.togglePowerScreen();
			}
		);
	}

	// Return power screen visibility bool
	// Global
	getPowerScreenVisibility() {
		return this._powerScreenVisible;
	}

	// Show session screen
	showPowerScreen() {
        this._powerScreen.style.display = "block";
        sleep(5).then(() => {
		this._powerScreen.classList.add('powerScreenShow');
		this._powerScreenVisible = true;
        $("#topbackAScreenButton").fadeIn(200);
        });
	}

	// Hide session screen
	hidePowerScreen() {
        $("#topbackAScreenButton").fadeOut(100);
		this._powerScreen.classList.remove('powerScreenShow');
        sleep(410).then(() => {
		this._powerScreenVisible = false;
        this._powerScreen.style.display = "none";
        });
	}

	// Toggle session screen
	togglePowerScreen() {
		if (this._powerScreen.classList.contains('powerScreenShow')) {
			this.hidePowerScreen();
		} else {
			this.showPowerScreen();
		}
	}

	_disableWindowPropagation() {
		window.addEventListener('keydown',  this._stopPropagation, true);
		window.addEventListener('keyup',    this._stopPropagation, true);
		window.addEventListener('keypress', this._stopPropagation, true);
	}

	_enableWindowPropagation() {
		window.removeEventListener('keydown',  this._stopPropagation, true);
		window.removeEventListener('keyup',    this._stopPropagation, true);
		window.removeEventListener('keypress', this._stopPropagation, true);
	}

	_createPowerObject() {
		this._powerObject = [
			{
				'name': 'Hibernate',
				'icon': 'hibernate',
				'enabled': lightdm.can_hibernate,
				'powerCommand': lightdm.hibernate,
				'message': 'Hibernating...'
			},
			{
				'name': 'Sleep',
				'icon': 'suspend',
				'enabled': lightdm.can_suspend,
				'powerCommand': lightdm.suspend,
				'message': 'Suspending...'
			},
			{
				'name': 'Reboot',
				'icon': 'restart',
				'enabled': lightdm.can_restart,
				'powerCommand': lightdm.restart,
				'message': 'Rebooting...'
			},
			{
				'name': 'Shutdown',
				'icon': 'shutdown',
				'enabled': lightdm.can_shutdown,
				'powerCommand': lightdm.shutdown,
				'message': 'Shutting down...'
			}
		];

		// Create power button list
		this._createPowerList();
	}


	_executePowerCallback(callback) {
        this._enableWindowPropagation();
        callback();
	}

	_powerItemOnClickEvent(item, powerObj) {
		item.addEventListener(
			'click',
			() => {
				// Hide power screen
				this.hidePowerScreen();

				// Disable keydown events temporarily
				this._disableWindowPropagation();
                
                $( 'body' ).fadeOut( 400, () => {
				// Execute power command
				this._executePowerCallback(powerObj.powerCommand);
                });
                sleep(5000).then(() => {
                location.reload();
                });
			}
		);
	}

	_createPowerList() {
		// Generate session list
		for (let i = 0; i < this._powerObject.length; i++) {

			// If disabled, don't create a button for it
			const powerCommandEnabled = this._powerObject[parseInt(i, 10)].enabled;
			if (powerCommandEnabled) {

			// Get object element data
			const powerName = this._powerObject[parseInt(i, 10)].name;
			const powerCommand =  this._powerObject[parseInt(i, 10)].powerCommand;
			const powerIcon = this._powerObject[parseInt(i, 10)].icon;
			const powerMessage = this._powerObject[parseInt(i, 10)].message;

			// Create item
			let powerItem = document.createElement('button');
			powerItem.className = 'powerItem';
			powerItem.id = `${powerName.toLowerCase()}PowerButton`;
// 			powerItem.insertAdjacentHTML(
// 				'beforeend',
// 				`
// 				<div id='powerItemIconContainer'>
// 					<img id='powerItemIcon' draggable='false' src='assets/power/${powerIcon}.svg' 
// 					onerror='this.src="assets/power/shutdown.svg"'></img>
// 				</div>
// 				<div id='powerItemName'>${powerName}</div>
// 				`
// 			);
            powerItem.insertAdjacentHTML(
				'beforeend',
				`
				<div id='powerItemIconContainer'>
					<img id='powerItemIcon' draggable='false' src='assets/power/${powerIcon}.svg' 
					onerror='this.src="assets/power/shutdown.svg"'></img>
				</div>
				`
			);

			// Create on click event
			this._powerItemOnClickEvent(powerItem, this._powerObject[parseInt(i, 10)]);

			// Append to item
			this._powerList.appendChild(powerItem);
            }
		}
		// Set width of thing
        $('.powerList').width(168 * this._powerList.childElementCount);
	}
}
