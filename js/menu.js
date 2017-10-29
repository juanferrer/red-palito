/* globals $ */

class Menu {

	/**
    * Show menu if it's hidden
    * @param {string} type
    */
	static showMenu(type) {
		switch (type.toLowerCase()) {
			case "main":
				$("#main-menu")[0].style.visibility = "visible";
				$("#pause-menu")[0].style.visibility = "hidden";
				$("#end-menu")[0].style.visibility = "hidden";
				break;
			case "pause":
				$("#main-menu")[0].style.visibility = "hidden";
				$("#pause-menu")[0].style.visibility = "visible";
				$("#end-menu")[0].style.visibility = "hidden";
				break;
			case "end":
				$("#main-menu")[0].style.visibility = "hidden";
				$("#pause-menu")[0].style.visibility = "hidden";
				$("#end-menu")[0].style.visibility = "visible";
				break;
		}
		Menu.isShowingMenu = true;
	}

	/**
     * Hide menu if it's visible
     * @param {string} type
     */
	static hideMenu() {
		$("#main-menu")[0].style.visibility = "hidden";
		$("#pause-menu")[0].style.visibility = "hidden";
		Menu.isShowingMenu = false;
	}
}

Menu.isShowingMenu = false;
Menu.isMainMenu = true;
