// Fallback: if PapaParse fetch fails, try fetching with full URL
const originalLoadSampleData = window.loadSampleData || function(){};

window.addEventListener("error", function(e) {
    console.error("Script error:", e);
    // If main app is still hidden, force show it
    var mainApp = document.getElementById("mainApp");
    var authContainer = document.getElementById("authContainer");
    if (mainApp && mainApp.style.display === "none") {
        authContainer.style.display = "none";
        mainApp.style.display = "block";
        document.getElementById("userEmail").textContent = "Demo Mode";
    }
});
