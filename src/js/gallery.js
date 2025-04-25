// gallery.js
class GifGallery {
    constructor(containerId) {
        const element = document.getElementById(containerId);
        if (!element) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }
        this.container = element;
        this.container.classList.add('gif-gallery');
    }

    loadGifs(gifs) {
        if (!this.container) return;
        this.container.innerHTML = '';
        
        gifs.forEach(gif => {
            const tileElement = this.createTileElement(gif);
            this.container.appendChild(tileElement);
        });
    }

    createTileElement(gif) {
        const tileElement = document.createElement('button');
        tileElement.className = 'gif-tile';
        tileElement.onclick = () => window.location.href = gif.targetUrl;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'gif-container';

        const img = document.createElement('img');
        img.src = gif.path;
        img.alt = gif.filename;
        img.className = 'gif-thumbnail';

        const filename = document.createElement('p');
        filename.textContent = gif.filename;
        filename.className = 'filename';

        imgContainer.appendChild(img);
        tileElement.appendChild(imgContainer);
        tileElement.appendChild(filename);

        return tileElement;
    }
}

// Make the class available globally
window.GifGallery = GifGallery;