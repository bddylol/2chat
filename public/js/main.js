function togglenav() {
	let nav = document.getElementById("nav");
	let dw = "200px!important";
	let cw = "46px!important"

	if (nav.style.width == dw) {
		nav.style.width = cw
	} else {
		nav.style.width = dw
	}
}

(async () => {
	let downloadapp = document.getElementById("downloadapp");

	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf(' electron/') > -1) {
		downloadapp.style.display = "none"
	}

})()