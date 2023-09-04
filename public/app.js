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

	changelogBackButton: GE("changelogbackbutton"),
	changelogsTitle: GE("changelogstitle"),
	changelogBox: GE("changelogbox"),

	root: document.documentElement,
}

const settings = {
	pwettyWainbowMode: false,
	theme: localStorage.getItem("theme") ?? "night",
	font: localStorage.getItem("font") ?? "JetBrains Mono",
	transitionTime: 1000,
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

const data = {
	themeKeys: null,
	themeValues: null,
	pageHistory: ["frontpage"],
	changelogs: null,
}

function randomHex() {
	return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
}

async function getThemes() {
	data.themes = await (await fetch("./themes.json")).json();
	adjustTheme(settings.theme);
}
function adjustTheme(theme) {
	if (!Object.keys(data.themes).includes(theme)) return;
	settings.theme = theme;
	data.themeKeys = Object.keys(data.themes[settings.theme]);
	data.themeValues = Object.values(data.themes[settings.theme]);
	scrambleColors(theme);
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
function entangleSlider(slider, input, storage) {
	slider.addEventListener("input", function(event) {
		input.value = slider.value;
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
		localStorage.setItem(storage, slider.value);
	});
	input.addEventListener("change", function(event) {
		input.value = slider.value;
		input.classList.remove("redtext");
	});
}

entangleSlider(e.sfxVolumeSlider, e.sfxVolumeInput, "sfxvolume");
entangleSlider(e.musicVolumeSlider, e.musicVolumeInput, "musicvolume");

// when you change the theme bars, save it and swap the theme out
e.themeSelector.addEventListener("change", function(event) {
	adjustTheme(event.target.value);
	localStorage.setItem("theme", event.target.value);
});

e.fontSelector.addEventListener("change", function(event) {
	e.root.style.setProperty("--font", event.target.value);
	localStorage.setItem("font", event.target.value);
	settings.font = event.target.value;
});
e.root.style.setProperty("--font", settings.font);

// create changelogs for the game
data.changelogs = [
    [
        {
            "metadata": "Commit Title/Short Explanation",
            "classes": ["changelogbasic", "changelogheader"],
            "content": ["Options Menu"]
        },
        {
            "metadata": "1st commit",
            "classes": ["changelogbasic", "changelogbody"],
            "content": [
				"Created an options menu for the game. Includes:",
				"- Sound/SFX volume controls",
				"- Transition time control",
				"- Theme color and font control"
			]
        }
    ],
    [
        {
            "metadata": "Commit Title/Short Explanation",
            "classes": ["changelogbasic", "changelogheader"],
            "content": ["Changelogs"]
        },
        {
            "metadata": "1st commit",
            "classes": ["changelogbasic", "changelogbody"],
            "content": ["Created a menu for the game's changelogs with basic functionality"]
        }
    ]
];

function createLogs() {
	for (let v of data.changelogs) {
		for (let c of v) {
			const node = document.createElement("p");
			for (let i of c.content) {
				const textnode = document.createTextNode(i);
				node.appendChild(textnode);
				node.appendChild(document.createElement("br"))
			}
			for (let i of c.classes) {
				node.classList.add(i);
			}
			e.changelogBox.appendChild(node);
		}
	}
}
createLogs();
