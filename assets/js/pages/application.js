const waitForElement = (selector, tries = 0) => {
	const node = document.querySelector(selector);
	if (node) return Promise.resolve(node);

	if (tries > 50) return Promise.resolve(null);

	return new Promise((resolve) => {
		window.setTimeout(() => {
			resolve(waitForElement(selector, tries + 1));
		}, 80);
	});
};

const initApplicationNavState = async () => {
	const mainNav = await waitForElement("#mainNav");
	if (!mainNav) return;

	const appLink = Array.from(mainNav.querySelectorAll("a.nav-link")).find(
		(link) => link.textContent && link.textContent.trim().toLowerCase() === "applications"
	);

	if (!appLink) return;

	appLink.setAttribute("href", "../pages/application.html");
	appLink.classList.add("active");
	appLink.setAttribute("aria-current", "page");
};

const initApplicationFilters = () => {
	const filters = Array.from(document.querySelectorAll(".application-filter"));
	const cards = Array.from(document.querySelectorAll(".application-card"));

	if (filters.length === 0 || cards.length === 0) return;

	const applyFilter = (filterKey) => {
		filters.forEach((button) => {
			const isCurrent = button.dataset.filter === filterKey;
			button.classList.toggle("is-active", isCurrent);
			button.setAttribute("aria-selected", isCurrent ? "true" : "false");
		});

		cards.forEach((card) => {
			if (filterKey === "all") {
				card.classList.remove("is-hidden");
				return;
			}

			const sectors = (card.dataset.sector || "").split(/\s+/);
			const showCard = sectors.includes(filterKey);
			card.classList.toggle("is-hidden", !showCard);
		});
	};

	filters.forEach((button) => {
		button.addEventListener("click", () => {
			applyFilter(button.dataset.filter || "all");
		});
	});
};

const initApplicationReveal = () => {
	const nodes = document.querySelectorAll(".reveal-on-scroll");
	if (nodes.length === 0) return;

	if (!("IntersectionObserver" in window)) {
		nodes.forEach((node) => node.classList.add("is-visible"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.18 }
	);

	nodes.forEach((node) => observer.observe(node));
};

const initApplicationPage = () => {
	initApplicationNavState();
	initApplicationFilters();
	initApplicationReveal();
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApplicationPage);
} else {
	initApplicationPage();
}
