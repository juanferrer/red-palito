let settings = JSON.parse(localStorage.getItem("settings") || "{}");

if (!settings.masterVolume) {
	settings = {
		masterVolume: 0.2,
		ambientVolume: 1,
		showBlood: false
	};
}
