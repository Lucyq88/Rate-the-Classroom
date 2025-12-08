// Building Position Helper Tool
// This tool helps you position and resize buildings on the map

let positioningMode = false;
let selectedBuilding = null;
let buildingDragging = false;
let buildingStartX, buildingStartY, buildingStartLeft, buildingStartTop;

// Create helper UI
function createHelperUI() {
    const helperPanel = document.createElement('div');
    helperPanel.id = 'helper-panel';
    helperPanel.innerHTML = `
        <h3>Building Position Helper</h3>
        <p>Click a building, drag to move it</p>
        <div id="current-building">No building selected</div>
        <div id="size-control" style="display:none;">
            <label>Size: <span id="size-value">10</span>%</label>
            <input type="range" id="size-slider" min="3" max="25" step="0.1" value="10">
        </div>
        <div id="position-info"></div>
        <button id="toggle-mode">Enable Positioning Mode</button>
        <button id="export-css" style="display:none;">Export CSS Values</button>
        <button id="copy-css" style="display:none;">Copy to Clipboard</button>
        <textarea id="css-output" style="display:none;" readonly></textarea>
    `;
    document.body.appendChild(helperPanel);

    // Add styles for helper panel
    const style = document.createElement('style');
    style.textContent = `
        #helper-panel {
            position: fixed;
            top: 10px;
            left: 10px;
            background: white;
            border: 3px solid #F9D956;
            padding: 15px;
            z-index: 10000;
            max-width: 300px;
            font-family: monospace;
            font-size: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        #helper-panel h3 {
            margin: 0 0 10px 0;
            color: #14174C;
        }
        #helper-panel button {
            margin: 5px 5px 5px 0;
            padding: 8px 12px;
            background: #F9D956;
            border: none;
            cursor: pointer;
            font-weight: bold;
            color: #14174C;
        }
        #helper-panel button:hover {
            background: #e0c34d;
        }
        #current-building {
            background: #f0f0f0;
            padding: 5px;
            margin: 10px 0;
            font-weight: bold;
            color: #14174C;
        }
        #position-info {
            background: #f9f9f9;
            padding: 8px;
            margin: 10px 0;
            font-size: 11px;
            border: 1px solid #ddd;
            min-height: 60px;
        }
        #css-output {
            width: 100%;
            height: 200px;
            margin-top: 10px;
            font-family: monospace;
            font-size: 11px;
            padding: 8px;
            border: 1px solid #ddd;
        }
        #size-control {
            background: #f9f9f9;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
        }
        #size-control label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        #size-slider {
            width: 100%;
            cursor: pointer;
        }
        .building-selected {
            outline: 3px solid #F9D956 !important;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // Wrap buildings only when positioning mode is activated
}

function wrapBuildings() {
    // Wrap buildings in containers for positioning
    document.querySelectorAll('.classrooms img').forEach(img => {
        // Skip if already wrapped
        if (img.parentElement.hasAttribute('data-building-id')) return;

        // Wrap image in a container
        const wrapper = document.createElement('div');
        const computedStyle = getComputedStyle(img);

        wrapper.style.position = 'absolute';
        wrapper.style.left = computedStyle.left;
        wrapper.style.top = computedStyle.top;
        wrapper.style.width = computedStyle.width;

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Reset img position within wrapper
        img.style.position = 'relative';
        img.style.left = '0';
        img.style.top = '0';
        img.style.width = '100%';

        // Store original ID on wrapper
        wrapper.id = img.id + '-wrapper';
        wrapper.dataset.buildingId = img.id;
    });
}

// Enable/disable positioning mode
document.addEventListener('DOMContentLoaded', function() {
    createHelperUI();

    const toggleBtn = document.getElementById('toggle-mode');
    const exportBtn = document.getElementById('export-css');
    const copyBtn = document.getElementById('copy-css');
    const cssOutput = document.getElementById('css-output');

    toggleBtn.addEventListener('click', function() {
        positioningMode = !positioningMode;
        if (positioningMode) {
            toggleBtn.textContent = 'Disable Positioning Mode';
            toggleBtn.style.background = '#ff6b6b';
            exportBtn.style.display = 'inline-block';
            wrapBuildings(); // Wrap buildings before enabling positioning
            enablePositioning();
        } else {
            toggleBtn.textContent = 'Enable Positioning Mode';
            toggleBtn.style.background = '#F9D956';
            exportBtn.style.display = 'none';
            copyBtn.style.display = 'none';
            cssOutput.style.display = 'none';
            disablePositioning();
        }
    });

    exportBtn.addEventListener('click', function() {
        const cssCode = generateCSS();
        cssOutput.value = cssCode;
        cssOutput.style.display = 'block';
        copyBtn.style.display = 'inline-block';
    });

    copyBtn.addEventListener('click', function() {
        cssOutput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    });

    // Size slider event listener
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');

    sizeSlider.addEventListener('input', function() {
        if (!selectedBuilding) return;

        const newSize = parseFloat(this.value);
        sizeValue.textContent = newSize.toFixed(1);
        selectedBuilding.style.width = newSize + '%';
        updateInfo();
    });
});

function enablePositioning() {
    // Disable the building click handlers from map.js
    $('.classrooms img').off('click');

    document.querySelectorAll('.classrooms > div[data-building-id]').forEach(wrapper => {
        // Make buildings selectable and draggable
        wrapper.style.cursor = 'move';
        wrapper.addEventListener('click', selectBuilding);
        wrapper.addEventListener('mousedown', startDrag);
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragResize);
}

function disablePositioning() {
    if (selectedBuilding) {
        selectedBuilding.classList.remove('building-selected');
        selectedBuilding = null;
    }

    // Hide size control
    document.getElementById('size-control').style.display = 'none';

    document.querySelectorAll('.classrooms > div[data-building-id]').forEach(wrapper => {
        wrapper.style.cursor = 'pointer';
        wrapper.removeEventListener('click', selectBuilding);
        wrapper.removeEventListener('mousedown', startDrag);
    });

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDragResize);

    // Re-enable the building click handlers from map.js
    location.reload(); // Simple reload to restore original state
}

function selectBuilding(e) {
    if (!positioningMode) return;

    e.stopPropagation();
    e.preventDefault();

    // Deselect previous
    if (selectedBuilding) {
        selectedBuilding.classList.remove('building-selected');
    }

    // Select new - get the wrapper div
    const clickedElement = e.target;
    if (clickedElement.hasAttribute('data-building-id')) {
        selectedBuilding = clickedElement;
    } else {
        selectedBuilding = clickedElement.closest('div[data-building-id]');
    }

    if (selectedBuilding) {
        selectedBuilding.classList.add('building-selected');

        // Show size control and set slider value
        const sizeControl = document.getElementById('size-control');
        const sizeSlider = document.getElementById('size-slider');
        const sizeValue = document.getElementById('size-value');

        sizeControl.style.display = 'block';

        // Get current width percentage
        const rect = selectedBuilding.getBoundingClientRect();
        const container = selectedBuilding.parentElement.getBoundingClientRect();
        const currentWidth = (rect.width / container.width) * 100;

        sizeSlider.value = currentWidth;
        sizeValue.textContent = currentWidth.toFixed(1);

        updateInfo();
    }
}

function startDrag(e) {
    if (!positioningMode || !selectedBuilding) return;

    buildingDragging = true;
    buildingStartX = e.clientX;
    buildingStartY = e.clientY;

    const rect = selectedBuilding.getBoundingClientRect();
    const container = selectedBuilding.parentElement.getBoundingClientRect();

    buildingStartLeft = ((rect.left - container.left) / container.width) * 100;
    buildingStartTop = ((rect.top - container.top) / container.height) * 100;

    e.preventDefault();
}

function onMouseMove(e) {
    if (!positioningMode || !selectedBuilding) return;

    const container = selectedBuilding.parentElement.getBoundingClientRect();

    if (buildingDragging) {
        const deltaX = e.clientX - buildingStartX;
        const deltaY = e.clientY - buildingStartY;

        const deltaXPercent = (deltaX / container.width) * 100;
        const deltaYPercent = (deltaY / container.height) * 100;

        const newLeft = buildingStartLeft + deltaXPercent;
        const newTop = buildingStartTop + deltaYPercent;

        selectedBuilding.style.left = newLeft + '%';
        selectedBuilding.style.top = newTop + '%';

        updateInfo();
    }
}

function stopDragResize() {
    buildingDragging = false;
}

function updateInfo() {
    if (!selectedBuilding) return;

    const buildingId = selectedBuilding.dataset.buildingId;
    const rect = selectedBuilding.getBoundingClientRect();
    const container = selectedBuilding.parentElement.getBoundingClientRect();

    const left = ((rect.left - container.left) / container.width) * 100;
    const top = ((rect.top - container.top) / container.height) * 100;
    const width = (rect.width / container.width) * 100;

    document.getElementById('current-building').textContent = `Selected: ${buildingId}`;
    document.getElementById('position-info').innerHTML = `
        <strong>Position:</strong><br>
        left: ${left.toFixed(2)}%<br>
        top: ${top.toFixed(2)}%<br>
        width: ${width.toFixed(2)}%
    `;
}

function generateCSS() {
    let css = '/* Updated building positions */\n\n';

    document.querySelectorAll('.classrooms > div[data-building-id]').forEach(wrapper => {
        const buildingId = wrapper.dataset.buildingId;
        const rect = wrapper.getBoundingClientRect();
        const container = wrapper.parentElement.getBoundingClientRect();

        const left = ((rect.left - container.left) / container.width) * 100;
        const top = ((rect.top - container.top) / container.height) * 100;
        const width = (rect.width / container.width) * 100;

        css += `#${buildingId}-wrapper {\n`;
        css += `    position: absolute;\n`;
        css += `    width: ${width.toFixed(2)}%;\n`;
        css += `    left: ${left.toFixed(2)}%;\n`;
        css += `    top: ${top.toFixed(2)}%;\n`;
        css += `}\n\n`;
    });

    return css;
}
