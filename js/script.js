// Get the necessary DOM elements
const body = document.body;
const icon = document.getElementById('icon');
const icon2 = document.getElementById('icon2');

// Function to trigger haptic feedback
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
    else if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 60 milliseconds (iOS)
    }
}

// Function to toggle the dark theme
function toggleDarkMode() {
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        icon2.src = 'img/dti/sun.png';
        localStorage.setItem('theme', 'dark');
    } else {
        icon2.src = 'img/dti/moon.png';
        localStorage.setItem('theme', 'light');
    }
}

// Check the user's system preference
function checkSystemPreference() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        body.classList.add('dark-theme');
        icon2.src = 'img/dti/sun.png';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        icon2.src = 'img/dti/moon.png';
        localStorage.setItem('theme', 'light');
    }
}

// Set the initial theme based on localStorage or system preference
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
    body.classList.add('dark-theme');
    icon2.src = 'img/dti/sun.png';
} else if (storedTheme === 'light') {
    body.classList.remove('dark-theme');
    icon2.src = 'img/dti/moon.png';
} else {
    checkSystemPreference();
}

// Add event listeners for toggling the dark mode
icon.addEventListener('click', () => {
    vibrate(); // Trigger haptic feedback
    toggleDarkMode();
});
icon2.addEventListener('click', toggleDarkMode);
