// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const leftNav = document.querySelector('.left-nav');
    
    if (mobileMenuToggle && leftNav) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            leftNav.classList.toggle('open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = leftNav.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && leftNav.classList.contains('open')) {
                leftNav.classList.remove('open');
            }
        });
        
        // Close menu when pressing escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && leftNav.classList.contains('open')) {
                leftNav.classList.remove('open');
            }
        });
    }
});