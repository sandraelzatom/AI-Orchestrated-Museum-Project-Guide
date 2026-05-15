// SIGNAL ARCHIVE UTILITY SCRIPT
document.addEventListener('DOMContentLoaded', () => {
    console.log("SIGNAL_ARCHIVE_STATUS: LOADED");
    console.log("TOTAL_NODES: 13");
    
    // Smooth scroll for internal links if you add them later
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
