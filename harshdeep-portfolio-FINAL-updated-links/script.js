
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
$$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const themeBtn = $("#themeBtn");
if (localStorage.getItem("portfolio-theme") === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀";
}
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  localStorage.setItem("portfolio-theme", light ? "light" : "dark");
  themeBtn.textContent = light ? "☀" : "☾";
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("show"); });
}, {threshold: 0.12});
$$(".reveal").forEach(el => observer.observe(el));

const glow = $(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

const projects = {
  calculator: {
    title: "Calculator Web Application",
    text: "An interactive web calculator focused on a responsive user experience and reliable arithmetic interaction.",
    items: [
      "Supports basic arithmetic operations.",
      "Uses JavaScript for calculation logic and button interactions.",
      "Updates the display dynamically using DOM manipulation.",
      "Built with HTML5 and CSS3 for a clean, responsive interface."
    ]
  },
  memory: {
    title: "Memory Card Matching Game",
    text: "An interactive browser game designed around randomized cards, matching logic, and game-state management.",
    items: [
      "Randomized card generation and pair-matching logic.",
      "Card-flip animations and game-state management.",
      "Move tracking and timer functionality.",
      "Score calculation and restart controls using JavaScript."
    ]
  },
  radar: {
    title: "Arduino-Based Radar System with Multi-Range Scanning",
    text: "Developed an Arduino-based radar system using an ultrasonic sensor for object detection and distance measurement.",
    items: [
      "Implemented multi-range scanning using a stepper motor with LED and buzzer-based alerts.",
      "Integrated an HC-SR04 ultrasonic sensor for object detection and distance measurement.",
      "Integrated a DHT22 sensor for sensor-based environmental monitoring.",
      "Used Arduino and C++ for sensor integration, monitoring, and automated alert logic."
    ]
  }
};

const projectModal = $("#projectModal");
$$(".details-btn").forEach(btn => btn.addEventListener("click", () => {
  const project = projects[btn.dataset.project];
  $("#projectTitle").textContent = project.title;
  $("#projectText").textContent = project.text;
  $("#projectList").innerHTML = project.items.map(i => `<div>✓ ${i}</div>`).join("");
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
}));

const certModal = $("#certificateModal");
$$(".certificate-btn").forEach(btn => btn.addEventListener("click", () => {
  const url = btn.dataset.url;
  const title = btn.dataset.title;
  $("#certificateTitle").textContent = title;
  $("#certificateOpen").href = url;

  let previewURL = url;
  if (url.includes("drive.google.com/file/d/")) {
    const id = url.match(/\/d\/([^/]+)/)?.[1];
    if (id) previewURL = `https://drive.google.com/file/d/${id}/preview`;
  }
  $("#certificatePreview").innerHTML =
    `<iframe src="${previewURL}" title="${title} certificate preview"></iframe>`;
  certModal.classList.add("open");
  certModal.setAttribute("aria-hidden", "false");
}));

$$(".modal-close").forEach(btn => btn.addEventListener("click", () => {
  const modal = $("#" + btn.dataset.close);
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (btn.dataset.close === "certificateModal") $("#certificatePreview").innerHTML = "";
}));

$$(".modal").forEach(modal => modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (modal.id === "certificateModal") $("#certificatePreview").innerHTML = "";
  }
}));

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    $$(".modal.open").forEach(modal => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    });
    $("#certificatePreview").innerHTML = "";
  }
});
