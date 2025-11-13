let scene, camera, renderer, moon;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let previousMoonTime = 0;
let previousStarTime = 0;
let previousDataUpdate = 0;
let rotationSpeed = 0.02;
let autoRotate = true;

let targetQuaternion = new THREE.Quaternion();
const rotationSpeedFactor = 0.05;

let angularVelocity = { x: 0, y: 0, z: 0 };
const dragCoefficient = 0.05;
const minAngularVelocity = 0.002;
let isInertiaActive = false;

let stars, stars2;
const starFieldSize = 800;
const starSpeed = 0.5;

const apolloMissions = {
    11: {
        name: "APOLLO 11",
        date: "Julio 20, 1969",
        crew: "Neil Armstrong, Buzz Aldrin, Michael Collins",
        achievement: "Primer alunizaje tripulado - Mar de la Tranquilidad",
        duration: "8 días, 3 horas, 18 minutos",
        samples: "21.5 kg de rocas lunares"
    },
    12: {
        name: "APOLLO 12",
        date: "Noviembre 19, 1969", 
        crew: "Charles Conrad, Alan Bean, Richard Gordon",
        achievement: "Alunizaje de precisión - Océano de las Tormentas",
        duration: "10 días, 4 horas, 36 minutos",
        samples: "34.3 kg de rocas lunares"
    },
    14: {
        name: "APOLLO 14",
        date: "Febrero 5, 1971",
        crew: "Alan Shepard, Edgar Mitchell, Stuart Roosa",
        achievement: "Primera transmisión en color desde la Luna",
        duration: "9 días, 2 minutos",
        samples: "42.9 kg de rocas lunares"
    },
    15: {
        name: "APOLLO 15",
        date: "Julio 30, 1971",
        crew: "David Scott, James Irwin, Alfred Worden",
        achievement: "Primer uso del Rover Lunar - Montes Apeninos",
        duration: "12 días, 7 horas, 12 minutos",
        samples: "77.3 kg de rocas lunares"
    },
    16: {
        name: "APOLLO 16",
        date: "Abril 21, 1972", 
        crew: "John Young, Charles Duke, Thomas Mattingly",
        achievement: "Exploración de las Tierras Altas - Cráter Descartes",
        duration: "11 días, 1 hora, 51 minutos",
        samples: "95.7 kg de rocas lunares"
    },
    17: {
        name: "APOLLO 17",
        date: "Diciembre 11, 1972",
        crew: "Eugene Cernan, Harrison Schmitt, Ronald Evans",
        achievement: "Último alunizaje tripulado - Valle Taurus-Littrow",
        duration: "12 días, 13 horas, 52 minutos",
        samples: "110.5 kg de rocas lunares"
    }
};

let availableMoonData = [];
const allMoonData = [
    "El diámetro de la Luna es de aproximadamente 3,474 kilómetros, lo que equivale a cerca de una cuarta parte del tamaño de la Tierra, aunque su volumen es apenas una cincuentava parte.",
    "La gravedad lunar es seis veces menor que la de la Tierra, lo que significa que una persona que pese 60 kilogramos aquí, allá pesaría solo 10.",
    "La distancia media entre la Tierra y la Luna es de 384,400 kilómetros, pero puede variar debido a la forma elíptica de su órbita.",
    "La Luna se formó hace alrededor de 4.5 mil millones de años, probablemente a partir de los restos de una colisión entre la Tierra primitiva y un objeto del tamaño de Marte llamado Theia.",
    "El día lunar, es decir, el tiempo que tarda en rotar completamente sobre su eje, dura 27.3 días terrestres, exactamente el mismo tiempo que tarda en dar una vuelta a la Tierra, por eso siempre vemos la misma cara.",
    "La Luna no tiene una atmósfera como la nuestra; en su lugar posee una exosfera extremadamente delgada compuesta por helio, sodio, potasio y otros gases en cantidades mínimas.",
    "Las temperaturas lunares son extremas: durante el día pueden alcanzar los 127°C y en la noche descender hasta -173°C.",
    "La superficie lunar está cubierta por regolito, una capa de polvo y fragmentos rocosos producto de miles de millones de años de impactos de meteoritos.",
    "La cara visible de la Luna está dominada por grandes llanuras oscuras llamadas mares lunares, que en realidad son antiguos flujos de lava solidificada.",
    "Los mares lunares fueron nombrados en latín por los astrónomos del Renacimiento, quienes creían que eran océanos; de ahí nombres como Mare Tranquillitatis (Mar de la Tranquilidad) o Mare Imbrium (Mar de la Lluvia).",
    "La Luna tiene más de 1.3 millones de cráteres identificados, algunos de los cuales superan los 200 kilómetros de diámetro.",
    "El cráter más grande de la Luna es el Aitken del Polo Sur, con aproximadamente 2,500 kilómetros de diámetro y 13 kilómetros de profundidad.",
    "Los impactos que formaron los cráteres ocurrieron hace miles de millones de años, principalmente durante un periodo llamado Bombardeo Intenso Tardío.",
    "Las huellas de los astronautas de las misiones Apollo todavía permanecen intactas, ya que no hay viento ni lluvia que las borre.",
    "La primera nave en impactar la Luna fue la soviética Luna 2 en 1959, marcando el primer objeto humano en tocar otro cuerpo celeste.",
    "En 1969, la misión Apollo 11 llevó a los primeros humanos a la superficie lunar: Neil Armstrong y Buzz Aldrin caminaron sobre el Mar de la Tranquilidad.",
    "Entre 1969 y 1972, un total de seis misiones Apollo lograron alunizajes exitosos, llevando a doce hombres a la superficie lunar.",
    "Las misiones Apollo trajeron a la Tierra 382 kilogramos de rocas y muestras del suelo lunar, que todavía son estudiadas por científicos.",
    "La misión Apollo 17 en diciembre de 1972 fue la última misión tripulada a la Luna; desde entonces ningún ser humano ha vuelto a caminar sobre su superficie.",
    "El polvo lunar es tan fino como el talco, pero extremadamente abrasivo; se adhería a los trajes espaciales y causaba irritación en la piel y los ojos de los astronautas.",
    "El color grisáceo de la Luna se debe a los minerales del regolito, principalmente silicatos de hierro y magnesio.",
    "La Luna refleja aproximadamente el 12% de la luz solar que recibe, por eso su brillo varía según el ángulo de iluminación.",
    "Las fases lunares se repiten cada 29.5 días, en lo que se conoce como el mes sinódico, base de muchos calendarios antiguos.",
    "Los eclipses lunares se producen cuando la Tierra se interpone entre el Sol y la Luna, proyectando su sombra sobre ella.",
    "Durante un eclipse total, la Luna adquiere un tono rojizo porque la luz del Sol se refracta a través de la atmósfera terrestre.",
    "El lado oculto de la Luna —que nunca vemos desde la Tierra— es más accidentado y tiene muchos más cráteres que la cara visible.",
    "La Luna se aleja de la Tierra unos 3.8 centímetros cada año debido a la transferencia de momento angular entre ambos cuerpos.",
    "Desde la superficie lunar, el cielo siempre se ve negro, incluso durante el día, porque no hay atmósfera que disperse la luz solar.",
    "Los antiguos sumerios ya registraban las fases lunares hace más de 5,000 años, usándolas para medir el tiempo y planificar cosechas.",
    "La Luna influye en las mareas oceánicas mediante su atracción gravitacional sobre la masa de agua terrestre."
];

function init() {
    console.log("Iniciando aplicación Luna 3D...");
    
    availableMoonData = [...allMoonData];
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const container = document.getElementById('moon-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    createMoon();
    adjustResponsiveSize();
    createMovingStars();
    setupControls();
    setupEventListeners();
    createGlitchElements();
    createVHSEffect();
    startRandomEffects();

    previousMoonTime = performance.now();
    previousStarTime = performance.now();
    previousDataUpdate = performance.now();

    animate();
}

function createGlitchElements() {
    const hologramGlitch = document.createElement('div');
    hologramGlitch.className = 'hologram-glitch';
    document.getElementById('hologram-display').appendChild(hologramGlitch);
}

function createVHSEffect() {
    const vhsBlurEffect = document.createElement('div');
    vhsBlurEffect.style.position = 'fixed';
    vhsBlurEffect.style.top = '0';
    vhsBlurEffect.style.left = '0';
    vhsBlurEffect.style.width = '100%';
    vhsBlurEffect.style.height = '100%';
    vhsBlurEffect.style.pointerEvents = 'none';
    vhsBlurEffect.style.zIndex = '35';
    vhsBlurEffect.style.background = 'transparent';
    vhsBlurEffect.id = 'vhs-blur-effect';
    
    vhsBlurEffect.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 10%, 0% 10%)';
    
    document.body.appendChild(vhsBlurEffect);
}

function startRandomEffects() {
    setInterval(() => {
        if (Math.random() < 0.15) {
            applyVHSBlur();
        }
    }, 2000);

    setInterval(() => {
        if (Math.random() < 0.1) {
            triggerScreenGlitch();
        }
    }, 3000);
}

function applyVHSBlur() {
    const effect = document.getElementById('vhs-blur-effect');
    if (effect) {
        effect.classList.remove('vhs-blur');
        void effect.offsetWidth;
        effect.classList.add('vhs-blur');
        
        setTimeout(() => {
            effect.classList.remove('vhs-blur');
        }, 200);
    }
}

function triggerScreenGlitch() {
    const glitchElements = document.querySelectorAll('.glitch-effect, .hologram-glitch');
    glitchElements.forEach(element => {
        element.style.animation = 'none';
        void element.offsetWidth;
        element.style.animation = '';
    });
}

function createMovingStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 800;
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * starFieldSize;
        positions[i + 1] = (Math.random() - 0.5) * starFieldSize;
        positions[i + 2] = (Math.random() - 0.5) * starFieldSize;
        
        sizes[i / 3] = Math.random() * 1.5 + 0.5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });

    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const starsGeometry2 = new THREE.BufferGeometry();
    const starsCount2 = 1200;
    const positions2 = new Float32Array(starsCount2 * 3);
    const sizes2 = new Float32Array(starsCount2);

    for (let i = 0; i < starsCount2 * 3; i += 3) {
        positions2[i] = (Math.random() - 0.5) * starFieldSize;
        positions2[i + 1] = (Math.random() - 0.5) * starFieldSize;
        positions2[i + 2] = (Math.random() - 0.5) * starFieldSize;
        
        sizes2[i / 3] = Math.random() * 1 + 0.3;
    }

    starsGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
    starsGeometry2.setAttribute('size', new THREE.BufferAttribute(sizes2, 1));

    const starsMaterial2 = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 1.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    stars2 = new THREE.Points(starsGeometry2, starsMaterial2);
    scene.add(stars2);
}

function updateStars() {
    if (!stars || !stars2) return;

    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - previousStarTime) / 1000, 0.1);
    previousStarTime = currentTime;

    const positions = stars.geometry.attributes.position.array;
    const positions2 = stars2.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += starSpeed * deltaTime * 60;
        
        if (positions[i + 2] > 50) {
            positions[i] = (Math.random() - 0.5) * starFieldSize;
            positions[i + 1] = (Math.random() - 0.5) * starFieldSize;
            positions[i + 2] = -starFieldSize / 2;
        }
    }
    
    for (let i = 0; i < positions2.length; i += 3) {
        positions2[i + 2] += starSpeed * 2 * deltaTime * 60;
        
        if (positions2[i + 2] > 50) {
            positions2[i] = (Math.random() - 0.5) * starFieldSize;
            positions2[i + 1] = (Math.random() - 0.5) * starFieldSize;
            positions2[i + 2] = -starFieldSize / 2;
        }
    }
    
    stars.geometry.attributes.position.needsUpdate = true;
    stars2.geometry.attributes.position.needsUpdate = true;
}

function updateRealTimeData() {
    const currentTime = performance.now();
    if (currentTime - previousDataUpdate < 1000) return;
    
    previousDataUpdate = currentTime;
    
    const timeVariation = Date.now() * 0.0001;
    const distance = 384400 + Math.sin(timeVariation) * 1000;
    const speed = 1.02 + Math.cos(timeVariation * 2) * 0.1;
    
    const tempPhase = Math.sin(timeVariation * 0.5);
    const currentTemp = tempPhase > 0 ? 
        Math.round(20 + tempPhase * 107) : 
        Math.round(-150 - tempPhase * 23);
    
    document.getElementById('earth-distance').textContent = `${Math.round(distance).toLocaleString()} km`;
    document.getElementById('orbital-speed').textContent = `${speed.toFixed(2)} km/s`;
    document.getElementById('surface-temp').textContent = `${currentTemp}°C`;
}

function createMoon() {
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        emissive: 0x222222,
        specular: 0x444444,
        shininess: 5,
        wireframe: false,
        flatShading: true
    });

    moon = new THREE.Mesh(geometry, material);
    moon.castShadow = true;
    moon.receiveShadow = true;

    const wireframeGeometry = new THREE.IcosahedronGeometry(2.01, 4);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    moon.add(wireframe);

    for (let i = 0; i < 12; i++) {
        createRandomCrater();
    }

    scene.add(moon);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 5, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function createRandomCrater() {
    const craterSize = 0.08 + Math.random() * 0.2;
    createCraterOnMoon(getRandomMoonPosition(), craterSize);
}

function createCraterOnMoon(position, size) {
    const craterGeometry = new THREE.SphereGeometry(size, 6, 4);
    const craterMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        flatShading: true,
        emissive: 0x111111
    });
    
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    
    crater.position.copy(position);
    crater.position.normalize().multiplyScalar(2.05);
    
    crater.lookAt(0, 0, 0);
    crater.rotateX(Math.PI);
    
    moon.add(crater);
}

function getRandomMoonPosition() {
    const phi = Math.acos(-1 + Math.random() * 2);
    const theta = Math.random() * 2 * Math.PI;
    
    return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
    );
}

function setupControls() {
    const nasaBtn = document.getElementById('nasa-mode');
    const closeHologram = document.getElementById('close-hologram');
    const jumpSimulator = document.getElementById('jump-simulator');

    if (nasaBtn) nasaBtn.addEventListener('click', toggleNasaMode);
    if (closeHologram) closeHologram.addEventListener('click', closeHologramDisplay);
    if (jumpSimulator) jumpSimulator.addEventListener('click', simulateLunarJump);

    document.querySelectorAll('.mission-btn[data-mission]').forEach(btn => {
        btn.addEventListener('click', function() {
            const missionNumber = this.getAttribute('data-mission');
            showApolloMissionInfo(missionNumber);
        });
    });

    document.querySelectorAll('.phase').forEach(phase => {
        phase.addEventListener('click', function() {
            document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            showMoonPhaseInfo(this.getAttribute('data-phase'));
        });
    });
}

function showApolloMissionInfo(missionNumber) {
    const mission = apolloMissions[missionNumber];
    if (!mission) return;

    const missionInfo = `
        <strong>${mission.name}</strong><br>
        <strong>Fecha:</strong> ${mission.date}<br>
        <strong>Tripulación:</strong> ${mission.crew}<br>
        <strong>Logro:</strong> ${mission.achievement}<br>
        <strong>Duración:</strong> ${mission.duration}<br>
        <strong>Muestras:</strong> ${mission.samples}
    `;

    showHologramInfo(`MISIÓN ${mission.name}`, missionInfo);
}

function showMoonPhaseInfo(phase) {
    const phaseInfo = {
        new: "FASE NUEVA: La Luna está entre la Tierra y el Sol, no visible desde la Tierra.",
        waxing: "LUNA CRECIENTE: Primer visible después de la Luna Nueva.",
        first: "CUARTO CRECIENTE: Mitad iluminada, visible por la tarde.",
        "waxing-g": "GIBOSA CRECIENTE: Más de la mitad iluminada.",
        full: "LUNA LLENA: Completamente iluminada, visible toda la noche."
    };

    showHologramInfo("FASE LUNAR", phaseInfo[phase] || "Información no disponible.");
}

function simulateLunarJump() {
    const earthJump = 0.5;
    const lunarJump = earthJump / 0.165;
    
    const result = `
        En la Tierra: ${earthJump.toFixed(1)} m de salto<br>
        En la Luna: ${lunarJump.toFixed(1)} m de salto<br>
        <em>¡Saltarías ${(lunarJump/earthJump).toFixed(1)} veces más alto!</em>
    `;
    
    document.getElementById('jump-result').innerHTML = result;
    
    const jumpBtn = document.getElementById('jump-simulator');
    jumpBtn.style.animation = 'none';
    setTimeout(() => {
        jumpBtn.style.animation = 'buttonGlitch 0.5s';
    }, 10);
}

function showHologramInfo(title, content) {
    const hologram = document.getElementById('hologram-display');
    const titleElement = document.getElementById('hologram-title');
    const dataElement = document.getElementById('hologram-data');
    
    if (hologram && titleElement && dataElement) {
        titleElement.textContent = title;
        dataElement.innerHTML = content;
        
        adjustHologramSize();
        
        hologram.classList.remove('hidden');
        applyEntranceGlitch(hologram);
        triggerScreenGlitch();
    }
}

function toggleNasaMode() {
    if (availableMoonData.length === 0) {
        availableMoonData = [...allMoonData];
    }
    
    const randomIndex = Math.floor(Math.random() * availableMoonData.length);
    const selectedData = availableMoonData[randomIndex];
    availableMoonData.splice(randomIndex, 1);
    
    showHologramInfo("DATOS LUNARES - NASA", selectedData);
}

function applyEntranceGlitch(element) {
    element.style.animation = 'none';
    
    element.style.transform = 'translate(-50%, -50%) scale(0.8) rotate(5deg)';
    element.style.opacity = '0';
    element.style.filter = 'hue-rotate(180deg) brightness(2)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        element.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
        element.style.opacity = '1';
        element.style.filter = 'hue-rotate(0deg) brightness(1)';
        
        setTimeout(() => {
            element.style.transition = '';
            element.style.animation = 'hologramFloat 3s ease-in-out infinite';
        }, 500);
    }, 100);
}

function adjustHologramSize() {
    const hologram = document.getElementById('hologram-display');
    const dataElement = document.getElementById('hologram-data');
    
    if (hologram && dataElement) {
        hologram.style.width = 'auto';
        hologram.style.height = 'auto';
        
        void hologram.offsetWidth;
        
        const contentHeight = dataElement.scrollHeight + 150;
        const contentWidth = Math.min(dataElement.scrollWidth + 100, 800);
        
        hologram.style.width = contentWidth + 'px';
        hologram.style.height = Math.min(contentHeight, 600) + 'px';
    }
}

function closeHologramDisplay() {
    const hologram = document.getElementById('hologram-display');
    if (hologram) {
        hologram.style.animation = 'none';
        hologram.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(-3deg)';
        hologram.style.opacity = '0.5';
        hologram.style.filter = 'hue-rotate(270deg) brightness(0.5)';
        
        setTimeout(() => {
            hologram.classList.add('hidden');
            hologram.style.transform = '';
            hologram.style.opacity = '';
            hologram.style.filter = '';
            hologram.style.animation = 'hologramFloat 3s ease-in-out infinite';
        }, 300);
    }
}

function setupEventListeners() {
    const container = document.getElementById('moon-container');
    if (!container) return;

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    
    window.addEventListener('resize', onWindowResize);
}
function onMouseDown(e) {
    isDragging = true;
    autoRotate = false;
    isInertiaActive = false;
    
    angularVelocity = { x: 0, y: 0, z: 0 };
    
    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
    previousMoonTime = performance.now();
}

function onMouseMove(e) {
    if (!isDragging || !moon) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - previousMoonTime) / 1000;
    
    if (deltaTime > 0) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        angularVelocity.x = deltaMove.y * 0.08;
        angularVelocity.y = deltaMove.x * 0.08;

        const deltaQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                deltaMove.y * 0.006,
                deltaMove.x * 0.006,
                0,
                'XYZ'
            ));

        moon.quaternion.premultiply(deltaQuaternion);

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
        previousMoonTime = currentTime;
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        
        const speed = Math.sqrt(angularVelocity.x * angularVelocity.x + angularVelocity.y * angularVelocity.y);
        if (speed > 0.2) {
            isInertiaActive = true;
            autoRotate = false;
        } else {
            isInertiaActive = false;
            targetQuaternion.copy(moon.quaternion);
            
            setTimeout(() => {
                autoRotate = true;
            }, 2000);
        }
    }
}

function onTouchStart(e) {
    if (e.touches.length === 1) {

        isDragging = true;
        autoRotate = false;
        isInertiaActive = false;
        angularVelocity = { x: 0, y: 0, z: 0 };

        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        previousMoonTime = performance.now();
    }
}

function onTouchMove(e) {
    if (!isDragging || !moon || e.touches.length !== 1) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - previousMoonTime) / 1000;

    if (deltaTime > 0) {
        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };

        const touchSensitivity = 0.15; 

        angularVelocity.x = deltaMove.y * touchSensitivity;
        angularVelocity.y = deltaMove.x * touchSensitivity;

        const deltaQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                deltaMove.y * 0.006,
                deltaMove.x * 0.006,
                0,
                'XYZ'
            ));

        moon.quaternion.premultiply(deltaQuaternion);

        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        previousMoonTime = currentTime;
    }
}

function applyInertia(deltaTime) {
    if (!moon) return false;
    
    angularVelocity.x *= Math.pow(dragCoefficient, deltaTime);
    angularVelocity.y *= Math.pow(dragCoefficient, deltaTime);
    
    const speed = Math.sqrt(angularVelocity.x * angularVelocity.x + angularVelocity.y * angularVelocity.y);
    
    if (speed < minAngularVelocity) {
        angularVelocity = { x: 0, y: 0, z: 0 };
        targetQuaternion.copy(moon.quaternion);
        
        setTimeout(() => {
            autoRotate = true;
        }, 1000);
        
        return false;
    }
    
    const deltaQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
            angularVelocity.x * deltaTime,
            angularVelocity.y * deltaTime,
            0,
            'XYZ'
        ));
    
    moon.quaternion.premultiply(deltaQuaternion);
    
    return true;
}

function adjustResponsiveSize() {
    if (!moon) return;

    if (window.innerWidth < 900) {
        moon.scale.set(0.5, 0.5, 0.5); 
    } else {
        moon.scale.set(1, 1, 1);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = performance.now();
    
    updateStars();
    
    updateRealTimeData();

    const moonDeltaTime = (currentTime - previousMoonTime) / 1000;
    previousMoonTime = currentTime;

    if (moon) {
        if (isInertiaActive) {
            const stillMoving = applyInertia(moonDeltaTime);
            if (!stillMoving) {
                isInertiaActive = false;
            }
        } else if (autoRotate && !isDragging) {
            const deltaQuaternion = new THREE.Quaternion()
                .setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed * 0.1);
            
            targetQuaternion.multiply(deltaQuaternion);
            
            moon.quaternion.slerp(targetQuaternion, rotationSpeedFactor);
        } else if (!isDragging && !isInertiaActive) {
            targetQuaternion.copy(moon.quaternion);
        }

        if (moon.children[0] && Math.random() < 0.02) {
            moon.children[0].material.opacity = 0.1 + Math.random() * 0.4;
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', init);