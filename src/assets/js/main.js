addEventListener("load", () => {
  document
    .querySelector("[data-open-sidebar]")
    .addEventListener("click", () => {
      document
        .querySelector("[data-page-header]")
        .classList.add("active-sidebar");
    });

  document
    .querySelector("[data-collapse-menu]")
    .addEventListener("click", () => {
      document
        .querySelector("[data-page-header]")
        .classList.remove("active-sidebar");
    });
});
