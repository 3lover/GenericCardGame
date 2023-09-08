"use strict";
// im so sick of typing get element by id. time to commit war crimes
const GE = function(id) {
	return document.getElementById(id);
};

const e = {
	frontPageTitle: GE("frontpagetitle"),
	optionsCard: GE("optionscard"),
	playAGameCard: GE("playagamecard"),
	changelogsCard: GE("changelogscard"),

	infoButton: GE("infobutton"),
	infoText: GE("infotext"),
	infoBackButton: GE("infobackbutton"),

	optionsBox: GE("optionsbox"),
	optionsBackButton: GE("optionsbackbutton"),
	optionsTitle: GE("optionstitle"),
	sfxVolumeInput: GE("sfxvolumeinput"),
	sfxVolumeSlider: GE("sfxvolumeslider"),
	musicVolumeInput: GE("musicvolumeinput"),
	musicVolumeSlider: GE("musicvolumeslider"),
	themeSelector: GE("themeselector"),
	fontSelector: GE("fontselector"),
	transitionInput: GE("transitioninput"),
	transitionSlider: GE("transitionslider"),

	changelogBackButton: GE("changelogbackbutton"),
	changelogsTitle: GE("changelogstitle"),
	changelogBox: GE("changelogbox"),

	gameFinderMenu: GE("gamefindermenu"),
	gameFinderBackButton: GE("gamefinderbackbutton"),
	gameFinderTitle: GE("gamefindertitle"),
	gameFinderFilterButton: GE("gamefinderfilterbutton"),
	filterHolder: GE("filterholder"),

	root: document.documentElement,
}

const settings = {
	pwettyWainbowMode: false,
	theme: localStorage.getItem("theme") ?? "night",
	font: localStorage.getItem("font") ?? "JetBrains Mono",
	transitionTime: localStorage.getItem("transitiontime") ?? 1000,
	sfxVolume: localStorage.getItem("sfxvolume") ?? 50,
	musicVolume: localStorage.getItem("musicvolume") ?? 50,
}
/* indicators that use these values get set */
e.musicVolumeInput.value = settings.musicVolume;
e.sfxVolumeInput.value = settings.sfxVolume;
e.musicVolumeSlider.value = settings.musicVolume;
e.sfxVolumeSlider.value = settings.sfxVolume;
e.themeSelector.value = settings.theme;
e.fontSelector.value = settings.font;
e.transitionInput.value = settings.transitionTime;
e.transitionSlider.value = settings.transitionTime;

const data = {
	themedata: null,
	fonts: null,
	themes: null,
	themeKeys: null,
	themeValues: null,
	pageHistory: ["frontpage"],
	changelogs: null,
}

function randomHex() {
	return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
}

async function getThemes() {
	data.themedata = await (await fetch("./themes.json")).json();
	data.themes = data.themedata.themes;
	data.fonts = data.themedata.fonts;
	adjustTheme(settings.theme);
	adjustFont(settings.font);
	transition("frontpage", true);
}
function adjustTheme(theme) {
	if (!Object.keys(data.themes).includes(theme)) return;
	settings.theme = theme;
	data.themeKeys = Object.keys(data.themes[settings.theme]);
	data.themeValues = Object.values(data.themes[settings.theme]);
	scrambleColors(theme);
}
function adjustFont(font) {
	if (!Object.keys(data.fonts).includes(font)) return;
	settings.font = font;
	e.root.style.setProperty("--font", data.fonts[font]);
}
getThemes();

// a fun half easter egg if you spam click the title
let clickCount = 0;

function scrambleColors(theme = "pwetty") {
	for (let i = 0; i < data.themeKeys.length; i++) {
		e.root.style.setProperty(data.themeKeys[i], theme === "pwetty" ? randomHex() : data.themeValues[i]);
	}
}

e.frontPageTitle.addEventListener("click", function() {
	clickCount++;
	if (clickCount < 10) return;
	e.frontPageTitle.style.color = randomHex();
	if (clickCount < 20) return;
	scrambleColors();
	if (clickCount < 30) return;
	e.frontPageTitle.style.color = "var(--purewhite)";
	settings.pwettyWainbowMode = true;
	if (clickCount < 40) return;
	settings.pwettyWainbowMode = false;
	scrambleColors(settings.theme);
	clickCount = 0;
});

function pwettyWainbowChecker() {
	setTimeout(pwettyWainbowChecker, settings.pwettyWainbowMode ? 20 : 500);
	if (!settings.pwettyWainbowMode || data.themeKeys === null) return;
	scrambleColors();
}
pwettyWainbowChecker();

// preset transitions
function transition(type, state, removeHistory = false) {
	if (state && !data.pageHistory.includes(type)) data.pageHistory.push(type);
	else if (removeHistory) data.pageHistory.splice(data.pageHistory.indexOf(state), 1);
	switch(type) {
		case "frontpage": {
			if (state) {
				e.optionsCard.classList.remove("offpageTop");
				e.playAGameCard.classList.remove("offpageTop");
				e.changelogsCard.classList.remove("offpageTop");
			}
			e.frontPageTitle.classList[state ? "remove" : "add"]("offpageTop");
			e.optionsCard.classList[state ? "remove" : "add"]("offpageBottom");
			e.playAGameCard.classList[state ? "remove" : "add"]("offpageBottom");
			e.changelogsCard.classList[state ? "remove" : "add"]("offpageBottom");
			e.infoButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			break;
		}
		case "infopage": {
			e.infoText.classList[state ? "remove" : "add"]("offpageBottom");
			e.infoBackButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			break;
		}
		case "optionspage": {
			e.optionsBox.classList[state ? "remove" : "add"]("offpageBottom");
			e.optionsBackButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			e.optionsTitle.classList[state ? "remove" : "add"]("offpageTop");
			break;
		}
		case "playagamepage": {
			e.gameFinderBackButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			e.gameFinderTitle.classList[state ? "remove" : "add"]("offpageTop");
			e.gameFinderMenu.classList[state ? "remove" : "add"]("offpageBottom");
			e.gameFinderFilterButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			if (!state) {
				e.gameFinderMenu.style.height = "60vmin";
				e.filterHolder.classList.add("offpageBottom");
				filtering = false;
			}
			break;
		}
		case "changelogspage": {
			e.changelogBox.classList[state ? "remove" : "add"]("offpageBottom");
			e.changelogsTitle.classList[state ? "remove" : "add"]("offpageTop");
			e.changelogBackButton.classList[state ? "remove" : "add"]("slightOffpageTop");
			break;
		}
		default: {
			alert("unknown transition type sent");
			console.error("unknown transition type sent");
			break;
		}
	}
}

// when a button with the backbutton class is pressed, return to the last page in our history
function backAPage() {
	if (data.pageHistory.length <= 1) return;
	transition(data.pageHistory[data.pageHistory.length - 1], false, true);
	transition(data.pageHistory[data.pageHistory.length - 1], true);
}

const backButtons = document.getElementsByClassName("backbutton");
for (let button of backButtons)
button.addEventListener("click", function(event) {
	backAPage();
});

// clicking the front page cards and buttons

e.infoButton.addEventListener("click", function(event) {
	transition("frontpage", false);
	transition("infopage", true);
});


e.optionsCard.addEventListener("click", function(event) {
	transition("frontpage", false);
	transition("optionspage", true);
	e.optionsCard.classList.add("offpageTop");
});

e.playAGameCard.addEventListener("click", function(event) {
	transition("frontpage", false);
	transition("playagamepage", true);
	e.playAGameCard.classList.add("offpageTop");
});

e.changelogsCard.addEventListener("click", function(event) {
	transition("frontpage", false);
	transition("changelogspage", true);
	e.changelogsCard.classList.add("offpageTop");
});

// entangle the sliders and their inputs to each other
function entangleSlider(slider, input, storage, setting, step = 1, callback = () => {}) {
	slider.addEventListener("input", function(event) {
		input.value = Math.round(slider.value/step) * step;
		setting = slider.value;
		callback(setting);
	});
	slider.addEventListener("change", function(event) {
		input.value = slider.value = Math.round(slider.value/step) * step;
		localStorage.setItem(storage, slider.value);
	});
	input.addEventListener("input", function(event) {
		let ifloat = parseFloat(input.value);
		if (isNaN(ifloat)) {
			input.classList.add("redtext");
			return;
		}
		else input.classList.remove("redtext");
		if (ifloat > slider.max || ifloat < slider.min)
			input.value = Math.min(Math.max(slider.min, parseFloat(input.value)), slider.max);
		slider.value = input.value;
		setting = slider.value;
		callback(setting);
	});
	input.addEventListener("change", function(event) {
		input.value = slider.value;
		input.classList.remove("redtext");
		localStorage.setItem(storage, slider.value);
	});
}

entangleSlider(e.sfxVolumeSlider, e.sfxVolumeInput, "sfxvolume");
entangleSlider(e.musicVolumeSlider, e.musicVolumeInput, "musicvolume");
entangleSlider(e.transitionSlider, e.transitionInput, "transitiontime", settings.transitionTime, 50, function(transitionTime) {
	settings.transitionTime = transitionTime;
	e.root.style.setProperty("--transition-time", `${settings.transitionTime}ms`);
});
e.root.style.setProperty("--transition-time", `${settings.transitionTime}ms`);

// when you change the theme bars, save it and swap the theme out
e.themeSelector.addEventListener("change", function(event) {
	adjustTheme(event.target.value);
	localStorage.setItem("theme", event.target.value);
});

e.fontSelector.addEventListener("change", function(event) {
	adjustFont(event.target.value);
	localStorage.setItem("font", event.target.value);
	settings.font = event.target.value;
});

// when you press the filter button on the finder menu, shrink the menu down to make way for buttons
let filtering = false;
e.gameFinderFilterButton.addEventListener("click", function(event) {
	filtering = !filtering;
	if (filtering) {
		e.gameFinderMenu.style.height = "40vmin";
		e.filterHolder.classList.remove("offpageBottom");
		return;
	}

	e.gameFinderMenu.style.height = "60vmin";
	e.filterHolder.classList.add("offpageBottom");
});

// create changelogs for the game
async function createLogs() {
	data.changelogs = await (await fetch("./changelogs.json")).json();
	const date = new Date();
	const dateformat = String(date.getMonth() + 1) + "/" + String(date.getDate()) + "/" + String(date.getFullYear());
	for (let v of data.changelogs) {
		for (let c of v) {
			const node = document.createElement("p");
			if (c.date && c.date === dateformat) node.classList.add("highlight");
			for (let i of c.content) {
				const textnode = document.createTextNode(i);
				node.appendChild(textnode);
				node.appendChild(document.createElement("br"));
			}
			for (let i of c.classes) {
				node.classList.add(i);
			}
			e.changelogBox.appendChild(node);
		}
	}
}
createLogs();
