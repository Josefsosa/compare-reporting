/**
 * Image Handler class
 * Responsible for loading and displaying images
 */
class ImageHandler {
    /**
     * Loads an image file from a File object
     * @param {File} file - The image file
     * @param {HTMLElement} container - The container to render the image
     * @returns {Promise} - Promise that resolves when the image is loaded
     */
    loadImage(file, container) {
        return new Promise((resolve, reject) => {
            // Clear container
            container.innerHTML = '';
            
            // Create a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'empty-state loading';
            loadingElement.innerHTML = `
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Loading image...</p>
            `;
            container.appendChild(loadingElement);
            
            // Create file reader
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = new Image();
                
                img.onload = () => {
                    // Create image container
                    container.innerHTML = '';
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';
                    container.appendChild(imageContainer);
                    
                    // Add image with responsive sizing
                    img.className = 'responsive-image';
                    imageContainer.appendChild(img);
                    
                    // Store image info
                    container.dataset.imageWidth = img.naturalWidth;
                    container.dataset.imageHeight = img.naturalHeight;
                    
                    // Add image info
                    const imageInfo = document.createElement('div');
                    imageInfo.className = 'image-info';
                    imageInfo.textContent = `${img.naturalWidth} x ${img.naturalHeight} pixels`;
                    imageContainer.appendChild(imageInfo);
                    
                    resolve();
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };
                
                img.src = event.target.result;
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read image file'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * Loads an image from a URL
     * @param {string} url - The URL to the image
     * @param {HTMLElement} container - The container to render the image
     * @returns {Promise} - Promise that resolves when the image is loaded
     */
    loadImageFromUrl(url, container) {
        return new Promise((resolve, reject) => {
            // Clear container
            container.innerHTML = '';
            
            // Create a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'empty-state loading';
            loadingElement.innerHTML = `
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Loading image from URL...</p>
            `;
            container.appendChild(loadingElement);
            
            const img = new Image();
            
            img.onload = () => {
                // Create image container
                container.innerHTML = '';
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                container.appendChild(imageContainer);
                
                // Add image with responsive sizing
                img.className = 'responsive-image';
                imageContainer.appendChild(img);
                
                // Store image info
                container.dataset.imageWidth = img.naturalWidth;
                container.dataset.imageHeight = img.naturalHeight;
                
                // Add image info
                const imageInfo = document.createElement('div');
                imageInfo.className = 'image-info';
                imageInfo.textContent = `${img.naturalWidth} x ${img.naturalHeight} pixels`;
                imageContainer.appendChild(imageInfo);
                
                resolve();
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image from URL'));
            };
            
            // Handle CORS issues by trying to use a proxy for external images
            if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
                // Try loading directly first
                img.crossOrigin = 'anonymous';
                img.src = url;
            } else {
                img.src = url;
            }
        });
    }
}
