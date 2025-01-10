document.body.style.zoom = "100%";

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
 * navbar toggle for mobile
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

addEventOnElements(navTogglers, "click", toggleNavbar);



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
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function (currentSlider) {

  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  let totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
  let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
  }

  /**
   * NEXT SLIDE
   */
  const slideNext = function () {
    const slideEnd = currentSlidePos >= totalSlidableItems;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  }

  sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */
  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = totalSlidableItems;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  }

  sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = totalSlidableItems <= 0;
  if (dontHaveExtraItem) {
    sliderNextBtn.style.display = 'none';
    sliderPrevBtn.style.display = 'none';
  }

  /**
   * slide with [shift + mouse wheel]
   */

  currentSlider.addEventListener("wheel", function (event) {
    if (event.shiftKey && event.deltaY > 0) slideNext();
    if (event.shiftKey && event.deltaY < 0) slidePrev();
  });

  /**
   * RESPONSIVE
   */

  window.addEventListener("resize", function () {
    totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
    totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

    moveSliderItem();
  });

}

for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }


    /**
     * Audio
     */


// Get the audio element

var audio = document.getElementById('backgroundMusic');
``
// Mute/Unmute audio
function toggleMute() {
    audio.muted = !audio.muted;
}
function increaseVolume(step = 0.1) {
  if (audio.volume + step <= 1) { // Ensure volume does not exceed 1
      audio.volume += step;
  } else {
      audio.volume = 1; // Set to maximum volume
  }
  console.log(`Volume: ${Math.round(audio.volume * 100)}%`);
}

// Function to decrease the volume
function decreaseVolume(step = 0.1) {
  if (audio.volume - step >= 0) { // Ensure volume does not go below 0
      audio.volume -= step;
  } else {
      audio.volume = 0; // Mute the audio
  }
  console.log(`Volume: ${Math.round(audio.volume * 100)}%`);
}

window.onload = function () {
  const prompt = document.getElementById("music-prompt");
  const yesButton = document.getElementById("yes-btn");
  const noButton = document.getElementById("no-btn");
  const audio = document.getElementById("backgroundMusic");
  const body = document.body;

  // Show the prompt and blur the background on page load
  prompt.style.display = "block";

  // Event listener for the "Yes" button
  yesButton.addEventListener("click", () => {
    audio.play()
      .then(() => console.log("Audio playback started successfully."))
      .catch(error => console.error("Error playing audio:", error));
    
    // Remove blur and hide the prompt with animation
    body.classList.remove("no-blur");
    prompt.classList.add("hidden");

    setTimeout(() => {
      prompt.style.display = "none"; // Ensure the prompt is hidden after animation
    }, 500); // Match transition duration
  });

  // Event listener for the "No" button
  noButton.addEventListener("click", () => {
    console.log("User declined to play audio.");
    audio.pause();
    audio.currentTime = 0;

    // Remove blur and hide the prompt with animation
    body.classList.remove("no-blur");
    prompt.classList.add("hidden");

    setTimeout(() => {
      prompt.style.display = "none"; // Ensure the prompt is hidden after animation
    }, 500); // Match transition duration
  });

  // Apply blur initially
  body.classList.add("no-blur");
};


window.onload = function () {
  const prompt = document.getElementById("music-prompt");
  const yesButton = document.getElementById("yes-btn");
  const noButton = document.getElementById("no-btn");
  const audio = document.getElementById("backgroundMusic");
  const body = document.body;

  // Initially, the blur is applied on body and prompt is hidden
  body.classList.add("no-blur");

  // Show the prompt after a small delay (for smooth visual)
  setTimeout(() => {
    prompt.classList.add("visible");
  }, 500); // Delay so that blur transition is visible to user

  // Event listener for the "Yes" button
  yesButton.addEventListener("click", () => {
    audio.play()
      .then(() => console.log("Audio playback started successfully."))
      .catch(error => console.error("Error playing audio:", error));

    // Remove blur and hide the prompt with smooth fade-out
    body.classList.remove("no-blur");
    prompt.classList.remove("visible");

    setTimeout(() => {
      prompt.style.display = "none"; // Ensure the prompt is hidden after animation
    }, 500); // Match transition duration
  });

  // Event listener for the "No" button
  noButton.addEventListener("click", () => {
    console.log("User declined to play audio.");
    audio.pause();
    audio.currentTime = 0;

    // Remove blur and hide the prompt with smooth fade-out
    body.classList.remove("no-blur");
    prompt.classList.remove("visible");

    setTimeout(() => {
      prompt.style.display = "none"; // Ensure the prompt is hidden after animation
    }, 500); // Match transition duration
  });
};
