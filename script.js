// Function to toggle the sidebar
function toggleNav(event) {
    const sidenav = document.getElementById("sidenav");
    const isOpen = sidenav.classList.contains("open");
    
    // Toggle the sidebar
    sidenav.classList.toggle("open");
    
    // Prevent click on the hamburger icon from closing the sidebar
    event.stopPropagation();
}

// Close the sidebar if clicked outside
document.addEventListener("click", (event) => {
    const sidenav = document.getElementById("sidenav");
    const hamburger = document.querySelector(".hamburger");
    
    // Close sidebar if the click is outside of it
    if (!sidenav.contains(event.target) && !hamburger.contains(event.target)) {
        sidenav.classList.remove("open");
    }
});

// Toggle the "open" class on the sidebar when the hamburger icon is clicked
document.querySelector('.hamburger').addEventListener('click', () => {
    sidebar.classList.toggle('open'); // Toggle sidebar visibility

    // Check if the sidebar is open and adjust the welcome banner visibility
    if (sidebar.classList.contains('open')) {
        welcomeBanner.style.visibility = 'hidden';
        welcomeBanner.style.opacity = '0';
    } else {
        welcomeBanner.style.visibility = 'visible';
        welcomeBanner.style.opacity = '1';
    }
});



