// --- 1. KONFIGURASI DAN IMPORTS ---
// Mengimpor perpustakaan yang diperlukan.
// CATATAN: Pastikan Anda telah mengimpor library Three.js, CSS2DRenderer, dan GSAP di file HTML.
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import contentData from './contentData.js';
import certificationDataSet from './sertifications.js';

// --- DATA KONTEN (Hardcoded untuk contoh) ---
const contentDataSet = [...contentData];

const certificationData = [...certificationDataSet];

const mainCertNodeData = {
    title: "Sertifikasi",
    kicker: "Pencapaian Profesional",
    type: "certification"
};


// --- PERUBAHAN: Mengatur ulang urutan node untuk posisi yang lebih baik ---
const aboutData = contentDataSet.find(item => item.type === 'about');
const projectData = contentDataSet.filter(item => item.type !== 'about');
const allContentData = [aboutData, mainCertNodeData, ...projectData];


// --- 2. INISIALISASI THREE.JS & RENDERER ---
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('three-wrap').appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const cameraRig = new THREE.Group();
scene.add(cameraRig);
cameraRig.add(camera);
camera.position.set(0, 0, 150);

const fluidGeo = new THREE.PlaneGeometry(3000, 3000, 350, 350);
const fluidMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xffffff) } },
    vertexShader: `
        uniform float uTime;
        varying float vNoise;
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod(i, 289.0 );
            vec4 p = permute( permute( i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m; 
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) ); 
        } 
        void main() { 
            vec3 pos = position;
            float noise = snoise(vec3(pos.x * 0.015, pos.y * 0.015, uTime * 0.1));
            pos.z += noise * 15.0;
            vNoise = noise;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
        }
    `,
    fragmentShader: `
        varying float vNoise;
        uniform vec3 uColor;
        void main() {
            vec3 color = uColor * (vNoise * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    wireframe: true
});
const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
fluidMesh.position.z = -50;
scene.add(fluidMesh);

// --- 3. 3D OBJECTS: NODES & CONNECTIONS ---
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

const certNodes = [];
let isCertExpanded = false;
let currentExpansionCenter = null;
let originalCertNodePosition = null; // --- PERUBAHAN: Menyimpan posisi asli node sertifikasi ---


allContentData.forEach((data, i) => {
    const phi = Math.acos(-1 + (2 * i) / allContentData.length);
    const theta = Math.sqrt(allContentData.length * Math.PI) * phi;
    const radius = 40;

    let nodeColor;
    if (data.type === 'about') {
        nodeColor = 0x00ff00;
    } else if (data.type === 'certification') {
        nodeColor = 0xffa500;
    } else {
        nodeColor = 0xffffff;
    }

    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const glowMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const node = new THREE.Group();
    node.position.setFromSphericalCoords(radius, phi, theta);
    node.scale.set(0, 0, 0);
    node.userData = data;

    const dotGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const dot = new THREE.Mesh(dotGeo, nodeMaterial);
    dot.name = 'dot';
    node.add(dot);

    const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.name = 'glow';
    node.add(glow);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'project-label';
    labelDiv.textContent = data.title;
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, 2.5, 0);
    label.name = 'label';
    node.add(label);

    nodeGroup.add(node);
});

function createConnections(group) {
    const connections = [];
    group.children.forEach((node, index) => {
        const distances = group.children
            .map((otherNode, otherIndex) => ({
                distance: node.position.distanceTo(otherNode.position),
                node: otherNode,
                index: otherIndex
            }))
            .filter(item => item.index !== index)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2);

        distances.forEach(({ node: targetNode }) => {
            const midPoint = new THREE.Vector3().addVectors(node.position, targetNode.position).multiplyScalar(0.5);
            midPoint.add(new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ));

            const curve = new THREE.QuadraticBezierCurve3(
                node.position,
                midPoint,
                targetNode.position
            );
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const connection = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            }));
            connection.userData = { startNode: node, endNode: targetNode, initialPoints: points };
            connections.push(connection);
        });
    });
    return connections;
}

const mainConnections = createConnections(nodeGroup);
mainConnections.forEach(conn => nodeGroup.add(conn));

// --- 4. INTERAKSI DAN KONTROL UI ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const articlePanel = document.getElementById('article-panel');
const aboutPanel = document.getElementById('about-panel');
const audioControl = document.getElementById('audio-control');

const audioHover = document.getElementById('audio-hover');
const audioOpen = document.getElementById('audio-open');
const audioClose = document.getElementById('audio-hover');
const audioExpand = document.getElementById('audio-expand');
const audioIntro = document.getElementById('audio-intro');
audioOpen.volume = 1.0;
audioIntro.volume = 0.7;
let isAudioUnlocked = !1;

let intersectedObject = null;
let isCameraAnimating = false;
let cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorCurrent = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.error("Audio playback failed:", e));
    }
}

function isPanelVisible() {
    return articlePanel.classList.contains('visible') || aboutPanel.classList.contains('visible');
}

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    cursorTarget.x = event.clientX;
    cursorTarget.y = event.clientY;
});

window.addEventListener('click', (event) => {
    const targetIsPanel = event.target.closest('.article-content') || event.target.closest('.about-content');

    if (isPanelVisible() && !targetIsPanel) {
        playSound(audioClose);
        articlePanel.classList.remove('visible');
        aboutPanel.classList.remove('visible');
    } else if (!isPanelVisible() && intersectedObject) {
        const data = intersectedObject.userData;
        // --- PERUBAHAN LOGIKA KLIK ---
        if (data.type === 'certification') {
            if (!isCertExpanded) {
                playSound(audioExpand);
                expandCertifications(intersectedObject);
            } else {
                playSound(audioClose);
                collapseCertifications(intersectedObject);
            }
        } else if (data.type === 'cert-item') {
            window.open(data.link, '_blank');
        } else if (data.type === 'project' || data.type === 'about') {
            playSound(audioOpen);
            showArticle(data);
        }
    }
});

if (document.getElementById('close-article-btn')) {
    document.getElementById('close-article-btn').addEventListener('click', () => {
        playSound(audioClose);
        articlePanel.classList.remove('visible');
    });
}

if (document.getElementById('close-about-btn')) {
    document.getElementById('close-about-btn').addEventListener('click', () => {
        playSound(audioClose);
        aboutPanel.classList.remove('visible');
    });
}

function expandCertifications(mainCertNode) {
    if (isCertExpanded) return;
    isCertExpanded = true;

    // --- PERUBAHAN: Animasikan kamera untuk zoom out ---
    gsap.to(camera.position, { z: 150, duration: 1, ease: "power3.out" });

    originalCertNodePosition = mainCertNode.position.clone();
    const expansionCenter = mainCertNode.getWorldPosition(new THREE.Vector3());
    currentExpansionCenter = expansionCenter.clone();
    const backPosition = expansionCenter.clone().add(new THREE.Vector3(0, 30, 0));

    gsap.to(mainCertNode.position, { ...backPosition, duration: 1, ease: "power3.out" });
    const mainLabel = mainCertNode.getObjectByName('label')?.element;
    if (mainLabel) mainLabel.textContent = "Back";

    nodeGroup.children.forEach(child => {
        if (child.userData.type && child !== mainCertNode) {
            gsap.to(child.getObjectByName('dot').material, { opacity: 0.1, duration: 0.5 });
            gsap.to(child.getObjectByName('glow').material, { opacity: 0.05, duration: 0.5 });
            const label = child.getObjectByName('label')?.element;
            if (label) gsap.to(label, { opacity: 0, duration: 0.5, pointerEvents: 'none' });
        }
    });

    const certRadius = 25;
    certificationData.forEach((cert, i) => {
        const phi = Math.acos(-1 + (2 * i) / certificationData.length);
        const theta = Math.sqrt(certificationData.length * Math.PI) * phi;
        const certNode = new THREE.Group();
        certNode.position.copy(expansionCenter);
        certNode.scale.set(0, 0, 0);
        certNode.userData = { ...cert, type: 'cert-item' };

        const dotGeo = new THREE.SphereGeometry(0.7, 32, 32);
        const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.9 }));
        dot.name = 'dot';
        certNode.add(dot);

        const glowGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, side: THREE.BackSide });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.name = 'glow';
        certNode.add(glow);

        const labelDiv = document.createElement('div');
        labelDiv.className = 'cert-label';
        labelDiv.textContent = cert.title;
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, 2.5, 0);
        label.name = 'label';
        certNode.add(label);

        scene.add(certNode);
        certNodes.push(certNode);

        const targetPosition = new THREE.Vector3().setFromSphericalCoords(certRadius, phi, theta).add(expansionCenter);
        gsap.to(certNode.position, { ...targetPosition, duration: 1, ease: "power3.out", delay: i * 0.05 });
        gsap.to(certNode.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "power3.out", delay: i * 0.05 });
    });
}

function collapseCertifications(mainCertNode) {
    if (!isCertExpanded || !currentExpansionCenter || !originalCertNodePosition) return;
    isCertExpanded = false;


    gsap.to(camera.position, { z: 100, duration: 1, ease: "power3.in" });
    
    gsap.to(mainCertNode.position, { ...originalCertNodePosition, duration: 1, ease: "power3.in" });
    const mainLabel = mainCertNode.getObjectByName('label')?.element;
    if (mainLabel) mainLabel.textContent = mainCertNode.userData.title;
    
    nodeGroup.children.forEach(child => {
        if (child.userData.type && child.userData.type !== 'certification') {
            gsap.to(child.getObjectByName('dot').material, { opacity: 0.9, duration: 0.5 });
            gsap.to(child.getObjectByName('glow').material, { opacity: 0.2, duration: 0.5 });
            const label = child.getObjectByName('label')?.element;
            if (label) gsap.to(label, { opacity: 1, duration: 0.5, pointerEvents: 'auto' });
        }
    });

    certNodes.forEach(node => {
        gsap.to(node.position, { ...currentExpansionCenter, duration: 1, ease: "power3.in" });
        gsap.to(node.scale, {
            x: 0, y: 0, z: 0, duration: 1, ease: "power3.in", onComplete: () => {
                while(node.children.length > 0){ 
                    node.remove(node.children[0]); 
                }
                scene.remove(node);
            }
        });
    });
    certNodes.length = 0;
    
    currentExpansionCenter = null;
    originalCertNodePosition = null;
}


function showArticle(data) {
    const isAbout = data.type === 'about';
    const panel = isAbout ? aboutPanel : articlePanel;
    if (isAbout) {
        document.getElementById('about-title').textContent = data.title;
        document.getElementById('about-kicker').textContent = data.kicker;
        document.getElementById('about-desc').textContent = data.desc;
        document.getElementById('about-exp').innerHTML = data.exp.replace(/\n/g, '<br>');
        document.getElementById('about-skills').innerHTML = data.skills.replace(/\n/g, '<br>');
        document.getElementById('about-image').src = data.image;
        panel.classList.add('visible');
    } else {
        document.getElementById('article-kicker').textContent = data.kicker;
        document.getElementById('article-title').textContent = data.title;
        document.getElementById('article-desc').textContent = data.desc;
        document.getElementById('article-image').src = data.image;
        document.getElementById('article-image').alt = `Dokumentasi untuk ${data.title}`;
        const featuresContainer = document.getElementById('article-features-container');
        if (data.features) {
            document.getElementById('article-features').innerHTML = data.features.replace(/\n/g, '<br>');
            if (featuresContainer) featuresContainer.style.display = 'block';
        } else {
            if (featuresContainer) featuresContainer.style.display = 'none';
        }
        const tagsContainer = document.getElementById('article-tags');
        tagsContainer.innerHTML = '';
        if (data.tags) {
            data.tags.forEach(tagText => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = tagText;
                tagsContainer.appendChild(tag);
            });
        }
        panel.classList.add('visible');
    }
}

// --- 5. MAIN ANIMATION LOOP ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    fluidMat.uniforms.uTime.value = elapsedTime;

    // Gerakan kursor custom
    cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.15;
    cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.15;
    if (cursorDot) {
        cursorDot.style.left = `${cursorTarget.x}px`;
        cursorDot.style.top = `${cursorTarget.y}px`;
    }
    if (cursorRing) {
        cursorRing.style.left = `${cursorCurrent.x}px`;
        cursorRing.style.top = `${cursorCurrent.y}px`;
    }

    const lerpFactorCamera = 0.05;
    cameraRig.rotation.x += (-mouse.y * 0.3 - cameraRig.rotation.x) * lerpFactorCamera;
    cameraRig.rotation.y += (mouse.x * 0.3 - cameraRig.rotation.y) * lerpFactorCamera;

    if (!isCertExpanded) {
        nodeGroup.rotation.y = elapsedTime * 0.1;
    }

    nodeGroup.children.forEach(child => {
        if (child instanceof THREE.Line) {
            child.material.opacity = 0.3 + Math.sin(elapsedTime * 2) * 0.1;
        }
    });

    if (!isPanelVisible()) {
        raycaster.setFromCamera(mouse, camera);
        let objectsToIntersect = [];
        // --- PERUBAHAN: Tentukan objek yang bisa di-hover saat sertifikat terbuka ---
        if (isCertExpanded) {
            const mainCertNode = nodeGroup.children.find(node => node.userData.type === 'certification');
            objectsToIntersect = [...certNodes, mainCertNode].filter(obj => obj !== null);
        } else {
            objectsToIntersect = nodeGroup.children.filter(child => child.userData.type !== undefined);
        }

        const intersects = raycaster.intersectObjects(objectsToIntersect, true);
        
        let hoverableGroup = null;
        if (intersects.length > 0) {
            let currentObject = intersects[0].object;
            while (currentObject.parent) {
                if (currentObject.userData && (currentObject.userData.type === 'project' || currentObject.userData.type === 'about' || currentObject.userData.type === 'certification' || currentObject.userData.type === 'cert-item')) {
                    hoverableGroup = currentObject;
                    break;
                }
                currentObject = currentObject.parent;
            }
        }
        
        if (hoverableGroup && hoverableGroup !== intersectedObject) {
            playSound(audioHover);
            intersectedObject = hoverableGroup;
            if (cursorRing) cursorRing.classList.add('hover');
        } else if (!hoverableGroup) {
            intersectedObject = null;
            if (cursorRing) cursorRing.classList.remove('hover');
        }

    } else {
        intersectedObject = null;
        if (cursorRing) cursorRing.classList.remove('hover');
    }

    // --- PERUBAHAN: Sesuaikan daftar node untuk animasi hover ---
    const mainCertNode = nodeGroup.children.find(node => node.userData.type === 'certification');
    const allNodes = [...nodeGroup.children.filter(c => c.isGroup && c !== mainCertNode), ...certNodes, mainCertNode].filter(n => n);

    allNodes.forEach(node => {
        const dot = node.getObjectByName('dot');
        const glow = node.getObjectByName('glow');
        const label = node.getObjectByName('label')?.element;

        if (!dot || !glow) return;

        const isHovered = (node === intersectedObject);
        const targetDotScale = isHovered ? 1.5 : 1.0;
        const targetGlowScale = isHovered ? 2.5 : 1.5;
        const targetGlowOpacity = isHovered ? 0.5 : 0.2;
        const lerpFactorHover = 0.1;

        dot.scale.x += (targetDotScale - dot.scale.x) * lerpFactorHover;
        dot.scale.y += (targetDotScale - dot.scale.y) * lerpFactorHover;
        dot.scale.z += (targetDotScale - dot.scale.z) * lerpFactorHover;

        glow.scale.x += (targetGlowScale - glow.scale.x) * lerpFactorHover;
        glow.scale.y += (targetGlowScale - glow.scale.y) * lerpFactorHover;
        glow.scale.z += (targetGlowScale - glow.scale.z) * lerpFactorHover;

        glow.material.opacity += (targetGlowOpacity - glow.material.opacity) * lerpFactorHover;

        if (label) {
            if (isHovered) {
                label.classList.add('visible');
            } else {
                label.classList.remove('visible');
            }
        }
    });

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// --- 6. INISIALISASI DAN EVENT LISTENERS ---
const audio = document.getElementById('bg-audio');
const audioIcon = document.getElementById('audio-icon');
let isPlaying = false;
if (audio) audio.volume = 0.5;

if (audioControl) {
    audioControl.addEventListener('click', () => {
        if (isPlaying) {
            if (audio) audio.pause();
            audioControl.classList.remove('playing');
            audioIcon.textContent = '♪';
        } else {
            if (audio) audio.play().catch(e => console.error("Audio playback failed:", e));
            audioControl.classList.add('playing');
            audioIcon.textContent = '♫';
        }
        isPlaying = !isPlaying;
    });
}

function startExperience() {
    gsap.fromTo(camera.position, {
        z: 250
    }, {
        z: 100,
        duration: 2.5,
        ease: "power4.out",
        onStart: () => {
            playSound(audioIntro)
        }
    });
    nodeGroup.children.forEach((node, i) => {
        gsap.to(node.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power4.out",
            delay: 0.5 + i * 0.1
        })
    })
}

nodeGroup.children.forEach((node, i) => {
    gsap.to(node.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        ease: "power4.out",
        delay: 0.5 + i * 0.1
    });
});

document.getElementById('start-btn').addEventListener('click', () => {
    isAudioUnlocked = !0;
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    startExperience();
    startScreen.addEventListener('transitionend', () => startScreen.remove())
});
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
