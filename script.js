const content = window.siteContent;

const renderHeroMetrics = () => {
  const container = document.getElementById("hero-metrics");
  container.innerHTML = content.heroMetrics
    .map(
      (metric) => `
        <div>
          <dt>${metric.label}</dt>
          <dd>${metric.value}</dd>
        </div>
      `
    )
    .join("");
};

const renderAbout = () => {
  const container = document.getElementById("about-story");
  container.innerHTML = content.about.map((paragraph) => `<p>${paragraph}</p>`).join("");
};

const renderAchievements = () => {
  const container = document.getElementById("achievement-grid");
  container.innerHTML = content.achievements
    .map(
      (achievement) => `
        <article class="achievement-card">
          <div class="metric-value">${achievement.value}</div>
          <div class="metric-label">${achievement.label}</div>
        </article>
      `
    )
    .join("");
};

const renderExperience = () => {
  const container = document.getElementById("experience-timeline");
  container.innerHTML = content.experience
    .map(
      (item) => `
        <article class="timeline-item">
          <div class="timeline-header">
            <div class="timeline-meta">${item.dates} · ${item.location}</div>
            <h3>${item.company}</h3>
            <div class="timeline-role">${item.role}</div>
          </div>
          <div class="timeline-content">
            <p>${item.summary}</p>
            <ul class="detail-list">
              ${item.responsibilities.map((point) => `<li>${point}</li>`).join("")}
            </ul>
            ${
              item.outcomes.length
                ? `<div class="timeline-metrics">${item.outcomes.map((outcome) => `<span>${outcome}</span>`).join("")}</div>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
};

const renderExpertise = () => {
  const container = document.getElementById("expertise-grid");
  container.innerHTML = content.expertise
    .map(
      (category) => `
        <article class="expertise-card">
          <h3>${category.title}</h3>
          <div class="tag-list">
            ${category.items.map((item) => `<span>${item}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
};

const renderProjects = () => {
  const container = document.getElementById("project-grid");
  container.innerHTML = content.featuredWork
    .map(
      (project) => `
        <article class="project-card">
          <h3>${project.title}</h3>
          <section>
            <div class="project-label">Problem</div>
            <p>${project.problem}</p>
          </section>
          <section>
            <div class="project-label">Engineering contribution</div>
            <p>${project.contribution}</p>
          </section>
          <section>
            <div class="project-label">Scale</div>
            <p>${project.scale}</p>
          </section>
          <section>
            <div class="project-label">Outcome</div>
            <p>${project.outcome}</p>
          </section>
        </article>
      `
    )
    .join("");
};

const renderAiNative = () => {
  document.getElementById("ai-summary").textContent = content.aiNative.summary;
  document.getElementById("ai-points").innerHTML = content.aiNative.points
    .map((point) => `<li>${point}</li>`)
    .join("");
};

const renderPhilosophy = () => {
  document.getElementById("principle-list").innerHTML = content.philosophy
    .map((item) => `<li><strong>${item.title}.</strong> ${item.text}</li>`)
    .join("");
};

const renderEducation = () => {
  document.getElementById("education-card").innerHTML = `
    <h3>${content.education.degree}</h3>
    <p>${content.education.years}</p>
  `;
};

const renderContact = () => {
  document.getElementById("contact-links").innerHTML = `
    <a href="mailto:${content.contact.email}">${content.contact.email}</a>
    <a href="${content.contact.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
    <a href="${content.contact.github}" target="_blank" rel="noreferrer">GitHub</a>
  `;
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
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
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
