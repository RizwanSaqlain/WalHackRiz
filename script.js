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

// Toggle chat visibility
// API endpoint URL
const API_URL = 'http://localhost:3000/chat'; // Update with your server URL if different

// Toggle chat visibility
function toggleChat() {
    const chatContainer = document.getElementById('chat-support');
    chatContainer.classList.toggle('hidden');
}

// Send message in chat
async function sendMessage(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (message) {
            // Add user message to chat
            const userMessage = document.createElement('p');
            userMessage.className = 'user-message';
            userMessage.textContent = message;

            const messagesContainer = document.querySelector('.messages');
            messagesContainer.appendChild(userMessage);

            // Clear input
            input.value = '';

            // Scroll to the bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Fetch response from the server
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // Add bot response to chat
                const botMessage = document.createElement('p');
                botMessage.className = 'bot-message';
                botMessage.textContent = data.response;
                messagesContainer.appendChild(botMessage);

                // Scroll to the bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error fetching the API response:', error);

                // Handle error response
                const errorMessage = document.createElement('p');
                errorMessage.className = 'bot-message';
                errorMessage.textContent = "Sorry, there was an error processing your message.";
                messagesContainer.appendChild(errorMessage);

                // Scroll to the bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }
}

// Attach toggle to "Contact Support" link
document.querySelector('a[href="#"]').addEventListener('click', (event) => {
    event.preventDefault();
    toggleChat();
});



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
    // First light (positioned at 5, 5, 5)
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    // Second light (positioned opposite at -5, -5, -5)
    const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

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

