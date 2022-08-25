    function changeTheme(theme = "furret") {
			const root = document.querySelector(':root');
			const setVariables = vars => Object.entries(vars).forEach(v => root.style.setProperty(v[0], v[1]));
      localStorage.setItem('theme', theme)
      switch (theme) {
				case "furret":
					document.documentElement.style.setProperty('--primary-1', '#f3f3f3');
					document.documentElement.style.setProperty('--primary-2', '#e3e3e3');
					document.documentElement.style.setProperty('--primary-3', '#bfbfbf');
					document.documentElement.style.setProperty('--accent-1', '#59a6b8');
					document.documentElement.style.setProperty('--accent-2', '#107fae');
					document.documentElement.style.setProperty('--accent-3', '#0c6388');
					document.documentElement.style.setProperty('--background-1', '#41405c');
					document.documentElement.style.setProperty('--background-2p5', '#302f46');
					document.documentElement.style.setProperty('--background-2', '#272639');
					document.documentElement.style.setProperty('--background-3', '#14131e');
					document.documentElement.style.setProperty('--highlight-color', 'rgba(15,154,210,.8);');
					document.documentElement.style.setProperty('--marked-color', 'rgba(68,50,100,.8);');
					document.documentElement.style.setProperty('--selection-color', 'rgba(15,154,210,.2);');
					document.documentElement.style.setProperty('--date-icon-filter', 'invert(87%) sepia(35%) saturate(1833%) hue-rotate(161deg) brightness(77%) contrast(83%);');
					return "Set Variables to FurretCSS!"
					break;
				case "discord":
					document.documentElement.style.setProperty('--primary-1', '#f3f3f3');
					document.documentElement.style.setProperty('--primary-2', '#e3e3e3');
					document.documentElement.style.setProperty('--primary-3', '#bfbfbf');
					document.documentElement.style.setProperty('--accent-1', '#5663F7');
					document.documentElement.style.setProperty('--accent-2', '#5865F2');
					document.documentElement.style.setProperty('--accent-3', '#404EED');
					document.documentElement.style.setProperty('--background-1', '#A6A7AB');
					document.documentElement.style.setProperty('--background-2p5', '#212326');
					document.documentElement.style.setProperty('--background-2', '#2F3136');
					document.documentElement.style.setProperty('--background-3', '#36393F');
					document.documentElement.style.setProperty('--highlight-color', 'rgba(15,154,210,.8);');
					document.documentElement.style.setProperty('--marked-color', 'rgba(68,50,100,.8);');
					document.documentElement.style.setProperty('--selection-color', 'rgba(15,154,210,.2);');
					document.documentElement.style.setProperty('--date-icon-filter', 'invert(87%) sepia(35%) saturate(1833%) hue-rotate(161deg) brightness(77%) contrast(83%);');
					return "Set Variables to Discord!"
					break;
				case "replit":
					document.documentElement.style.setProperty('--primary-1', '#f3f3f3');
					document.documentElement.style.setProperty('--primary-2', '#e3e3e3');
					document.documentElement.style.setProperty('--primary-3', '#bfbfbf');
					document.documentElement.style.setProperty('--accent-1', '#0079F2');
					document.documentElement.style.setProperty('--accent-2', '#0053A6');
					document.documentElement.style.setProperty('--accent-3', '#004182');
					document.documentElement.style.setProperty('--background-1', '#3C445C');
					document.documentElement.style.setProperty('--background-2p5', '#2B3245');
					document.documentElement.style.setProperty('--background-2', '#1C2333');
					document.documentElement.style.setProperty('--background-3', '#0E1525');
					document.documentElement.style.setProperty('--highlight-color', 'rgba(15,154,210,.8);');
					document.documentElement.style.setProperty('--marked-color', 'rgba(68,50,100,.8);');
					document.documentElement.style.setProperty('--selection-color', 'rgba(15,154,210,.2);');
					document.documentElement.style.setProperty('--date-icon-filter', 'invert(87%) sepia(35%) saturate(1833%) hue-rotate(161deg) brightness(77%) contrast(83%);');
					return "Set Variables to Replit!"
					break;
				}
    }

	let nav = document.getElementById("nav");
	let navi = document.getElementById("navitems");

nav.style.width = "200px";
function togglenav() {
	let dw = "200px!important";
	let cw = "46px!important"

	if (nav.style.width == "200px") {
		nav.style.width = "46px";
		navi.style.display = "none";
	} else {
		nav.style.width = "200px";
		navi.style.display = "flex";
	}
}

(async () => {
	let downloadapp = document.getElementById("downloadapp");

	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf(' electron/') > -1) {
		downloadapp.style.display = "none"
	}
  changeTheme(localStorage.getItem('theme'))
})()

const ThemeSelector = document.getElementById("ThemeSwitchSelectMenu")
ThemeSelector.addEventListener("change", (e) => { // no work because the id isn't there idot LMAO
  changeTheme(e.target.options[e.target.options.selectedIndex].id)
})