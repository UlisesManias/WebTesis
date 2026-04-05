document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Background Shapes (The Constellation)
    const shapesContainer = document.getElementById('bg-shapes');
    const colors = ['#f78fb3', '#cf6a87', '#3dc1d3', '#546de5', '#f8a5c2'];
    
    // Create Deep Blurred Shapes
    for (let i = 0; i < 8; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        const size = 150 + Math.random() * 300;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        shape.style.opacity = 0.05 + Math.random() * 0.1;
        shape.style.animationDuration = `${20 + Math.random() * 30}s`;
        shape.style.animationDelay = `${-Math.random() * 20}s`;
        shapesContainer.appendChild(shape);
    }

    // Create Mid-Background Defined Squares
    for (let i = 0; i < 12; i++) {
        const square = document.createElement('div');
        square.className = 'shape-mid';
        const size = 40 + Math.random() * 80;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;
        square.style.left = `${Math.random() * 100}%`;
        square.style.top = `${Math.random() * 100}%`;
        square.style.borderWidth = '1px';
        square.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        square.style.opacity = 0.1 + Math.random() * 0.2;
        square.style.animationDuration = `${10 + Math.random() * 15}s`;
        square.style.animationDelay = `${-Math.random() * 10}s`;
        
        // Add a parallax factor
        square.dataset.parallaxX = (Math.random() - 0.5) * 40;
        square.dataset.parallaxY = (Math.random() - 0.5) * 40;
        
        shapesContainer.appendChild(square);
    }

    // 2. Parallax Effect for Mid-Background Shapes
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        const midShapes = document.querySelectorAll('.shape-mid');
        midShapes.forEach(shape => {
            const factorX = shape.dataset.parallaxX || 1;
            const factorY = shape.dataset.parallaxY || 1;
            shape.style.transform = `translate(${moveX * factorX}px, ${moveY * factorY}px)`;
        });
    });

    // 3. Fade-in Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    
    // Add initial visibility to hero elements
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *, .hero-preview').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});
