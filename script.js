document.addEventListener('DOMContentLoaded', () => {
    console.log("SIGNAL ARCHIVE v0.83 : CONNECTION ESTABLISHED");
    
    // Add a simple interaction: clicking the glitch title triggers a temporary flicker
    const title = document.querySelector('.glitch-title');
    if (title) {
        title.addEventListener('mousedown', () => {
            title.style.textShadow = "2px 0 var(--accent-red), -2px 0 var(--accent-blue)";
        });
        title.addEventListener('mouseup', () => {
            title.style.textShadow = "none";
        });
    }

    // Monitor scroll position to update nav status (optional)
    const container = document.querySelector('.museum-container');
    container.addEventListener('scroll', () => {
        const slideIndex = Math.round(container.scrollTop / window.innerHeight) + 1;
        document.querySelector('.nav-status').innerText = `NODE: 0${slideIndex} // STATUS: ACTIVE`;
    });
});
