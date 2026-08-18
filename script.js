const content = window.siteContent;

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

const renderHeroMetrics = () => {
  const container = document.getElementById("hero-metrics");
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

const renderAbout = () => {
  const container = document.getElementById("about-story");
  container.replaceChildren(...content.about.map((paragraph) => createElement("p", "", paragraph)));
};

const renderAchievements = () => {
  const container = document.getElementById("achievement-grid");
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

const renderExperience = () => {
  const container = document.getElementById("experience-timeline");
  container.replaceChildren(
    ...content.experience.map((item) => {
      const article = createElement("article", "timeline-item");
      const header = createElement("div", "timeline-header");
      header.append(
        createElement("div", "timeline-meta", `${item.dates} · ${item.location}`),
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

const renderExpertise = () => {
  const container = document.getElementById("expertise-grid");
  container.replaceChildren(
    ...content.expertise.map((category) => {
      const article = createElement("article", "expertise-card");
      const tags = createElement("div", "tag-list");
      tags.replaceChildren(...category.items.map((item) => createElement("span", "", item)));
      article.append(createElement("h3", "", category.title), tags);
      return article;
    })
  );
};

const renderProjects = () => {
  const container = document.getElementById("project-grid");
  container.replaceChildren(
    ...content.featuredWork.map((project) => {
      const article = createElement("article", "project-card");
      article.append(createElement("h3", "", project.title));

      [
        ["Problem", project.problem],
        ["Engineering contribution", project.contribution],
        ["Scale", project.scale],
        ["Outcome", project.outcome]
      ].forEach(([label, text]) => {
        const section = document.createElement("section");
        section.append(
          createElement("div", "project-label", label),
          createElement("p", "", text)
        );
        article.append(section);
      });

      return article;
    })
  );
};

const renderAiNative = () => {
  document.getElementById("ai-summary").textContent = content.aiNative.summary;
  document
    .getElementById("ai-points")
    .replaceChildren(...content.aiNative.points.map((point) => createElement("li", "", point)));
};

const renderPhilosophy = () => {
  document.getElementById("principle-list").replaceChildren(
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

const renderEducation = () => {
  document
    .getElementById("education-card")
    .replaceChildren(
      createElement("h3", "", content.education.degree),
      createElement("p", "", content.education.years)
    );
};

const renderContact = () => {
  const createLink = (href, text) => {
    const link = createElement("a", "", text);
    link.href = href;
    if (href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  };

  document
    .getElementById("contact-links")
    .replaceChildren(
      createLink(`mailto:${content.contact.email}`, content.contact.email),
      createLink(content.contact.linkedin, "LinkedIn"),
      createLink(content.contact.github, "GitHub")
    );
};

const applyTheme = (theme) => {
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  document.body.dataset.theme = resolvedTheme;
};

const setupThemeToggle = () => {
  const savedTheme = localStorage.getItem("theme-preference") || "system";
  applyTheme(savedTheme);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme-preference") || "system";
    const nextTheme =
      currentTheme === "system" ? "dark" : currentTheme === "dark" ? "light" : "system";
    localStorage.setItem("theme-preference", nextTheme);
    applyTheme(nextTheme);
  });
};

const init = () => {
  renderHeroMetrics();
  renderAbout();
  renderAchievements();
  renderExperience();
  renderExpertise();
  renderProjects();
  renderAiNative();
  renderPhilosophy();
  renderEducation();
  renderContact();
  setupThemeToggle();
  document.getElementById("current-year").textContent = new Date().getFullYear();
};

window.addEventListener("DOMContentLoaded", init);
