const parallaxElements = Array.from(document.getElementsByClassName("parallax-modifier"));

function moveParallax(event) {
    parallaxElements.forEach((elem) => {
        const s = elem.getAttribute("data-parallax-accel");
        const x = (window.innerWidth - event.pageX * s) / 100;
        const y = (window.innerHeight - event.pageY * s) / 100;

        elem.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}

document.getElementsByClassName("header-text")[0].addEventListener("mousemove", moveParallax);

const selfAttributes = ["developer", "minimalist", "revolutionist", "hard-worker", "learner", "problem-solver", "programmer", "coder"];