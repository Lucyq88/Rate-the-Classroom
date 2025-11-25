const kresge = document.getElementById("kresge");
const porter = document.getElementById("porter");
const rcc = document.getElementById("rcc");
const oakes = document.getElementById("oakes");
const music = document.getElementById("music");
const elena = document.getElementById("elena");
const thim = document.getElementById("thim");
const phy = document.getElementById("phy");
const jbaskin = document.getElementById("jbaskin");
const jrl = document.getElementById("jrl");
const science = document.getElementById("science");
const earth = document.getElementById("earth");
const class12 = document.getElementById("class12");
const mchenry = document.getElementById("mchenry");
const cowell = document.getElementById("cowell");
const stev = document.getElementById("stev");
const huma = document.getElementById("huma");
const crown = document.getElementById("crown");
const merrill = document.getElementById("merrill");


$(document).ready(function() {
    $(".rate").click(function() {
       
        let count = parseInt($(this).attr("data-counter")) + 1;
        $(this).attr("data-counter", count);

     
        $(this).siblings(".counter-badge").text(count);

    
        $("#rating").val($(this).data("value"));
    });
});

const dragElement = document.getElementById("draggable-form");

let offsetX = 0, offsetY = 0, isDragging = false;

dragElement.addEventListener("mousedown", function(e) {
    isDragging = true;
    offsetX = e.clientX - dragElement.offsetLeft;
    offsetY = e.clientY - dragElement.offsetTop;
    dragElement.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function(e) {
    if (!isDragging) return;
    dragElement.style.left = (e.clientX - offsetX) + "px";
    dragElement.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", function() {
    isDragging = false;
    dragElement.style.cursor = "move";
});

