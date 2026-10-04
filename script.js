(function () {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  const registerForm = document.querySelector("[data-register-form]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      cards.forEach((card) => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  if (registerForm) {
    let step = 1;
    const maxStep = 3;
    const steps = registerForm.querySelectorAll("[data-step]");
    const progress = registerForm.querySelectorAll("[data-progress]");
    const previousButton = registerForm.querySelector("[data-prev]");
    const nextButton = registerForm.querySelector("[data-next]");
    const submitButton = registerForm.querySelector("[data-submit]");
    const alert = registerForm.querySelector("[data-form-alert]");
    const reviewBox = registerForm.querySelector("[data-review-box]");
    const confirmation = document.querySelector("[data-confirmation]");
    const confirmationCode = document.querySelector("[data-confirmation-code]");
    const resetForm = document.querySelector("[data-reset-form]");
    const tripSelect = registerForm.querySelector("select[name='trip']");

    const currentStepElement = () => registerForm.querySelector(`[data-step="${step}"]`);

    const setAlert = (message, isSuccess) => {
      if (!alert) return;
      alert.textContent = message;
      alert.classList.toggle("is-success", Boolean(isSuccess));
    };

    const updateReview = () => {
      if (!reviewBox) return;
      const data = new FormData(registerForm);
      const name = data.get("fullName") || "Not provided";
      const city = data.get("city") || "Not provided";
      const trip = data.get("trip") || "Not selected";
      const date = data.get("date") || "Not selected";

      reviewBox.innerHTML = `
        <strong>${name}</strong><br>
        Nearest city: ${city}<br>
        ${trip}<br>
        ${date}<br>
        Group: 35 guests<br>
        Trip place: fully sponsored
      `;
    };

    const renderStep = () => {
      steps.forEach((item) => item.classList.toggle("is-active", item.dataset.step === String(step)));
      progress.forEach((item) => item.classList.toggle("is-active", Number(item.dataset.progress) <= step));

      if (previousButton) previousButton.hidden = step === 1;
      if (nextButton) nextButton.hidden = step === maxStep;
      if (submitButton) submitButton.hidden = step !== maxStep;
      if (step === maxStep) updateReview();
      setAlert("");
    };

    const validateStep = () => {
      const fields = Array.from(currentStepElement().querySelectorAll("input, select, textarea"));
      const invalid = fields.find((field) => !field.checkValidity());

      if (invalid) {
        invalid.reportValidity();
        setAlert("Please complete the highlighted fields before continuing.");
        return false;
      }

      return true;
    };

    nextButton.addEventListener("click", () => {
      if (!validateStep()) return;
      step = Math.min(step + 1, maxStep);
      renderStep();
    });

    previousButton.addEventListener("click", () => {
      step = Math.max(step - 1, 1);
      renderStep();
    });

    document.querySelectorAll("[data-select-trip]").forEach((link) => {
      link.addEventListener("click", () => {
        if (tripSelect) tripSelect.value = link.dataset.selectTrip;
      });
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateStep()) return;

      // Static prototype only: no network request, no storage, no backend.
      const code = `TGA-${Math.floor(1000 + Math.random() * 9000)}`;
      if (confirmationCode) confirmationCode.textContent = code;
      registerForm.hidden = true;
      if (confirmation) confirmation.hidden = false;
      setAlert("Registration received.", true);
    });

    resetForm.addEventListener("click", () => {
      registerForm.reset();
      registerForm.hidden = false;
      if (confirmation) confirmation.hidden = true;
      step = 1;
      renderStep();
      registerForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderStep();
  }
})();
