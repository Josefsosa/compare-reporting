/**
 * PDF Handler class
 * Responsible for loading and rendering PDF files
 */
class PDFHandler {
    constructor() {
        this.currentTask = null;
    }
    
    /**
     * Loads a PDF file from a File object
     * @param {File} file - The PDF file
     * @param {HTMLElement} container - The container to render the PDF
     * @returns {Promise} - Promise that resolves when the PDF is loaded
     */
    loadPDF(file, container) {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing task
            if (this.currentTask) {
                this.currentTask.destroy();
                this.currentTask = null;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Create a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'empty-state loading';
            loadingElement.innerHTML = `
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Loading PDF...</p>
            `;
            container.appendChild(loadingElement);
            
            // Convert file to array buffer
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                
                // Load the PDF
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                this.currentTask = loadingTask;
                
                loadingTask.promise
                    .then(pdf => {
                        // Create a container for PDF pages
                        container.innerHTML = '';
                        const pdfContainer = document.createElement('div');
                        pdfContainer.className = 'pdf-container';
                        container.appendChild(pdfContainer);
                        
                        // Get the first page (for preview)
                        return pdf.getPage(1).then(page => {
                            // Create a canvas for the page
                            const canvas = document.createElement('canvas');
                            pdfContainer.appendChild(canvas);
                            
                            // Set up canvas context
                            const context = canvas.getContext('2d');
                            
                            // Determine scale to fit the container width
                            const containerWidth = pdfContainer.clientWidth;
                            const viewport = page.getViewport({ scale: 1 });
                            const scale = containerWidth / viewport.width;
                            const scaledViewport = page.getViewport({ scale });
                            
                            // Set canvas dimensions to match the viewport
                            canvas.width = scaledViewport.width;
                            canvas.height = scaledViewport.height;
                            
                            // Render the page
                            const renderContext = {
                                canvasContext: context,
                                viewport: scaledViewport
                            };
                            
                            return page.render(renderContext).promise.then(() => {
                                // Add page info
                                const pageInfo = document.createElement('div');
                                pageInfo.className = 'pdf-page-info';
                                pageInfo.textContent = `Page 1 of ${pdf.numPages}`;
                                pdfContainer.appendChild(pageInfo);
                                
                                // Store PDF info in container data attributes
                                container.dataset.pdfPages = pdf.numPages;
                                
                                resolve();
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error loading PDF:', error);
                        reject(error);
                    });
            };
            
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                reject(error);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Loads a PDF file from a URL
     * @param {string} url - The URL to the PDF file
     * @param {HTMLElement} container - The container to render the PDF
     * @returns {Promise} - Promise that resolves when the PDF is loaded
     */
    loadPDFFromUrl(url, container) {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing task
            if (this.currentTask) {
                this.currentTask.destroy();
                this.currentTask = null;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Create a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'empty-state loading';
            loadingElement.innerHTML = `
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Loading PDF from URL...</p>
            `;
            container.appendChild(loadingElement);
            
            // Load the PDF
            const loadingTask = pdfjsLib.getDocument(url);
            this.currentTask = loadingTask;
            
            loadingTask.promise
                .then(pdf => {
                    // Create a container for PDF pages
                    container.innerHTML = '';
                    const pdfContainer = document.createElement('div');
                    pdfContainer.className = 'pdf-container';
                    container.appendChild(pdfContainer);
                    
                    // Get the first page (for preview)
                    return pdf.getPage(1).then(page => {
                        // Create a canvas for the page
                        const canvas = document.createElement('canvas');
                        pdfContainer.appendChild(canvas);
                        
                        // Set up canvas context
                        const context = canvas.getContext('2d');
                        
                        // Determine scale to fit the container width
                        const containerWidth = pdfContainer.clientWidth;
                        const viewport = page.getViewport({ scale: 1 });
                        const scale = containerWidth / viewport.width;
                        const scaledViewport = page.getViewport({ scale });
                        
                        // Set canvas dimensions to match the viewport
                        canvas.width = scaledViewport.width;
                        canvas.height = scaledViewport.height;
                        
                        // Render the page
                        const renderContext = {
                            canvasContext: context,
                            viewport: scaledViewport
                        };
                        
                        return page.render(renderContext).promise.then(() => {
                            // Add page info
                            const pageInfo = document.createElement('div');
                            pageInfo.className = 'pdf-page-info';
                            pageInfo.textContent = `Page 1 of ${pdf.numPages}`;
                            pdfContainer.appendChild(pageInfo);
                            
                            // Store PDF info in container data attributes
                            container.dataset.pdfPages = pdf.numPages;
                            
                            resolve();
                        });
                    });
                })
                .catch(error => {
                    console.error('Error loading PDF from URL:', error);
                    reject(error);
                });
        });
    }
}
