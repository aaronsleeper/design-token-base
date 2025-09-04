// Demo JavaScript for Design Token System
// This file contains interactive features for the demo page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo features
    initializeColorSwatches();
    initializeInteractiveElements();
    initializeThemeToggle();
});

// Color swatch interactions
function initializeColorSwatches() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = getComputedStyle(this).backgroundColor;
            copyToClipboard(color);
            showNotification(`Copied ${color} to clipboard!`);
        });
        
        // Add hover effect
        swatch.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        swatch.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Add click handlers to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification(`Clicked ${this.textContent}`);
        });
    });
    
    // Add focus handlers to form elements
    const formElements = document.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Dark Mode';
    themeToggle.className = 'btn btn-secondary theme-toggle';
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    
    document.body.appendChild(themeToggle);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = 'Toggle Light Mode';
    }
}

// Utility functions
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--color-primary-500);
        color: var(--color-white);
        padding: var(--spacing-3) var(--spacing-6);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        font-size: var(--font-size-3);
        font-weight: var(--font-weight-medium);
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add dark theme styles
const darkThemeStyles = `
    .dark-theme {
        --color-background-primary: var(--color-gray-900);
        --color-background-secondary: var(--color-gray-800);
        --color-background-tertiary: var(--color-gray-700);
        --color-text-primary: var(--color-white);
        --color-text-secondary: var(--color-gray-300);
        --color-text-tertiary: var(--color-gray-400);
        --color-border-primary: var(--color-gray-700);
        --color-border-secondary: var(--color-gray-600);
    }
    
    .dark-theme .demo-section {
        background-color: var(--color-background-secondary);
    }
    
    .dark-theme .card {
        background-color: var(--color-gray-800);
    }
    
    .dark-theme .form-group {
        background-color: var(--color-gray-800);
    }
`;

// Add dark theme styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = darkThemeStyles;
document.head.appendChild(styleSheet);
