class Settings {
	constructor() {
		this._backgroundPath = '/usr/share/wallpapers/The Original/(The Original) wallpaper 79 origami by Zpecter.jpg';
        
        this._use24hrClock = true;
	}
	
	getBG() {
        return this._backgroundPath;
    }
    
    getClock24hr() {
        return this._use24hrClock;
    }
}
