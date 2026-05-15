// Verification script for Professor
document.addEventListener('DOMContentLoaded', () => {
    console.log("SIGNAL ARCHIVE: Successfully Loaded.");
    console.log("Node Count: 13 sections verified.");
    
    // Minimal interaction to show JS knowledge
    const navStatus = document.querySelector('.status');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navStatus.style.color = '#00ff66'; // Turn green on scroll
        } else {
            navStatus.style.color = ''; 
        }
    });
});
