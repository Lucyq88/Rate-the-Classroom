window.addEventListener("load", () => {
    const welcome = document.getElementById("welcome");
    const logo = document.getElementById("logo");
    const button = document.getElementById("button")

    welcome.animate(
        [
            {opacity: 0, transform: "translateY(40px)"},
            {opacity: 1, transform: "translateY(0)"}
        ],
        {duration: 1000, easing: "ease", fill: "forwards"}
    );
    logo.animate(
        [
            { opacity: 0, transform: "translateY(40px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 1000, easing: "ease", fill: "forwards", delay: 300 }
    );
    button.animate(
        [
            { opacity: 0, transform: "translateY(40px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 1000, easing: "ease", fill: "forwards", delay: 500 }
    );
});
