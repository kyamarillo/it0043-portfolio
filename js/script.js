document.addEventListener("DOMContentLoaded", function () {
    "use strict";

const welcomeScreen = document.getElementById("welcome-screen");
const enterButton = document.getElementById("enter-portfolio");

if (welcomeScreen && enterButton) {
    enterButton.addEventListener("click", function () {
        welcomeScreen.classList.add("hide-intro");
    });
}

    const settings = window.portfolioSettings || null;
    const html = document.documentElement;

    const navigationMenu = document.querySelector("#navigation-menu");
    const menuButton = document.querySelector(".menu-button");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuButton && navigationMenu) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigationMenu.classList.toggle("show");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navigationMenu.classList.remove("show");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

const sections = document.querySelectorAll(".content-section");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show-section");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.1
        }
    );

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

} else {

    sections.forEach(function (section) {
        section.classList.add("show-section");
    });

}

    const observedSections = document.querySelectorAll(".content-section");
    if ("IntersectionObserver" in window && observedSections.length && navLinks.length) {
        const observer = new IntersectionObserver(function (entries) {
            const visibleEntries = entries
                .filter(function (entry) { return entry.isIntersecting; })
                .sort(function (a, b) {
                    return a.boundingClientRect.top - b.boundingClientRect.top;
                });

            if (!visibleEntries.length) return;

            const currentId = visibleEntries[0].target.id;
            navLinks.forEach(function (link) {
                const isCurrent = link.getAttribute("href") === "#" + currentId;
                link.classList.toggle("active", isCurrent);
                if (isCurrent) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }, {
            root: null,
            rootMargin: "-15% 0px -65% 0px",
            threshold: 0
        });

        observedSections.forEach(function (section) {
            observer.observe(section);
        });
    }

    const themeToggle = document.querySelector("#theme-toggle");

    function updateThemeButton() {
        const isDark = html.getAttribute("data-theme") === "dark";
        if (!themeToggle) return;

        themeToggle.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
            html.setAttribute("data-theme", nextTheme);

            if (settings) settings.update({ theme: nextTheme });
            updateThemeButton();
        });
    }

    const visitorNameInput = document.querySelector("#visitor-name");
    const visitorGreeting = document.querySelector("#visitor-greeting");

    if (visitorNameInput) {
        const savedName = settings ? settings.get().visitorName : "";
        visitorNameInput.value = savedName;

        function updateGreeting() {
            const name = visitorNameInput.value.trim();
            if (visitorGreeting) {
                visitorGreeting.textContent = name ? "Welcome, " + name + "!" : "";
            }
            if (settings) settings.update({ visitorName: name });
        }

        updateGreeting();
        visitorNameInput.addEventListener("input", updateGreeting);
        visitorNameInput.addEventListener("change", updateGreeting);
    }

    if (settings) {
        const previousVisit = settings.get().lastVisit;
        console.info("Previous visit:", previousVisit || "First visit");
        settings.update({ lastVisit: new Date().toISOString() });
    }

    const projects = [
        {
            title: "Moonlit Wilderness",
            description: "A digital landscape illustration featuring a quiet campsite, a glowing crescent moon, and layered mountain silhouettes.",
            category: "Digital Illustration",
            image: "assets/moonlit-landscape.jpg",
            imageAlt: "Purple night sky with a crescent moon, mountain silhouettes, and a small glowing campfire."
        },
        {
            title: "The Batman — Poster Study",
            description: "A dramatic fan-art poster study using a bold red-and-black palette, high contrast, and cinematic composition.",
            category: "Poster Design",
            image: "assets/batman-poster.jpg",
            imageAlt: "Red and black Batman fan-art poster with a silhouetted figure, a car, smoke, and a large white moon."
        },
        {
            title: "Royal Orange — Advertisement",
            description: "A vibrant beverage advertisement built around orange tones, oversized typography, product focus, and energetic geometric shapes.",
            category: "Advertising Design",
            image: "assets/royal-orange-ad.jpg",
            imageAlt: "Orange Royal beverage advertisement with a can, orange slices, bold blue and white typography, and an orange background."
        }
    ];

    const projectContainer = document.querySelector("#project-container");

    if (projectContainer) {
        const validProjects = projects.filter(function (project) {
            return project &&
                typeof project.title === "string" && project.title.trim() &&
                typeof project.description === "string" && project.description.trim() &&
                typeof project.category === "string" && project.category.trim() &&
                typeof project.image === "string" && project.image.trim();
        });

        if (!validProjects.length) {
            projectContainer.textContent = "No projects available yet.";
        } else {
            validProjects.forEach(function (project) {
                const card = document.createElement("article");
                const imageWrapper = document.createElement("div");
                const image = document.createElement("img");
                const content = document.createElement("div");
                const category = document.createElement("p");
                const title = document.createElement("h2");
                const description = document.createElement("p");

                card.className = "project-card";
                imageWrapper.className = "project-image";
                content.className = "project-content";

                image.src = project.image;
                image.alt = project.imageAlt;
                image.loading = "lazy";
                image.decoding = "async";

                category.className = "project-category";
                category.textContent = project.category;
                title.textContent = project.title;
                description.textContent = project.description;

                imageWrapper.appendChild(image);
                content.append(category, title, description);
                card.append(imageWrapper, content);
                projectContainer.appendChild(card);

                image.addEventListener("error", function () {
                    imageWrapper.classList.add("image-unavailable");
                    image.alt = "Artwork image could not be loaded.";
                });
            });
        }
    }

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        const fields = [
            {
                input: document.querySelector("#name"),
                error: document.querySelector("#name-error"),
                emptyMessage: "Please enter your name."
            },
            {
                input: document.querySelector("#email"),
                error: document.querySelector("#email-error"),
                emptyMessage: "Please enter your email address."
            },
            {
                input: document.querySelector("#message"),
                error: document.querySelector("#message-error"),
                emptyMessage: "Please enter your message."
            }
        ];

        const formStatus = document.querySelector("#form-status");

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let isValid = true;

            fields.forEach(function (field) {
                field.error.textContent = "";
                field.input.removeAttribute("aria-invalid");
            });
            if (formStatus) formStatus.textContent = "";

            fields.forEach(function (field) {
                const value = field.input.value.trim();

                if (!value) {
                    field.error.textContent = field.emptyMessage;
                    field.input.setAttribute("aria-invalid", "true");
                    isValid = false;
                } else if (field.input.type === "email" && !field.input.validity.valid) {
                    field.error.textContent = "Please enter a valid email address.";
                    field.input.setAttribute("aria-invalid", "true");
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstInvalid = fields.find(function (field) {
                    return field.input.getAttribute("aria-invalid") === "true";
                });
                if (firstInvalid) firstInvalid.input.focus();
                return;
            }

            if (formStatus) {
                formStatus.textContent =
                    "Your message has been sent successfully";
            }
        });

        fields.forEach(function (field) {
            field.input.addEventListener("input", function () {
                if (field.input.value.trim()) {
                    field.error.textContent = "";
                    field.input.removeAttribute("aria-invalid");
                }
            });
        });
    }
});

