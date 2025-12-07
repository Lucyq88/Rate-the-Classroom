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
    const buildingNames = {
        "kresge": "Kresge College",
        "porter": "Porter College",
        "rcc": "Rachel Carson College",
        "oakes": "Oakes College",
        "music": "Music Center",
        "elena": "Elena Baskin Visual Arts",
        "thim": "Thimann Labs",
        "phy": "Physical Sciences",
        "jbaskin": "Jack Baskin Engineering",
        "jrl": "John R. Lewis College and Social Sciences",
        "science": "Science & Engineering Library",
        "earth": "Earth & Marine Sciences",
        "class12": "Classroom Unit",
        "mchenry": "McHenry Library",
        "cowell": "Cowell College",
        "stev": "Stevenson College",
        "huma": "Humanities",
        "crown": "Crown College",
        "merrill": "Merrill College"
    };

    // Populate the select dropdown
    const $buildingSelect = $("#building");
    Object.values(buildingNames).sort().forEach(name => {
        $buildingSelect.append(new Option(name, name));
    });

    // Building click handler
    $(".classrooms img").click(function() {
        const id = $(this).attr("id");
        const name = buildingNames[id] || id; // Fallback to ID if name not found
        
        $("#draggable-form").show(); // Show the form
        $buildingSelect.val(name); // Set the dropdown value
    });

    // Close form handler
    $("#close-form").click(function() {
        $("#draggable-form").hide();
    });

    $(".rating-group").each(function() {
        const $group = $(this);
        const inputId = $group.data("input-id");
        const $input = $("#" + inputId);
        let currentRating = 0;

        // Hover effect
        $group.find(".rate").hover(function() {
            let hoverValue = $(this).data("value");
            updateVisuals($group, hoverValue);
        }, function() {
            // Mouse leave - revert to current rating
            updateVisuals($group, currentRating);
        });

        // Click effect
        $group.find(".rate").click(function() {
            currentRating = $(this).data("value");
            $input.val(currentRating);
            updateVisuals($group, currentRating);
        });
    });

    function updateVisuals($container, value) {
        $container.find(".rate").each(function() {
            if ($(this).data("value") <= value) {
                $(this).addClass("filled");
            } else {
                $(this).removeClass("filled");
            }
        });
    }
});

const dragElement = document.getElementById("draggable-form");

let offsetX = 0, offsetY = 0, isDragging = false;

dragElement.addEventListener("mousedown", function(e) {
    // Prevent dragging when interacting with form inputs
    if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'LABEL'].includes(e.target.tagName)) {
        return;
    }

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

