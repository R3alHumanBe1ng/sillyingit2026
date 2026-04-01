const STEP = 400;

window.addEventListener("wheel", (e) => {
    e.preventDefault();
}, { passive: false });

window.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
    },
    { passive: false }
);

window.addEventListener("mousedown", (e) => {
  if (e.button === 1) e.preventDefault();
});

  window.addEventListener("keydown", (e) => {
    const keysToBlock = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "PageUp",
        "PageDown",
        "Home",
        "End"
    ];
    switch (e.key) {
      case "w":
        window.scrollBy({top: STEP, behavior: "smooth"});
        break;
      case "s":
        window.scrollBy({top: -STEP, behavior: "smooth"});
        break;
      default:
        if (keysToBlock.includes(e.key)) {
            e.preventDefault();
        }
        return;
    }
  });



  document.getElementById("enterBtn").addEventListener("click", () => {
    document.getElementById("cover").remove();
    player.playVideo();
    window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" });
    window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" });
    window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" });
  })