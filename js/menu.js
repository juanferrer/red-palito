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
				$("#settings-menu")[0].style.visibility = "hidden";
				break;
			case "pause":
				$("#main-menu")[0].style.visibility = "hidden";
				$("#pause-menu")[0].style.visibility = "visible";
				$("#end-menu")[0].style.visibility = "hidden";
				$("#settings-menu")[0].style.visibility = "hidden";
				break;
			case "end":
				$("#main-menu")[0].style.visibility = "hidden";
				$("#pause-menu")[0].style.visibility = "hidden";
				$("#end-menu")[0].style.visibility = "visible";
				$("#settings-menu")[0].style.visibility = "hidden";
				break;
			case "settings":
				$("#main-menu")[0].style.visibility = "hidden";
				$("#pause-menu")[0].style.visibility = "hidden";
				$("#end-menu")[0].style.visibility = "hidden";
				$("#settings-menu")[0].style.visibility = "visible";
				break;

		}
		Menu.hideMobileController();
		Menu.hideUI();
		Menu.isShowingMenu = true;
	}

	/**
     * Hide menu if it's visible
     * @param {string} type
     */
	static hideMenu() {
		$("#main-menu")[0].style.visibility = "hidden";
		$("#pause-menu")[0].style.visibility = "hidden";
		$("#end-menu")[0].style.visibility = "hidden";
		$("#settings-menu")[0].style.visibility = "hidden";
		Menu.isShowingMenu = false;
	}

	static showUI() {
		/*$("#wave-number").show();
		$("#hp-bar").show();
		$("#current-weapon-stats").show();*/
		$(".gui-hud").show();
		$("canvas").css("filter", "blur(0px)");
		$("canvas").css("transform", "scale(1");
	}

	static hideUI() {
		/*$("#wave-number").hide();
		$("#hp-bar").hide();
		$("#current-weapon-stats").hide();*/
		$(".gui-hud").hide();
		$("canvas").css("filter", "blur(3px)");
		$("canvas").css("transform", "scale(1.03");
	}

	static showMobileController() {
		if ($("#mobile-controller").css("display") === "none") {
			$("#mobile-controller").css("display", "flex");
		}
	}

	static hideMobileController() {
		if ($("#mobile-controller").css("display") !== "none") {
			$("#mobile-controller").css("display", "none");
		}
	}

	static showLowHPBackdrop() {
		if ($("#low-hp-backdrop").css("display") === "none") {
			$("#low-hp-backdrop").css("display", "flex");
			$("#low-hp-veins").css("display", "flex");
		}
	}

	static hideLowHPBackdrop() {
		if ($("#low-hp-backdrop").css("display") !== "none") {
			$("#low-hp-backdrop").css("display", "none");
			$("#low-hp-veins").css("display", "none");
		}
	}
}

Menu.isShowingMenu = false;
Menu.isMainMenu = true;
