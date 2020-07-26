class Settings {
	constructor() {
		this._backgroundPath = '';
        
        this._use24hrClock = true;
	}
	
	getBG() {
        return this._backgroundPath;
    }
    
    getClock24hr() {
        return this._use24hrClock;
    }
}
