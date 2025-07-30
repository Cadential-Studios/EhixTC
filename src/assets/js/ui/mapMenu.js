// Edoria Map System Prototype (Three.js)
// Press 'M' to open/close the map modal. Allows adding/editing points.
// Requires Three.js (add to index.html or load dynamically)

let mapModal = null;
let mapPoints = [];
let mapScene, mapCamera, mapRenderer, mapControls, mapRaycaster;
let mapCanvas, mapAddMode = false, selectedPoint = null;

function ensureThreeJs(cb) {
    if (window.THREE) return cb();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.min.js';
    script.onload = cb;
    document.head.appendChild(script);
}

export function showMapModal() {
    if (mapModal) return;
    ensureThreeJs(() => {
        // Modal
        mapModal = document.createElement('div');
        mapModal.id = 'map-modal';
        mapModal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[300]';
        mapModal.style.backdropFilter = 'blur(6px)';
        mapModal.tabIndex = 0;
        mapModal.innerHTML = `
            <div class="bg-gray-900 border-4 border-blue-500 rounded-xl shadow-2xl p-4 flex flex-col items-center relative max-w-3xl w-full mx-2">
                <div class="flex w-full justify-between items-center mb-2">
                    <h2 class="font-cinzel text-xl text-blue-200">World Map (Prototype)</h2>
                    <button id="close-map-btn" class="text-white bg-blue-700 hover:bg-blue-800 rounded px-3 py-1 font-bold">Close</button>
                </div>
                <div class="flex gap-2 mb-2 w-full">
                    <button id="add-point-btn" class="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 text-xs">Add Point</button>
                    <button id="edit-point-btn" class="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-2 py-1 text-xs">Edit Point</button>
                    <button id="delete-point-btn" class="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs">Delete Point</button>
                </div>
                <div id="map-canvas-container" class="w-full h-[400px] bg-gray-800 rounded shadow relative"></div>
                <div id="map-point-form" class="hidden mt-2 w-full bg-gray-800 rounded p-2">
                    <label class="block text-xs text-blue-200 mb-1">Point Name</label>
                    <input id="point-name-input" class="w-full rounded p-1 mb-1 bg-gray-700 text-white" type="text" />
                    <label class="block text-xs text-blue-200 mb-1">Description</label>
                    <textarea id="point-desc-input" class="w-full rounded p-1 bg-gray-700 text-white"></textarea>
                    <button id="save-point-btn" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-xs">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(mapModal);
        mapModal.focus();
        setupThreeMap();
        setupMapUI();
    });
}

function closeMapModal() {
    if (mapModal) {
        mapModal.remove();
        mapModal = null;
        if (mapRenderer) mapRenderer.dispose && mapRenderer.dispose();
        mapScene = mapCamera = mapRenderer = mapControls = mapRaycaster = null;
        mapCanvas = null;
        selectedPoint = null;
    }
}

function setupThreeMap() {
    // Setup Three.js scene
    mapScene = new window.THREE.Scene();
    mapCamera = new window.THREE.PerspectiveCamera(60, 3/2, 0.1, 1000);
    mapCamera.position.set(0, 0, 20);
    mapRenderer = new window.THREE.WebGLRenderer({ antialias: true });
    mapRenderer.setClearColor(0x23233a);
    mapRenderer.setSize(700, 400);
    mapCanvas = mapRenderer.domElement;
    document.getElementById('map-canvas-container').appendChild(mapCanvas);
    mapRaycaster = new window.THREE.Raycaster();

    // Controls (simple drag/zoom)
    // Optionally add OrbitControls if desired
    // ...

    // Add a simple plane as the map background
    const planeGeo = new window.THREE.PlaneGeometry(18, 10);
    const planeMat = new window.THREE.MeshBasicMaterial({ color: 0x2d3748 });
    const plane = new window.THREE.Mesh(planeGeo, planeMat);
    mapScene.add(plane);

    // Render loop
    function animate() {
        if (!mapModal) return;
        mapRenderer.render(mapScene, mapCamera);
        requestAnimationFrame(animate);
    }
    animate();

    renderMapPoints();
}

function renderMapPoints() {
    // Remove old points
    for (let i = mapScene.children.length - 1; i >= 0; i--) {
        const obj = mapScene.children[i];
        if (obj.userData && obj.userData.isMapPoint) mapScene.remove(obj);
    }
    // Add points
    mapPoints.forEach((pt, idx) => {
        const sphere = new window.THREE.Mesh(
            new window.THREE.SphereGeometry(0.18, 16, 16),
            new window.THREE.MeshBasicMaterial({ color: pt.color || 0x3b82f6 })
        );
        sphere.position.set(pt.x, pt.y, 0.1);
        sphere.userData = { isMapPoint: true, idx };
        mapScene.add(sphere);
    });
}

function setupMapUI() {
    document.getElementById('close-map-btn').onclick = closeMapModal;
    document.getElementById('add-point-btn').onclick = () => {
        mapAddMode = true;
        selectedPoint = null;
        document.getElementById('map-point-form').classList.remove('hidden');
        document.getElementById('point-name-input').value = '';
        document.getElementById('point-desc-input').value = '';
    };
    document.getElementById('edit-point-btn').onclick = () => {
        if (selectedPoint != null) {
            const pt = mapPoints[selectedPoint];
            document.getElementById('map-point-form').classList.remove('hidden');
            document.getElementById('point-name-input').value = pt.name || '';
            document.getElementById('point-desc-input').value = pt.desc || '';
        }
    };
    document.getElementById('delete-point-btn').onclick = () => {
        if (selectedPoint != null) {
            mapPoints.splice(selectedPoint, 1);
            selectedPoint = null;
            renderMapPoints();
        }
    };
    document.getElementById('save-point-btn').onclick = () => {
        const name = document.getElementById('point-name-input').value.trim();
        const desc = document.getElementById('point-desc-input').value.trim();
        if (mapAddMode) {
            // Add at center for now
            mapPoints.push({ x: 0, y: 0, name, desc, color: 0x3b82f6 });
        } else if (selectedPoint != null) {
            mapPoints[selectedPoint].name = name;
            mapPoints[selectedPoint].desc = desc;
        }
        document.getElementById('map-point-form').classList.add('hidden');
        mapAddMode = false;
        renderMapPoints();
    };
    // Keyboard: ESC closes
    mapModal.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMapModal();
    });
}

// Keyboard shortcut
window.addEventListener('keydown', e => {
    if (e.key === 'm' || e.key === 'M') {
        if (!mapModal) showMapModal();
        else closeMapModal();
    }
});
