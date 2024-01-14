document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  backBtn?.addEventListener("click", () => {
    window.history.back();
  });

  refreshBtn?.addEventListener("click", () => {
    window.location.reload();
  });
});
