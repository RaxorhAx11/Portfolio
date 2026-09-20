/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PRELOADER
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("DOMContentLoaded", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * NAVBAR
 * navbar toggle and auto-close for mobile
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggleBtn.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

const closeNavbar = function () {
  if (navbar && navbar.classList.contains("active")) {
    navbar.classList.remove("active");
    navToggleBtn.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-active");
  }
}

addEventOnElements(navTogglers, "click", toggleNavbar);

const navbarLinks = document.querySelectorAll(".navbar-link");
addEventOnElements(navbarLinks, "click", closeNavbar);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeNavbar();
});



/**
 * HEADER
 * header active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});



/**
 * SLIDER (Seamless Infinite Loop)
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function (currentSlider) {

  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  if (!sliderContainer || sliderContainer.children.length === 0) return;

  const originalItems = Array.from(sliderContainer.children);
  const totalOriginalItems = originalItems.length;

  // Clone items to create a seamless infinite buffer: [Prepend Clones] [Originals] [Append Clones]
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    sliderContainer.appendChild(clone);
  });

  originalItems.slice().reverse().forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    sliderContainer.insertBefore(clone, sliderContainer.firstChild);
  });

  // Start at the first original item
  let currentSlidePos = totalOriginalItems;
  let isTransitioning = false;
  let autoSlideTimer = null;
  const AUTO_SLIDE_DELAY = 3000; // Smooth interval between slides

  const moveSliderItem = function (animated = true) {
    if (!animated) {
      sliderContainer.style.transition = "none";
    } else {
      sliderContainer.style.transition = "";
    }

    if (sliderContainer.children[currentSlidePos]) {
      const targetOffset = sliderContainer.children[currentSlidePos].offsetLeft;
      sliderContainer.style.transform = `translateX(-${targetOffset}px)`;
    }

    if (!animated) {
      // Force layout reflow so instantaneous jump applies immediately
      sliderContainer.offsetHeight;
      sliderContainer.style.transition = "";
    }
  }

  // Position at original first item immediately without transition
  moveSliderItem(false);

  /**
   * Seamless transition reset on boundary reach
   */
  sliderContainer.addEventListener("transitionend", function (e) {
    if (e.target !== sliderContainer) return;
    isTransitioning = false;

    // Reached appended clones at the end -> jump back to original items seamlessly
    if (currentSlidePos >= totalOriginalItems * 2) {
      currentSlidePos = currentSlidePos - totalOriginalItems;
      moveSliderItem(false);
    }
    // Reached prepended clones at the start -> jump forward to original items seamlessly
    else if (currentSlidePos < totalOriginalItems) {
      currentSlidePos = currentSlidePos + totalOriginalItems;
      moveSliderItem(false);
    }
  });

  /**
   * NEXT SLIDE (moves left continuously)
   */
  const slideNext = function () {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlidePos++;
    moveSliderItem(true);
  }

  /**
   * PREVIOUS SLIDE (moves right)
   */
  const slidePrev = function () {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlidePos--;
    moveSliderItem(true);
  }

  /**
   * AUTO SLIDE CONTROLS (Continuous left-left-left loop)
   */
  const startAutoSlide = function () {
    if (!autoSlideTimer) {
      autoSlideTimer = setInterval(slideNext, AUTO_SLIDE_DELAY);
    }
  }

  const stopAutoSlide = function () {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  const restartAutoSlide = function () {
    stopAutoSlide();
    startAutoSlide();
  }

  // Start continuous infinite left auto-sliding
  startAutoSlide();

  // Navigation button listeners
  if (sliderNextBtn) {
    sliderNextBtn.addEventListener("click", function () {
      slideNext();
      restartAutoSlide();
    });
  }

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener("click", function () {
      slidePrev();
      restartAutoSlide();
    });
  }

  // Pause on hover
  currentSlider.addEventListener("mouseenter", stopAutoSlide);
  currentSlider.addEventListener("mouseleave", startAutoSlide);

  /**
   * Touch swipe gesture detection for mobile & tablet
   */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 40; // minimum pixels for a valid swipe

  currentSlider.addEventListener("touchstart", function (e) {
    stopAutoSlide();
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    }
  }, { passive: true });

  currentSlider.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches.length > 0) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }, { passive: true });

  currentSlider.addEventListener("touchend", function () {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Trigger only when horizontal movement dominates vertical scroll
    if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }

    startAutoSlide();
  }, { passive: true });

  /**
   * slide with [shift + mouse wheel]
   */
  currentSlider.addEventListener("wheel", function (event) {
    if (event.shiftKey && event.deltaY > 0) {
      slideNext();
      restartAutoSlide();
    }
    if (event.shiftKey && event.deltaY < 0) {
      slidePrev();
      restartAutoSlide();
    }
  });

  /**
   * RESPONSIVE & ORIENTATION CHANGE ALIGNMENT
   */
  window.addEventListener("resize", function () {
    moveSliderItem(false);
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      moveSliderItem(false);
    }, 150);
  });

  window.addEventListener("load", function () {
    moveSliderItem(false);
  });

}

for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }


/**
 * AUDIO CONTROLLER
 */

(function initAudioController() {
  const audio = document.getElementById("backgroundMusic");
  if (!audio) return;

  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const voiceUpBtn = document.getElementById("voiceUpBtn");
  const voiceDownBtn = document.getElementById("voiceDownBtn");
  const silentBtn = document.getElementById("silentBtn");
  const volumeBadge = document.getElementById("volumeBadge");

  // Initial default volume
  audio.volume = 0.8;

  function updateUIState() {
    const isMuted = audio.muted || audio.volume === 0;

    // Play/Pause active states
    if (playBtn && pauseBtn) {
      if (!audio.paused) {
        playBtn.classList.add("is-active");
        pauseBtn.classList.remove("is-active");
        playBtn.setAttribute("aria-pressed", "true");
        pauseBtn.setAttribute("aria-pressed", "false");
      } else {
        playBtn.classList.remove("is-active");
        pauseBtn.classList.add("is-active");
        playBtn.setAttribute("aria-pressed", "false");
        pauseBtn.setAttribute("aria-pressed", "true");
      }
    }

    // Silent active state & icon
    if (silentBtn) {
      const silentIcon = silentBtn.querySelector("ion-icon");
      if (isMuted) {
        silentBtn.classList.add("is-active", "is-muted");
        silentBtn.setAttribute("aria-pressed", "true");
        silentBtn.setAttribute("title", "Unmute audio");
        if (silentIcon) silentIcon.setAttribute("name", "volume-mute");
      } else {
        silentBtn.classList.remove("is-active", "is-muted");
        silentBtn.setAttribute("aria-pressed", "false");
        silentBtn.setAttribute("title", "Mute audio");
        if (silentIcon) silentIcon.setAttribute("name", "volume-mute-outline");
      }
    }

    // Volume badge
    if (volumeBadge) {
      if (isMuted) {
        volumeBadge.textContent = "0%";
        volumeBadge.classList.add("is-muted");
      } else {
        const pct = Math.round(audio.volume * 100);
        volumeBadge.textContent = `${pct}%`;
        volumeBadge.classList.remove("is-muted");
      }
    }
  }

  // Play handler
  function playAudio() {
    audio.play().then(() => {
      updateUIState();
    }).catch((err) => {
      console.warn("Audio playback not allowed without interaction:", err);
      updateUIState();
    });
  }

  // Pause handler
  function pauseAudio() {
    audio.pause();
    updateUIState();
  }

  // Volume Up handler
  function increaseVolume(step = 0.1) {
    if (audio.muted) {
      audio.muted = false;
    }
    const target = Math.min(1, Math.round((audio.volume + step) * 10) / 10);
    audio.volume = target;
    if (voiceUpBtn) {
      voiceUpBtn.classList.add("pulse-press");
      setTimeout(() => voiceUpBtn.classList.remove("pulse-press"), 180);
    }
    updateUIState();
  }

  // Volume Down handler
  function decreaseVolume(step = 0.1) {
    const target = Math.max(0, Math.round((audio.volume - step) * 10) / 10);
    audio.volume = target;
    if (audio.volume === 0) {
      audio.muted = true;
    }
    if (voiceDownBtn) {
      voiceDownBtn.classList.add("pulse-press");
      setTimeout(() => voiceDownBtn.classList.remove("pulse-press"), 180);
    }
    updateUIState();
  }

  // Silent / Toggle Mute handler
  function toggleSilent() {
    audio.muted = !audio.muted;
    if (!audio.muted && audio.volume === 0) {
      audio.volume = 0.5;
    }
    if (silentBtn) {
      silentBtn.classList.add("pulse-press");
      setTimeout(() => silentBtn.classList.remove("pulse-press"), 180);
    }
    updateUIState();
  }

  // Attach event listeners
  if (playBtn) playBtn.addEventListener("click", playAudio);
  if (pauseBtn) pauseBtn.addEventListener("click", pauseAudio);
  if (voiceUpBtn) voiceUpBtn.addEventListener("click", () => increaseVolume(0.1));
  if (voiceDownBtn) voiceDownBtn.addEventListener("click", () => decreaseVolume(0.1));
  if (silentBtn) silentBtn.addEventListener("click", toggleSilent);

  // Sync state on audio events
  audio.addEventListener("play", updateUIState);
  audio.addEventListener("pause", updateUIState);
  audio.addEventListener("volumechange", updateUIState);
  audio.addEventListener("ended", updateUIState);

  // Expose global helpers for backward compatibility
  window.increaseVolume = () => increaseVolume(0.1);
  window.decreaseVolume = () => decreaseVolume(0.1);
  window.toggleMute = toggleSilent;

  // Initialize UI once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateUIState);
  } else {
    updateUIState();
  }
})();
