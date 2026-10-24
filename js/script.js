
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. NAVIGATION TOGGLE
    // ==========================================

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


    // ==========================================
    // 2. DARK MODE
    // ==========================================

    const themeToggle = document.querySelector("#theme-toggle");
    const html = document.documentElement;

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
        themeToggle.addEventListener("click", function () {
            const isDark = html.getAttribute("data-theme") === "dark";

            if (isDark) {
                html.removeAttribute("data-theme");
            } else {
                html.setAttribute("data-theme", "dark");
            }

            updateThemeButton();
        });

        updateThemeButton();
    }


    // ==========================================
    // 3. DYNAMIC PROJECT CONTENT
    // ==========================================

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
                const projectCard = document.createElement("article");
                const projectTitle = document.createElement("h3");
                const projectDescription = document.createElement("p");
                const projectCategory = document.createElement("p");

                projectCard.classList.add("card");

                projectTitle.textContent = project.title;
                projectDescription.textContent = project.description;
                projectCategory.textContent =
                    "Category: " + project.category;

                projectCard.append(
                    projectTitle,
                    projectDescription,
                    projectCategory
                );

                projectContainer.appendChild(projectCard);
            });
        }
    }


    // ==========================================
    // 4. CONTACT FORM VALIDATION
    // ==========================================

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

        // Ensure required elements exist before validating.
        const formElementsExist = fields.every(function (field) {
            return field.input && field.error;
        });

        if (formElementsExist) {
            contactForm.addEventListener("submit", function (event) {
                event.preventDefault();

                // Clear previous errors.
                fields.forEach(function (field) {
                    field.error.textContent = "";
                    field.input.removeAttribute("aria-invalid");
                });

                let isValid = true;

                // Validate name.
                if (nameInput.value.trim() === "") {
                    nameError.textContent = "Please enter your name.";
                    nameInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                // Validate email.
                const emailValue = emailInput.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (emailValue === "") {
                    emailError.textContent = "Please enter your email address.";
                    emailInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                } else if (!emailPattern.test(emailValue)) {
                    emailError.textContent =
                        "Please enter a valid email address.";
                    emailInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                // Validate message.
                if (messageInput.value.trim() === "") {
                    messageError.textContent = "Please enter your message.";
                    messageInput.setAttribute("aria-invalid", "true");
                    isValid = false;
                }

                // Stop if any field is invalid.
                if (!isValid) {
                    const firstInvalidField = fields.find(function (field) {
                        return field.input.getAttribute("aria-invalid") === "true";
                    });

                    if (firstInvalidField) {
                        firstInvalidField.input.focus();
                    }

                    return;
                }

                // Validation succeeded, but no message is sent.
                alert(
                    "Your information is valid, but your message has not been sent. Please connect a submission service."
                );
            });
        }
    }

});
