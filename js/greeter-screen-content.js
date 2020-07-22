class GreeterScreenContent {
	constructor() {
		this._clockEl = document.querySelector('#clock');

		this._init();
	}

	// Start clock
	_init() {
		this._startClock();
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
		let hour = date.getHours();
		let min = date.getMinutes();
		let midDay = 'AM';

		midDay = (hour >= 12) ? 'PM' : 'AM';
		hour = (hour === 0) ? 12 : ((hour > 12) ? (hour - 12) : hour);

		hour = this._appendZero(hour);
		min = this._appendZero(min);

		// Update clock id element
		this._clockEl.innerText = `${hour}:${min} ${midDay}` ;
	}

	_startClock() {
		this._setTime = this._setTime.bind(this);
		
		this._setTime();
		setInterval(this._setTime, 1000);
	}
}
