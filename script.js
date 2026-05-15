// Function to reveal eras as you scroll
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Log to HUD when era is decoded
            console.log(`ERA DECODED: ${entry.target.id}`);
        }
    });
}, observerOptions);

document.querySelectorAll('.era').forEach(era => {
    observer.observe(era);
});

// Simple mouse glow effect to follow "Signal"
document.addEventListener('mousemove', (e) => {
    const stars = document.querySelector('.stars');
    stars.style.backgroundPosition = `${e.clientX / 50}px ${e.clientY / 50}px`;
});
