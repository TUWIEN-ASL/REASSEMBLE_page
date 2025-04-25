import "./style.css";
import { WebViewer } from "@rerun-io/web-viewer";

// Function to get URL parameters
function getUrlParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize the viewer with the filename from URL
async function initializeViewer() {
    const fileName = getUrlParameter('file');
    
    if (!fileName) {
        console.error('No file specified in URL');
        return;
    }

    const viewer = new WebViewer();
    
    try {
        await viewer.start(`./${fileName}`, null, {
            width: "100%",
            height: "100%",
        });
    } catch (error) {
        console.error(`Error loading file ${fileName}:`, error);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeViewer);

// For development/testing, you can keep a list of available files
// const availableFiles = [
//     "2025-01-11-14-04-40.rrd",
//     "2025-01-09-15-27-49.rrd",
//     // Add more files as needed
// ];

// export { availableFiles };