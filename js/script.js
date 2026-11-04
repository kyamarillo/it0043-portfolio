
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const settings = window.portfolioSettings;
    const html = document.documentElement;

    const menuButton = document.querySelector("#menu-button");
    const navigationMenu = document.querySelector("#navigation-menu");

    if (menuButton && navigationMenu) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigationMenu.classList.toggle("show");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navigationMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigationMenu.classList.remove("show");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 2. Theme toggle
    const themeToggle = document.querySelector("#theme-toggle");

    function updateThemeButton() {
        const isDark = html.getAttribute("data-theme") === "dark";

        if (themeToggle) {
            themeToggle.textContent = isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

            themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );
        }
    }

    if (themeToggle) {
        updateThemeButton();

        themeToggle.addEventListener("click", function () {
            const currentTheme = html.getAttribute("data-theme");
            const nextTheme =
                currentTheme === "dark" ? "light" : "dark";

            html.setAttribute("data-theme", nextTheme);
            settings.update({ theme: nextTheme });

            updateThemeButton();
        });
    }

    const visitorNameInput = document.querySelector("#visitor-name");

    if (visitorNameInput) {
        visitorNameInput.value = settings.get().visitorName;

        visitorNameInput.addEventListener("change", function () {
            settings.update({
                visitorName: visitorNameInput.value.trim()
            });
        });
    }

    const previousVisit = settings.get().lastVisit;

    console.log("Previous visit:", previousVisit || "First visit");

    settings.update({
        lastVisit: new Date().toISOString()
    });

    const projects = [
        {
            title: "Portfolio Website",
            description: "A personal website created using HTML and CSS.",
            category: "Web Design"
        },
        {
            title: "Digital Illustration",
            description: "An original illustration created as an art project.",
            category: "Illustration"
        },
        {
            title: "Animation Project",
            description: "A short animation exploring movement and timing.",
            category: "Animation"
        }
    ];

    const projectContainer = document.querySelector("#project-container");

    if (projectContainer) {
        const validProjects = projects.filter(function (project) {
            return project &&
                typeof project.title === "string" &&
                project.title.trim() !== "" &&
                typeof project.description === "string" &&
                project.description.trim() !== "" &&
                typeof project.category === "string" &&
                project.category.trim() !== "";
        });

        if (validProjects.length === 0) {
            projectContainer.textContent = "No projects available yet.";
        } else {
            validProjects.forEach(function (project) {
                const card = document.createElement("article");
                const title = document.createElement("h3");
                const description = document.createElement("p");
                const category = document.createElement("p");

                card.classList.add("card");

                title.textContent = project.title;
                description.textContent = project.description;
                category.textContent = "Category: " + project.category;

                card.append(title, description, category);
                projectContainer.appendChild(card);
            });
        }
    }

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        const fields = [
            {
                input: document.querySelector("#name"),
                error: document.querySelector("#name-error"),
                message: "Please enter your name."
            },
            {
                input: document.querySelector("#email"),
                error: document.querySelector("#email-error"),
                message: "Please enter your email address."
            },
            {
                input: document.querySelector("#message"),
                error: document.querySelector("#message-error"),
                message: "Please enter your message."
            }
        ];

        const formStatus = document.querySelector("#form-status");

        if (fields.every(function (field) {
            return field.input && field.error;
        })) {
            contactForm.addEventListener("submit", function (event) {
                event.preventDefault();

                let isValid = true;

                fields.forEach(function (field) {
                    field.error.textContent = "";
                    field.input.removeAttribute("aria-invalid");
                });

                if (formStatus) {
                    formStatus.textContent = "";
                }

                fields.forEach(function (field) {
                    const value = field.input.value.trim();

                    if (value === "") {
                        field.error.textContent = field.message;
                        field.input.setAttribute("aria-invalid", "true");
                        isValid = false;
                    } else if (
                        field.input.type === "email" &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ) {
                        field.error.textContent =
                            "Please enter a valid email address.";

                        field.input.setAttribute("aria-invalid", "true");
                        isValid = false;
                    }
                });

                if (!isValid) {
                    const firstInvalidField = fields.find(function (field) {
                        return field.input.getAttribute("aria-invalid") === "true";
                    });

                    if (firstInvalidField) {
                        firstInvalidField.input.focus();
                    }

                    return;
                }

                if (formStatus) {
                    formStatus.textContent =
                        "Your information is valid, but your message has not been sent. Connect a submission service to receive messages.";
                }
            });
        }
    }
});
