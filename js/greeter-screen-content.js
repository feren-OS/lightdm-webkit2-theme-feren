class GreeterScreenContent {
	constructor() {
		this._clockEl = document.querySelector('#clock');
		this._backgroundThing = document.querySelector('.bodyOverlay');

		this._init();
	}

	// Change BG and start clock
	_init() {
        this.changeBG();
		this._startClock();
	}
	
	changeBG() {
        // Get the current image
        var settingsBG = customSettings.getBG();
        if (Boolean(settingsBG) === false) {
            settingsBG = "/usr/share/wallpapers/(20.04) Default.png";
        }
        // Create dummy image
        let dummyImg = document.createElement('img');

        // Set the src of dummyImg
        dummyImg.src = settingsBG;

        dummyImg.onload = () => {
            this._backgroundThing.style.backgroundImage = `url('${dummyImg.src}')`;
        };
    }

	// Append zero
	_appendZero(k) {
		// Append 0 before time elements if less hour's than 10
		if (k < 10) {
			return '0' + k;
		} else {
			return k;
		}
	}

	// Set time
	_setTime() {
		const date = new Date();
        const use24hr = customSettings.getClock24hr();
		let hour = date.getHours();
		let min = date.getMinutes();
		let midDay = 'AM';

		midDay = (hour >= 12) ? 'PM' : 'AM';
        if (use24hr === true) {
            hour = hour;
        } else {
            hour = (hour === 0) ? 12 : ((hour > 12) ? (hour - 12) : hour);
        }

		hour = this._appendZero(hour);
		min = this._appendZero(min);

		// Update clock id element
        if (use24hr === true) {
            this._clockEl.innerText = `${hour}:${min}` ;
        } else {
            this._clockEl.innerText = `${hour}:${min} ${midDay}` ;
        }
	}

	_startClock() {
		this._setTime = this._setTime.bind(this);
		
		this._setTime();
		setInterval(this._setTime, 1000);
	}
}
