
(function () {
    const SETTINGS_KEY = "portfolioSettings";

    const defaultSettings = {
        theme: "light",
        visitorName: "",
        lastVisit: null
    };

    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem(SETTINGS_KEY);

            if (savedSettings === null) {
                return { ...defaultSettings };
            }

            const parsedSettings = JSON.parse(savedSettings);

            if (
                parsedSettings === null ||
                typeof parsedSettings !== "object" ||
                Array.isArray(parsedSettings)
            ) {
                return { ...defaultSettings };
            }

            return {
                theme:
                    parsedSettings.theme === "dark" ||
                    parsedSettings.theme === "light"
                        ? parsedSettings.theme
                        : defaultSettings.theme,

                visitorName:
                    typeof parsedSettings.visitorName === "string"
                        ? parsedSettings.visitorName
                        : defaultSettings.visitorName,

                lastVisit:
                    typeof parsedSettings.lastVisit === "string" ||
                    parsedSettings.lastVisit === null
                        ? parsedSettings.lastVisit
                        : defaultSettings.lastVisit
            };
        } catch (error) {
            return { ...defaultSettings };
        }
    }

    let settings = loadSettings();

    function saveSettings() {
        try {
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(settings)
            );
            return true;
        } catch (error) {
            console.error("Unable to save portfolio settings.", error);
            return false;
        }
    }

    // Apply the saved theme before the page is rendered.
    document.documentElement.setAttribute(
        "data-theme",
        settings.theme
    );

    // Record this visit while retaining the other settings.
    settings.lastVisit = new Date().toISOString();
    saveSettings();

    // Share settings functions with the other JavaScript file.
    window.portfolioSettings = {
        get() {
            return { ...settings };
        },

        update(changes) {
            if (
                changes.theme === "light" ||
                changes.theme === "dark"
            ) {
                settings.theme = changes.theme;
            }

            if (typeof changes.visitorName === "string") {
                settings.visitorName = changes.visitorName;
            }

            if (
                typeof changes.lastVisit === "string" ||
                changes.lastVisit === null
            ) {
                settings.lastVisit = changes.lastVisit;
            }

            return saveSettings();
        }
    };
})();
