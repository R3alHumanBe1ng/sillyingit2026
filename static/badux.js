const STEP = 400;

const form = document.getElementById("mememake");
const memeImg = document.getElementById("meme");
const memeContainer = document.getElementById("generatedmeme");
const throbber = document.getElementById("throbber");
const loadingText = document.getElementById("loadingText");
const downloadBtn = document.getElementById("downloadBtn");
let currentImageUrl = null;
let player = null;
let fadeInterval = null;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    videoId: "j3p6q24QXRE",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: "j3p6q24QXRE",
      playsinline: 1
    },
    events: {
      onReady: (event) => {
        event.target.mute();
        event.target.setVolume(0);
        event.target.playVideo();
      }
    }
  })
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  memeContainer.style.display = "flex";
  throbber.style.display = "block";
  loadingText.style.display = "block";
  memeImg.style.display = "none";
  memeImg.removeAttribute("src");
  downloadBtn.style.display = "none";

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    currentImageUrl = imageUrl;


    throbber.style.display = "none";
    loadingText.style.display = "none";
    memeImg.src = imageUrl;
    memeImg.style.display = 'block';
    downloadBtn.style.display = "block";
    form.reset();

  } catch (err) {
    console.error(err);
    throbber.style.display = "none";
    loadingText.style.display = "none";
    memeContainer.style.display = "none";
    downloadBtn.style.display = "none";
  }
});

downloadBtn.addEventListener("click", () => {
  if (!currentImageUrl) return;

  const a = document.createElement("a");
  a.href = currentImageUrl;
  a.download = "epicmeme.gif";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});



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

    if (player) {
      if (fadeInterval) {
        clearInterval(fadeInterval);
      }

      player.playVideo();
      player.unMute();
      player.setVolume(0);

      let volume = 0;
      const targetVolume = 100;
      const stepTime = 50;
      const step = 4;

      const fadeInterval = setInterval(() => {
        volume += step;

        if (volume >= targetVolume) {
          volume = targetVolume;
          clearInterval(fadeInterval);
          fadeInterval = null;
        }

        player.setVolume(volume);
      }, stepTime);

      player.playVideo();
    }

    window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" });
  })