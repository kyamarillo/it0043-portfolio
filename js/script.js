
document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.querySelector("#menu-button");
    const navigationMenu = document.querySelector("#navigation-menu");

    if (menuButton && navigationMenu) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigationMenu.classList.toggle("show");

            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navigationMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigationMenu.classList.remove("show");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    const themeToggle = document.querySelector("#theme-toggle");
    const html = document.documentElement;
    const settings = window.portfolioSettings;

    function updateThemeButton() {
        const isDark = html.getAttribute("data-theme") === "dark";

        if (themeToggle) {
            themeToggle.textContent = isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

            themeToggle.setAttribute("aria-pressed", String(isDark));
        }
    }

    if (themeToggle) {
        updateThemeButton();

        themeToggle.addEventListener("click", function () {
            const isDark = html.getAttribute("data-theme") === "dark";
            const newTheme = isDark ? "light" : "dark";

            html.setAttribute("data-theme", newTheme);

            if (settings) {
                settings.update({ theme: newTheme });
            }

            updateThemeButton();
        });
    }

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
        projectContainer.replaceChildren();

        const validProjects = projects.filter(function (project) {
            return (
                project &&
                typeof project.title === "string" &&
                project.title.trim() !== "" &&
                typeof project.description === "string" &&
                project.description.trim() !== "" &&
                typeof project.category === "string" &&
                project.category.trim() !== ""
            );
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
        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");

        const nameError = document.querySelector("#name-error");
        const emailError = document.querySelector("#email-error");
        const messageError = document.querySelector("#message-error");

        const fields = [
            { input: nameInput, error: nameError },
            { input: emailInput, error: emailError },
            { input: messageInput, error: messageError }
        ];

        const formIsComplete = fields.every(function (field) {
            return field.input && field.error;
        });

        if (formIsComplete) {
            contactForm.addEventListener("submit", function (event) {
                event.preventDefault();

                fields.forEach(function (field) {
                    field.error.textContent = "";
                    field.input.removeAttribute("aria-invalid");
                });

                let isValid = true;

                if (nameInput.value.trim() === "") {
                    nameError.textContent = "Please enter your name.";
                    nameInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                const email = emailInput.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (email === "") {
                    emailError.textContent =
                        "Please enter your email address.";
                    emailInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                } else if (!emailPattern.test(email)) {
                    emailError.textContent =
                        "Please enter a valid email address.";
                    emailInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                if (messageInput.value.trim() === "") {
                    messageError.textContent =
                        "Please enter your message.";
                    messageInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                if (!isValid) {
                    const firstInvalid = fields.find(function (field) {
                        return (
                            field.input.getAttribute("aria-invalid") === "true"
                        );
                    });

                    if (firstInvalid) {
                        firstInvalid.input.focus();
                    }

                    return;
                }

                alert(
                    "Your information is valid, but your message has not been sent. Please connect a submission service."
                );
            });
        }
    }

    const visitorNameInput = document.querySelector("#visitor-name");
    const visitorGreeting = document.querySelector("#visitor-greeting");

    if (visitorNameInput && settings) {
        const savedSettings = settings.get();

        visitorNameInput.value = savedSettings.visitorName;

        function updateGreeting() {
            const name = visitorNameInput.value.trim();

            if (visitorGreeting) {
                visitorGreeting.textContent = name
                    ? "Welcome back, " + name + "!"
                    : "Welcome to my portfolio!";
            }
        }

        updateGreeting();

        visitorNameInput.addEventListener("input", function () {
            settings.update({
                visitorName: visitorNameInput.value
            });

            updateGreeting();
        });
    }

});
