class Settings {
	constructor() {
		this._backgroundPath = '/usr/share/wallpapers/Anime/wallhaven-6k8kjx.png';
        
        this._use24hrClock = true;
	}
	
	getBG() {
        return this._backgroundPath;
    }
    
    getClock24hr() {
        return this._use24hrClock;
    }
}
