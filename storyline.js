class Storyline {
  constructor(selector, options) {
    this.options = {
      storyTime: 4500,
      ...options,
    };
    this.storyline = document.querySelector(selector);
    this.currentSlide = 0;
    this.slider = null;
    this.element = null;
    this.prev = null;
    this.next = null;
    this.time = null;
    this.slides = [];
    this.indicators = [];
    this.nextHandler = this.slideNext.bind(this);
    this.prevHandler = this.slidePrev.bind(this);
  }

  init() {
    this.slider = this.storyline.querySelector(".storyline-slider");
    this.slides = this.slider.querySelectorAll(".storyline-slide");
    return this.slides.length > 1
      ? this.multipleStoryline()
      : this.singleStoryline();
  }

  singleStoryline() {
    this.slides.classList.add("slide-active");
    this.slides.setAttribute("aria-hidden", false);
  }

  multipleStoryline() {
    this.createIndicators();
    this.createControls();
    this.changeSlide(this.currentSlide);
  }

  createIndicators() {
    const storyLineHeader = this.storyline.querySelector(".storyline-header");
    const indicatorWrapper = document.createElement("ul");
    indicatorWrapper.classList.add("storyline-indicator");
    indicatorWrapper.setAttribute("aria-label", "Storyline indicators");
    for (let i = this.slides.length; i > 0; i -= 1) {
      const indicator = document.createElement("li");
      const indicatorBar = document.createElement("span");
      indicator.classList.add("indicator-item");
      indicatorBar.classList.add("indicator-bar");
      indicatorBar.style.animationDuration = `${
        this.options.storyTime / 1000
      }s`;
      indicator.appendChild(indicatorBar);
      indicatorWrapper.appendChild(indicator);
    }
    storyLineHeader.appendChild(indicatorWrapper);
    this.indicators = [...this.storyline.querySelectorAll(".indicator-item")];
  }

  createControls() {
    const controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("storyline-controls");

    this.prev = document.createElement("button");
    this.prev.type = "button";
    this.prev.classList.add("storyline-control");
    this.prev.classList.add("storyline-control-prev");
    this.prev.setAttribute("disabled", "true");
    this.prev.addEventListener("click", this.prevHandler);

    this.next = document.createElement("button");
    this.next.type = "button";
    this.next.classList.add("storyline-control");
    this.next.classList.add("storyline-control-next");
    this.next.addEventListener("click", this.nextHandler);

    controlsWrapper.appendChild(this.prev);
    controlsWrapper.appendChild(this.next);

    this.slider.appendChild(controlsWrapper);
  }

  changeSlide(index) {
    this.slides.forEach((slide) => {
      slide.classList.remove("slide-active");
      slide.setAttribute("aria-hidden", true);
    });

    this.currentSlide = index;

    this.slides[this.currentSlide].classList.add("slide-active");
    this.slides[this.currentSlide].setAttribute("aria-hidden", false);

    this.indicators[this.currentSlide].classList.add("item-loading");

    clearTimeout(this.time);
    this.time = setTimeout(() => {
      if (this.currentSlide !== this.slides.length - 1) {
        this.slideNext();
      } else {
        this.indicators[this.currentSlide].classList.add("item-loaded");
        this.indicators[this.currentSlide].classList.remove("item-loading");
      }
    }, this.options.storyTime);
  }

  slidePrev() {
    this.currentSlide -= 1;
    this.indicators[this.currentSlide + 1].classList.remove("item-loaded");
    this.indicators[this.currentSlide + 1].classList.remove("item-loading");
    this.indicators[this.currentSlide].classList.remove("item-loaded");
    if (this.currentSlide === 0) {
      this.prev.setAttribute("disabled", "true");
    }
    if (this.currentSlide !== this.slides.length) {
      this.next.removeAttribute("disabled");
      this.changeSlide(this.currentSlide);
    }
  }

  slideNext() {
    this.currentSlide += 1;
    this.indicators[this.currentSlide - 1].classList.remove("item-loading");
    this.indicators[this.currentSlide - 1].classList.add("item-loaded");
    if (this.currentSlide === this.slides.length - 1) {
      this.next.setAttribute("disabled", "true");
    }
    if (this.currentSlide > 0) {
      this.prev.removeAttribute("disabled");
      this.changeSlide(this.currentSlide);
    }
  }
}

const storyline_1 = new Storyline(".storyline-1");
const storyline_2 = new Storyline(".storyline-2");
const storyline_3 = new Storyline(".storyline-3");

document.addEventListener("DOMContentLoaded", () => {
  storyline_1.init();
  storyline_2.init();
  storyline_3.init();
});
