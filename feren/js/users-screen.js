function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class UsersScreen {
	constructor() {
		this._localStorage = window.localStorage;

		this._usersScreen = document.querySelector('#usersScreen');
		this._usersList = document.querySelector('.usersList');
		this._userNameLabel = document.querySelector('#userName');
		this._profilePicture = document.querySelector('#profilePicture');
		this._passwordInputEl = document.querySelector('#passwordInput');
		this._switchUsersButton = document.querySelector('#greeterScreenButton');

		this._userScreenVisible = false;

		this._usersObject = null;
		this._defaultUserItem = null;
        
		this._init();
        //Skip multiple users screen if there's only one user
        if (this._usersObject.length > 1) {
            this.toggleUsersScreen();
        } else {
            // Update variables
            this._updateProfileVariablesOnStartUp();
            this._currentUser = this._defaultUser;
            authentication.startAuthentication(this._currentUser);
            // Update profile pic and label
            this._setUserProfileImage(this._defaultUserProfileImage, this._defaultUserProfileImageFallback);
            this._setUserNameLabel(this._defaultUserDisplayName);
            // Set default session
            sessionsScreen._setSessionListDefault(this._defaultUser);
            // Hide Switch User button
            this._switchUsersButton.style.display = "none";
            document.querySelector('#mainFormContent').style.display = "flex";
            if (lightdm.sessions.length > 1) {
                document.querySelector('#sessionsScreenButton').style.display = "block";
            }
            // Give passwordInput focus
            this._passwordInputEl.focus();
        }
	}

	// Start creating Users list, register events
	_init() {
		this.profilePictureContainerOnClickEvent();

		this._updateUsersObject();
	}

	profilePictureContainerOnClickEvent() {
		this._switchUsersButton.addEventListener(
			'click',
			() => {
                // Clear passwordInput field
				this._passwordInputEl.value = '';
				// Toggle user screen
				this.toggleUsersScreen();
			}
		);
	}

	// Return session screen visibility bool
	// Global
	getUsersScreenVisibility() {
		return this._userScreenVisible;
	}

	// Return user name
	// Global
	getDefaultUserName() {
		return this._defaultUser;
	}

	// Show session screen
	showUsersScreen() {
		this._usersScreen.classList.add('usersScreenShow');
		this._userScreenVisible = true;
        // Reveal main screen items
        document.querySelector('#mainFormContent').style.display = "none";
        document.querySelector('#sessionsScreenButton').style.display = "none";
	}

	// Hide users screen
	hideUsersScreen() {
		this._usersScreen.classList.remove('usersScreenShow');
		this._userScreenVisible = false;
        // Reveal main screen items
        document.querySelector('#mainFormContent').style.display = "flex";
        if (lightdm.sessions.length > 1) {
            document.querySelector('#sessionsScreenButton').style.display = "block";
        }
	}

	// Toggle users screen
	toggleUsersScreen() {
		if (this._userScreenVisible) {
			this.hideUsersScreen();
		} else {
			this.showUsersScreen();
		}
	}

	// Update user profile image
	_setUserProfileImage(path, fallback) {
		// Update this session button image
		this._profilePicture.src = path;
		this._profilePicture.onerror = () => {
			this._profilePicture.src = fallback;
		};
	}

	// Update user name label
	_setUserNameLabel(name) {
		this._userNameLabel.innerText = name;
	}

	// User item click event
	_userItemOnClickEvent(userProfile) {
		userProfile.item.addEventListener(
			'click',
			() => {
				// Clear passwordInput field
				this._passwordInputEl.value = '';
                
                // For authentication
                this._currentUser = userProfile.userName;

				// Refresh authentication session
				authentication.startAuthentication(this._currentUser);

				// Update profile pic and label
				this._setUserProfileImage(userProfile.profileImage, userProfile.profileImageFallBack);
				this._setUserNameLabel(userProfile.displayName);
                
                // Set default session
                sessionsScreen._setSessionListDefault(userProfile.userName);
                
                // Reveal main screen items
                document.querySelector('#mainFormContent').style.display = "flex";
                if (lightdm.sessions.length > 1) {
                    document.querySelector('#sessionsScreenButton').style.display = "block";
                }

				// Hide user screen
				this.hideUsersScreen();
                
                // Give passwordInput focus
                this._passwordInputEl.focus();
			}
		);
	}

	_updateProfileVariablesOnStartUp() {
		this._defaultUser = this._usersObject[0].username;
		this._defaultUserDisplayName = this._usersObject[0].display_name;
		this._defaultUserProfileImage = this._usersObject[0].image;
		this._defaultUserProfileImageFallback = 'assets/profiles/user.png';
	}

	_updateUsersObject() {
		this._usersObject = lightdm.users;
        // Blacklist troublesome usernames to prevent code issues
        // Libvirt Qemu isn't meant to be a visible user, for instance.
        for (let i = 0; i < this._usersObject.length; i++){
            if (this._usersObject[parseInt(i, 10)].username === "libvirt-qemu") {
                //Splice removes the entry and pushes everything to close the hole made
                this._usersObject.splice(i, 1);
            }
        }
        
		this._createUsersList();
	}

	_createUsersList() {        
		// Generate user list
		for (let i = 0; i < this._usersObject.length; i++){
            // Create obj
            let userProfile = {
                'item': document.createElement('button'),
                'userName': this._usersObject[parseInt(i, 10)].username,
                'displayName': this._usersObject[parseInt(i, 10)].display_name,
                'profileImage': this._usersObject[parseInt(i, 10)].image,
                'profileImageFallBack': 'assets/profiles/user.png'
            };

            // Alias
            let userItem = userProfile.item;
            let userName = userProfile.userName;
            let userDisplayName = userProfile.displayName;
            let userProfileImage = userProfile.profileImage;
            let userProfileImageFallBack = userProfile.profileImageFallBack;

            userItem.className = 'userItem';
            userItem.id = `${userName}User`;

            userItem.insertAdjacentHTML(
                'beforeend',
                `
                <div id='userItemIconContainer'>
                    <img id='userItemIcon' draggable='false' src='${userProfileImage}' 
                    onerror='this.src="${userProfileImageFallBack}"'></img>
                </div>
                <div id='userItemName'>${userDisplayName}</div>
                `
            );
            
            // Create on click event
            this._userItemOnClickEvent(userProfile);

            // Append to item
            this._usersList.appendChild(userItem);
        }
        
        // Set width of thing
        $('.usersList').width(184 * this._usersList.childElementCount);
	}
}
