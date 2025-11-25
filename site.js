window.addEventListener("load", () => {
    const welcome = document.getElementById("welcome");
    const logo = document.getElementById("logo");
    const button = document.getElementById("button");

    if (welcome) {
        welcome.animate(
            [
                { opacity: 0, transform: "translateY(40px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 1000, easing: "ease", fill: "forwards" }
        );
    }

    if (logo) {
        logo.animate(
            [
                { opacity: 0, transform: "translateY(40px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 1000, easing: "ease", fill: "forwards", delay: 300 }
        );
    }

    if (button) {
        button.animate(
            [
                { opacity: 0, transform: "translateY(40px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 1000, easing: "ease", fill: "forwards", delay: 500 }
        );
    }
});


// -------------------------
// MAP PAGE: Click Image → Show Form
// -------------------------
$(document).ready(function () {

    // When a user clicks any classroom image
    $(".click-image").on("click", function () {
        $("#popupForm").fadeIn(300);  // show the form
    });

});
