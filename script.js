// SIGNAL_v0.83 : ARCHIVE_READY
document.addEventListener('DOMContentLoaded', () => {
    console.log("ALL_13_NODES_STABLE");
    
    // Purely for logging the scroll depth
    window.addEventListener('scroll', () => {
        const scrolled = Math.round((window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100);
        console.clear();
        console.log(`CURRENT_TRANSMISSION_DEPTH: ${scrolled}%`);
    });
});
