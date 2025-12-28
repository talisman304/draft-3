(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Year
  qsa("[data-year]").forEach(n => n.textContent = String(new Date().getFullYear()));

  // Mobile menu
  const menuBtn = qs("[data-menu-btn]");
  const mobileNav = qs("[data-mobile-nav]");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });

    qsa("a", mobileNav).forEach(a => a.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }));
  }

  // Scroll progress bar
  const progress = qs("[data-progress]");
  const onScroll = () => {
    if (!progress) return;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const els = qsa(".reveal");
    if ("IntersectionObserver" in window && els.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(el => io.observe(el));
    } else {
      els.forEach(el => el.classList.add("in"));
    }
  } else {
    qsa(".reveal").forEach(el => el.classList.add("in"));
  }

  // Modal system
  const openers = qsa("[data-open-modal]");
  const closers = qsa("[data-close-modal]");
  const openModal = (name) => {
    const modal = qs(`[data-modal="${name}"]`);
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus first button
    const btn = qs("button, a, input, select, textarea", modal);
    btn && btn.focus();
  };
  const closeModal = (modal) => {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openers.forEach(btn => btn.addEventListener("click", () => openModal(btn.dataset.openModal)));
  closers.forEach(btn => btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    modal && closeModal(modal);
  }));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    qsa(".modal[aria-hidden='false']").forEach(m => closeModal(m));
  });

  // Form toast feedback (Netlify forms will handle submission server-side; this adds client reassurance)
  const enquiry = qs("form[name='enquiry']");
  const toast = qs("[data-toast]");
  if (enquiry && toast) {
    enquiry.addEventListener("submit", () => {
      toast.hidden = false;
      toast.textContent = "Sending… If you don’t see confirmation, email enquiries@drcharlesbrandon.com.";
      // Netlify will navigate/confirm depending on config; keep message lightweight.
    });
  }
})();
// js placeholder
