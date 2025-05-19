// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Function to toggle between light and dark themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update HTML attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save preference to user account if logged in
        saveThemePreference(newTheme);
        
        // Save preference to localStorage for non-logged in users
        localStorage.setItem('theme-preference', newTheme);
    }
    
    // Function to save theme preference to user account
    function saveThemePreference(theme) {
        // Only send request if user is logged in (check if auth section has logout button)
        const logoutButton = document.querySelector('.auth-button.logout');
        
        if (logoutButton) {
            fetch('/api/user/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ theme: theme })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Error saving theme preference:', data.error);
                }
            })
            .catch(error => {
                console.error('Error saving theme preference:', error);
            });
        }
    }
    
    // On page load, check localStorage for theme preference (for non-logged in users)
    function initTheme() {
        // Skip if theme is already set in HTML (for logged in users)
        if (document.documentElement.hasAttribute('data-theme')) {
            return;
        }
        
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Use system preference as fallback
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
    
    // Initialize theme
    initTheme();
});