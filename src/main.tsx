import './css/bulma.min.css'
import './css/bulma-carousel.min.css'
import './css/bulma-slider.min.css'
import './css/fontawesome.all.min.css'
import './css/index.css'
import './css/gallery.css'

import './js/fontawesome.all.min.js'
import './js/index.js'
import './js/gallery.js'
import './js/bulma-slider.min.js'
import './js/bulma-carousel.min.js'

// import React from 'react'
import ReactDOM from 'react-dom/client'
import ScatterPlotVisualization from './components/ScatterPlotVisualization'

declare global {
    interface Window {
        GifGallery: any;
    }
}

function getBaseUrl(): string {
    return import.meta.env.PROD ? '/REASSEMBLE_page' : '';
}

// Initialize gallery after DOM is loaded
window.addEventListener('load', async () => {
    console.log('Initializing components...');
    const baseUrl = getBaseUrl();

    try {
        const gallery = new window.GifGallery('gifGallery');
        const gifs = [
            {
                filename: '2025-01-11-11-55-48',
                path: `${baseUrl}/2025-01-11-11-55-48.gif`,
                targetUrl: `${baseUrl}/viewer.html?file=2025-01-11-11-55-48.rrd`
            },
            {
                filename: '2025-01-13-16-57-41',
                path: `${baseUrl}/2025-01-13-16-57-41.gif`,
                targetUrl: `${baseUrl}/viewer.html?file=2025-01-13-16-57-41.rrd`
            }
        ];

        console.log('Loading gifs:', gifs);
        gallery.loadGifs(gifs);
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }

    // Mount scatter plot
    const scatterPlotElement = document.getElementById('scatterPlot');
    if (scatterPlotElement) {
        ReactDOM.createRoot(scatterPlotElement).render(
            // <React.StrictMode>
                <ScatterPlotVisualization />
            // </React.StrictMode>
        );
    } else {
        console.error('Scatter plot container not found');
    }
});

export {};