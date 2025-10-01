// Basic Bootstrap validation
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and apply validation
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // For valid forms, show loading state on submit button
          const submitBtn =
            form.querySelector('button[type="submit"]') ||
            form.querySelector(".add-btn") ||
            form.querySelector(".edit-btn");

          if (submitBtn) {
            submitBtn.innerHTML = "Uploading...";
            submitBtn.disabled = true;
          }
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
