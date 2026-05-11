// Khởi tạo Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Đăng ký ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Industrial Trust: cursor spotlight and reading progress
const root = document.documentElement;
const progressBar = document.querySelector('.scroll-progress');

window.addEventListener('pointermove', (event) => {
    root.style.setProperty('--cursor-x', `${event.clientX}px`);
    root.style.setProperty('--cursor-y', `${event.clientY}px`);
});

if (progressBar) {
    gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2
        }
    });
}

document.querySelectorAll('.nav a').forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    ScrollTrigger.create({
        trigger: target,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => link.classList.toggle('active', self.isActive)
    });
});

// Utility: Reveal Effects (Text Masking & Stagger)
const setupReveal = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        const items = sec.querySelectorAll('.stagger-item');
        if(items.length === 0) return;
        
        // Cài đặt vị trí ban đầu (dưới mặt phẳng mask)
        gsap.set(items, { yPercent: prefersReducedMotion ? 0 : 50, opacity: 0, filter: prefersReducedMotion ? 'none' : 'blur(8px)' });
        
        ScrollTrigger.create({
            trigger: sec,
            start: "top 75%",
            onEnter: () => {
                gsap.to(items, {
                    yPercent: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: prefersReducedMotion ? 0.01 : 1,
                    stagger: 0.1,
                    ease: "power4.out"
                });
            }
        });
    });
};
setupReveal();

// Parallax Layers
gsap.to('.layer-deep', {
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// Chương 1: Bối cảnh Vĩ mô (Map nodes & Zoom)
const mapNodes = document.querySelectorAll('.map-node');
const tlMap = gsap.timeline({
    scrollTrigger: {
        trigger: ".ch1-landscape",
        start: "top center",
        end: "bottom center",
        scrub: 1
    }
});

// Lan toả từ Nam ra Bắc
mapNodes.forEach((node, i) => {
    tlMap.to(node, {
        attr: { r: 8 },
        fill: "#F6B343",
        duration: 0.5
    }, i * 0.2);
});

tlMap.to('.vn-map', { opacity: 0, duration: 1 }, "+=0.5")
     .to('.zoom-target', { scale: 1, opacity: 1, duration: 1 }, "-=1");


// Chương 2: Vấn đề (Flash Overlay & Counter)
ScrollTrigger.create({
    trigger: ".ch2-painpoints",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => {
        gsap.to('.flash-overlay', { opacity: 1, duration: 0.1 }); // Flash dark
        // Start counter
        const counter = document.getElementById('bad-credit-counter');
        gsap.to(counter, {
            innerHTML: 50,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: "power2.out"
        });
        document.querySelector('.vibrating-number').classList.add('vibrating');
    },
    onLeaveBack: () => {
        gsap.to('.flash-overlay', { opacity: 0, duration: 0.3 }); // Back to light
        document.querySelector('.vibrating-number').classList.remove('vibrating');
    },
    onLeave: () => {
        gsap.to('.flash-overlay', { opacity: 0, duration: 0.3 });
    },
    onEnterBack: () => {
        gsap.to('.flash-overlay', { opacity: 1, duration: 0.3 });
    }
});

// 3D Card Hover Effect
const cards = document.querySelectorAll('.card-3d');
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.1,
            ease: "none"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// Chương 3: Giải pháp (Phone interaction)
const btn = document.getElementById('withdraw-btn');
const sweep = document.querySelector('.sweep-light');

if(btn) {
    btn.addEventListener('click', () => {
        // Nút đổi trạng thái
        btn.classList.add('success-state');
        btn.innerText = "Đã giải ngân";
        document.body.classList.add('disbursement-complete');
        
        // Sweep effect lan toả toàn màn hình
        gsap.to(sweep, {
            scale: 200, // Đủ lớn để lấp màn hình
            duration: 1.5,
            ease: "power3.inOut",
            onComplete: () => {
                gsap.to(sweep, { opacity: 0, duration: 0.5 });
            }
        });

        gsap.fromTo('.earned-ring', {
            scale: 0.92,
            boxShadow: '0 0 0 rgba(246,179,67,0)'
        }, {
            scale: 1.08,
            boxShadow: '0 0 70px rgba(163,230,53,0.38)',
            duration: 0.55,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
}

// Chương 4: Exploded View
ScrollTrigger.create({
    trigger: ".ch4-engine",
    start: "top center",
    onEnter: () => {
        document.querySelector('.exploded-scene')?.classList.add('scene-active');
    }
});

// Mouse tracking for exploded view
const engineSection = document.querySelector('.ch4-engine');
const scene = document.querySelector('.exploded-scene');

if(engineSection && scene) {
    engineSection.addEventListener('mousemove', e => {
        if(!scene.classList.contains('scene-active')) return;
        
        const x = (e.clientX / window.innerWidth - 0.5) * 30; // Rotate -15 to 15 deg
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        // Base rotation is X:60, Z:-45
        gsap.to(scene, {
            rotationX: 60 - y,
            rotationZ: -45 + x,
            duration: 0.5,
            ease: "power1.out"
        });
    });
}

// Chương 5: Impact Charts
ScrollTrigger.create({
    trigger: ".ch5-impact",
    start: "top 60%",
    onEnter: () => {
        const fills = document.querySelectorAll('.bar-fill');
        fills.forEach((fill, i) => {
            const targetHeight = fill.getAttribute('data-height');
            const mobileChart = window.matchMedia('(max-width: 900px)').matches;
            gsap.to(fill, {
                height: mobileChart ? '100%' : targetHeight,
                width: mobileChart ? targetHeight : '100%',
                duration: 1.5,
                delay: i * 0.2,
                ease: "power4.out",
                onComplete: () => fill.classList.add('glow')
            });
        });
    }
});

// Industrial Trust kinetic cues
if (!prefersReducedMotion) {
    gsap.to('.payday-orbit', {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: 'none'
    });

    gsap.fromTo('.hero-metric', {
        y: 18,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.ch1-landscape',
            start: 'top 55%'
        }
    });

    gsap.utils.toArray('.glass-panel, .rev-card, .risk-card, .time-step').forEach(panel => {
        panel.addEventListener('pointermove', (event) => {
            const rect = panel.getBoundingClientRect();
            panel.style.setProperty('--panel-x', `${event.clientX - rect.left}px`);
            panel.style.setProperty('--panel-y', `${event.clientY - rect.top}px`);
        });
    });
}
