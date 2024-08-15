// Placeholder for JavaScript functionality

document.addEventListener("DOMContentLoaded", function () {
    console.log("Website loaded successfully!");
});

// Modal functionality
function openModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Create close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;

    // Create Three.js container
    const threejsContainer = document.createElement('div');
    threejsContainer.id = 'threejs-container';

    // Append elements
    modalContent.appendChild(closeButton);
    modalContent.appendChild(threejsContainer);
    modal.appendChild(modalContent);

    // Append modal to body
    document.body.appendChild(modal);

    // Initialize Three.js scene
    initializeThreeJS();
}

function closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        document.body.removeChild(modal); // Completely remove the modal from DOM
    }

    
}

// Basic Three.js setup
function initializeThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
    renderer.setClearColor(0xFFFFFF);

    const container = document.getElementById('threejs-container');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        console.error('Three.js container not found');
        return;
    }

    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.screenSpacePanning = false;
    // controls.minDistance = 2;
    // controls.maxDistance = 10;

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const object1 = new THREE.Mesh(geometry, material);
    // scene.add(object1);

    // // Load the GLTF model with textures
    console.log(THREE)
    const rgbeLoader = new THREE.RGBELoader();
    const gltfLoader = new THREE.GLTFLoader();
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 4;
    let object;
    rgbeLoader.load("wooden_table/MR_INT-002_BathroomHard_Pierre.hdr", function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        
        gltfLoader.load("wooden_table/scene.gltf", function(gltf) {
            const model = gltf.scene;
            scene.add(model);
            object = model;
        });
    });

    camera.position.set(3,3,3);
    controls.update()
    
    function animate(time){
        // object.rotation.x += 0.01;
        // object.rotation.y += 0.01;
    
        if(object)
            object.rotation.y = - time / 3000
        renderer.render(scene, camera);
    }
    
    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        }
    });

    // Close modal when clicking outside or pressing escape
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('myModal');
        if (modal && event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

