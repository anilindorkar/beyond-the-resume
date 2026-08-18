const THEME_STORAGE_KEY = "theme-preference";
const THEME_SEQUENCE = ["system", "dark", "light"];
const THEME_ICONS = { system: "◐", dark: "☾", light: "☀" };
const THEME_COLORS = { dark: "#020617", light: "#f7f9fc" };
const DESKTOP_QUERY = "(min-width: 901px)";
const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const isExternalUrl = (href) => href.startsWith("https://") || href.startsWith("http://");

const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
};

const SVG_NS = "http://www.w3.org/2000/svg";

/** Builds an <svg><use href="#i-name"> reference into the inline sprite in index.html. */
const createIcon = (name) => {
  const svg = document.createElementNS(SVG_NS, "svg");
  // SVG elements need setAttribute; assigning .className does not work on them.
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#i-${name}`);
  svg.append(use);
  return svg;
};

/** An icon paired with its label, used for timeline dates and locations. */
const createMetaItem = (iconName, text) => {
  const item = createElement("span", "meta-item");
  item.append(createIcon(iconName), createElement("span", "", text));
  return item;
};

/** Returns the container for a section, or null (with a warning) when the markup changed. */
const mount = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Skipping render: #${id} is not in the document.`);
  }
  return element;
};

/** MediaQueryList.addEventListener is unavailable on older Safari; fall back to addListener. */
const onMediaChange = (mediaQuery, handler) => {
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handler);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handler);
  }
};

const showContentError = () => {
  if (document.querySelector(".banner[data-content-error]")) {
    return;
  }
  const banner = createElement(
    "div",
    "banner",
    "Profile content could not be loaded. Please refresh the page or contact ajindorkar@gmail.com."
  );
  banner.dataset.contentError = "true";
  document.body.prepend(banner);
};

const renderHeroMetrics = (content) => {
  const container = mount("hero-metrics");
  if (!container) return;

  container.replaceChildren(
    ...content.heroMetrics.map((metric) => {
      const wrapper = document.createElement("div");
      wrapper.append(
        createElement("dt", "", metric.label),
        createElement("dd", "", metric.value)
      );
      return wrapper;
    })
  );
};

const renderAbout = (content) => {
  const container = mount("about-story");
  if (!container) return;

  container.replaceChildren(...content.about.map((paragraph) => createElement("p", "", paragraph)));
};

const renderAchievements = (content) => {
  const container = mount("achievement-grid");
  if (!container) return;

  container.replaceChildren(
    ...content.achievements.map((achievement) => {
      const article = createElement("article", "achievement-card");
      article.append(
        createElement("div", "metric-value", achievement.value),
        createElement("div", "metric-label", achievement.label)
      );
      return article;
    })
  );
};

const renderExperience = (content) => {
  const container = mount("experience-timeline");
  if (!container) return;

  container.replaceChildren(
    ...content.experience.map((item) => {
      const article = createElement("article", "timeline-item");
      const header = createElement("div", "timeline-header");
      const meta = createElement("div", "timeline-meta");
      meta.append(createMetaItem("calendar", item.dates));
      if (item.location) {
        meta.append(createMetaItem("pin", item.location));
      }
      header.append(
        meta,
        createElement("h3", "", item.company),
        createElement("div", "timeline-role", item.role)
      );

      const detailList = createElement("ul", "detail-list");
      detailList.replaceChildren(
        ...item.responsibilities.map((point) => createElement("li", "", point))
      );

      const contentPanel = createElement("div", "timeline-content");
      contentPanel.append(createElement("p", "", item.summary), detailList);

      if (item.outcomes.length) {
        const metrics = createElement("div", "timeline-metrics");
        metrics.replaceChildren(...item.outcomes.map((outcome) => createElement("span", "", outcome)));
        contentPanel.append(metrics);
      }

      article.append(header, contentPanel);
      return article;
    })
  );
};

const renderExpertise = (content) => {
  const container = mount("expertise-grid");
  if (!container) return;

  container.replaceChildren(
    ...content.expertise.map((category) => {
      const article = createElement("article", "expertise-card");
      const tags = createElement("div", "tag-list");
      tags.replaceChildren(...category.items.map((item) => createElement("span", "", item)));
      const heading = createElement("h3");
      heading.append(createIcon(category.icon || "layers"), createElement("span", "", category.title));
      article.append(heading, tags);
      return article;
    })
  );
};

const renderProjects = (content) => {
  const container = mount("project-grid");
  if (!container) return;

  container.replaceChildren(
    ...content.featuredWork.map((project) => {
      const article = createElement("article", "project-card");
      article.append(createElement("h3", "", project.title));

      // A description list is the right shape for label/value pairs; a bare <section>
      // per pair would add unnamed regions to the accessibility tree.
      const facts = createElement("dl", "project-facts");
      [
        ["target", "Problem", project.problem],
        ["wrench", "Engineering contribution", project.contribution],
        ["scale", "Scale", project.scale],
        ["trend", "Outcome", project.outcome]
      ].forEach(([iconName, label, text]) => {
        const term = createElement("dt", "project-label");
        term.append(createIcon(iconName), createElement("span", "", label));

        const group = document.createElement("div");
        group.append(term, createElement("dd", "", text));
        facts.append(group);
      });
      article.append(facts);

      return article;
    })
  );
};

const renderAiNative = (content) => {
  const summary = mount("ai-summary");
  const points = mount("ai-points");
  if (!summary || !points) return;

  summary.textContent = content.aiNative.summary;
  points.replaceChildren(...content.aiNative.points.map((point) => createElement("li", "", point)));
};

const renderPhilosophy = (content) => {
  const container = mount("principle-list");
  if (!container) return;

  container.replaceChildren(
    ...content.philosophy.map((item) => {
      const listItem = createElement("li");
      listItem.append(
        createElement("strong", "", `${item.title}.`),
        document.createTextNode(` ${item.text}`)
      );
      return listItem;
    })
  );
};

const renderEducation = (content) => {
  const container = mount("education-card");
  if (!container) return;

  const heading = createElement("h3");
  heading.append(createIcon("cap"), createElement("span", "", content.education.degree));

  container.replaceChildren(heading, createElement("p", "", content.education.years));
};

const renderContact = (content) => {
  const container = mount("contact-links");
  if (!container) return;

  const createLink = (href, text, variant, iconName) => {
    const link = createElement("a", `button button-${variant}`);
    link.href = href;
    link.append(createIcon(iconName), createElement("span", "", text));
    if (isExternalUrl(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  };

  // Email is the primary call to action; the profiles are secondary.
  container.replaceChildren(
    createLink(`mailto:${content.contact.email}`, content.contact.email, "primary", "mail"),
    createLink(content.contact.linkedin, "LinkedIn", "secondary", "linkedin"),
    createLink(content.contact.github, "GitHub", "secondary", "github")
  );
};

const readThemePreference = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_SEQUENCE.includes(stored) ? stored : "system";
  } catch (error) {
    // Storage blocked (private mode, sandboxed iframe): treat the session as "system".
    return "system";
  }
};

const writeThemePreference = (preference) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (error) {
    // Preference cannot be persisted; the theme still applies for this page view.
  }
};

const setupThemeToggle = () => {
  const button = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-toggle-icon");
  const darkScheme = window.matchMedia(DARK_SCHEME_QUERY);
  let preference = readThemePreference();

  const applyTheme = () => {
    const resolvedTheme =
      preference === "system" ? (darkScheme.matches ? "dark" : "light") : preference;

    document.documentElement.dataset.theme = resolvedTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", THEME_COLORS[resolvedTheme]);
    }

    if (button && icon) {
      icon.textContent = THEME_ICONS[preference];
      const label = `Colour theme: ${preference}. Activate to switch.`;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }
  };

  applyTheme();

  // Keep "system" in step with the OS while the page is open.
  onMediaChange(darkScheme, () => {
    if (preference === "system") {
      applyTheme();
    }
  });

  if (!button) return;

  button.addEventListener("click", () => {
    const nextIndex = (THEME_SEQUENCE.indexOf(preference) + 1) % THEME_SEQUENCE.length;
    preference = THEME_SEQUENCE[nextIndex];
    writeThemePreference(preference);
    applyTheme();
  });
};

const setupNavigation = () => {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };

  setOpen(false);

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!isOpen() || !(event.target instanceof Element)) return;
    if (!event.target.closest("#site-nav") && !event.target.closest("#nav-toggle")) {
      setOpen(false);
    }
  });

  // Returning to the desktop layout must not leave the menu in an "open" state.
  const desktop = window.matchMedia(DESKTOP_QUERY);
  onMediaChange(desktop, () => {
    if (desktop.matches) {
      setOpen(false);
    }
  });
};

const setupScrollSpy = () => {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const ratios = new Map();

  const highlight = () => {
    let currentId = null;
    let bestRatio = 0;
    ratios.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        currentId = id;
      }
    });

    links.forEach((link) => {
      if (currentId && link.getAttribute("href") === `#${currentId}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      highlight();
    },
    { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
  );

  sections.forEach((section) => observer.observe(section));
};

const renderContent = (content) => {
  renderHeroMetrics(content);
  renderAbout(content);
  renderAchievements(content);
  renderExperience(content);
  renderExpertise(content);
  renderProjects(content);
  renderAiNative(content);
  renderPhilosophy(content);
  renderEducation(content);
  renderContact(content);
};

const init = () => {
  // Chrome and navigation work regardless of whether the profile data loaded.
  setupThemeToggle();
  setupNavigation();

  const year = document.getElementById("current-year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const content = window.siteContent;
  if (!content) {
    console.error("window.siteContent is unavailable; profile.js did not load.");
    showContentError();
    return;
  }

  try {
    renderContent(content);
  } catch (error) {
    console.error("Failed to render profile content.", error);
    showContentError();
    return;
  }

  setupScrollSpy();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
