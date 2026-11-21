(function () {
    "use strict";

    const SETTINGS_KEY = "portfolioSettings";
    const DEFAULT_SETTINGS = {
        theme: "light",
        visitorName: "",
        lastVisit: null
    };

    function loadSettings() {
        try {
            const storedValue = window.localStorage.getItem(SETTINGS_KEY);

            if (storedValue === null) {
                return { ...DEFAULT_SETTINGS };
            }

            const parsed = JSON.parse(storedValue);

            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                return { ...DEFAULT_SETTINGS };
            }

            return {
                theme: parsed.theme === "dark" ? "dark" : "light",
                visitorName: typeof parsed.visitorName === "string"
                    ? parsed.visitorName
                    : "",
                lastVisit: typeof parsed.lastVisit === "string"
                    ? parsed.lastVisit
                    : null
            };
        } catch (error) {
            console.warn("Could not load saved portfolio settings. Defaults will be used.", error);
            return { ...DEFAULT_SETTINGS };
        }
    }

    let currentSettings = loadSettings();

    function saveSettings() {
        try {
            window.localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(currentSettings)
            );
            return true;
        } catch (error) {
            console.warn("Could not save portfolio settings.", error);
            return false;
        }
    }

    document.documentElement.setAttribute("data-theme", currentSettings.theme);

    window.portfolioSettings = {
        get: function () {
            return { ...currentSettings };
        },

        update: function (changes) {
            if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
                return false;
            }

            if (changes.theme === "light" || changes.theme === "dark") {
                currentSettings.theme = changes.theme;
            }

            if (typeof changes.visitorName === "string") {
                currentSettings.visitorName = changes.visitorName;
            }

            if (typeof changes.lastVisit === "string" || changes.lastVisit === null) {
                currentSettings.lastVisit = changes.lastVisit;
            }

            return saveSettings();
        }
    };
})();

