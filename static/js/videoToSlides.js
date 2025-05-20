/**
 * Video to Slides JavaScript
 * Handles processing YouTube videos and generating presentation slides
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const videoUrlInput = document.getElementById('video-url');
    const processVideoBtn = document.getElementById('process-video-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const apiKeyInput = document.getElementById('api-key');
    const aiProviderSelect = document.getElementById('ai-provider');
    const downloadPptxBtn = document.getElementById('download-pptx');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadJsonBtn = document.getElementById('download-json');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // State variables
    let currentPresentation = null;
    
    // Initialize
    function init() {
        // Make sure API key field is always empty at startup
        if (apiKeyInput) {
            apiKeyInput.value = '';
        }
        
        // Event listeners
        processVideoBtn.addEventListener('click', processVideo);
        tryAgainBtn.addEventListener('click', resetUI);
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Download buttons
        downloadPptxBtn.addEventListener('click', downloadPptx);
        downloadPdfBtn.addEventListener('click', downloadPdf);
        downloadJsonBtn.addEventListener('click', downloadJson);
    }
    
    // Process video and generate slides
    function processVideo() {
        // Get video URL and API key
        const videoUrl = videoUrlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        
        // Validate inputs
        if (!videoUrl) {
            showError('Please enter a YouTube video URL');
            return;
        }
        
        // API key is now optional with the YouTube transcript approach
        // We intentionally do NOT save the API key to localStorage for security
        // Only use the API key for the current session if provided
        
        // Show loading state
        setLoadingState(true);
        hideError();
        
        // Prepare request data
        const requestData = {
            videoUrl: videoUrl,
            apiKey: apiKey,
            videoTitle: 'YouTube Video Presentation' // Default title
        };
        
        // Log what we're sending for debugging
        console.log("Sending request with data:", JSON.stringify({
            videoUrl: requestData.videoUrl,
            apiKeyProvided: !!requestData.apiKey // Don't log the actual key
        }));
        
        // Send request to server
        fetch('/create-slide-deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            setLoadingState(false);
            
            if (data.success) {
                // Store the presentation data
                if (data.saved) {
                    // User was logged in and presentation was saved to account
                    showSuccessMessage('Presentation created and saved to your account!');
                    // We would need to fetch the presentation data separately
                    fetchPresentationData(data.id);
                } else {
                    // Presentation was processed but not saved (user not logged in)
                    currentPresentation = data.presentation;
                    renderPresentation(data.presentation);
                    showDownloadOptions();
                }
            } else {
                showError(data.error || 'Failed to process video');
            }
        })
        .catch(error => {
            setLoadingState(false);
            showError('Error processing video: ' + error.message);
            console.error('Error:', error);
        });
    }
    
    // Fetch presentation data for saved presentations
    function fetchPresentationData(presentationId) {
        fetch(`/api/slide-deck/${presentationId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentPresentation = JSON.parse(data.slides_json);
                    renderPresentation(currentPresentation);
                    showDownloadOptions();
                } else {
                    showError('Failed to load presentation data');
                }
            })
            .catch(error => {
                showError('Error loading presentation: ' + error.message);
            });
    }
    
    // Render the presentation in the UI
    function renderPresentation(presentation) {
        // Update presentation title
        const titleElement = document.getElementById('presentation-title');
        titleElement.innerHTML = `<h2>${presentation.title}</h2>`;
        
        // Clear previous slides
        const slidesPreview = document.getElementById('slides-preview');
        slidesPreview.innerHTML = '';
        
        // Create slides
        presentation.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide-card';
            
            let content = slide.content.map(item => `<li>${item}</li>`).join('');
            
            slideElement.innerHTML = `
                <div class="slide-number">${index + 1}</div>
                <div class="slide-header">
                    <h3>${slide.title}</h3>
                </div>
                <div class="slide-content">
                    <div class="slide-image">
                        <img src="${slide.image_url || 'https://placehold.co/600x400?text=Slide+Image'}" alt="${slide.title}">
                    </div>
                    <div class="slide-text">
                        <ul>${content}</ul>
                    </div>
                </div>
            `;
            
            slidesPreview.appendChild(slideElement);
        });
        
        // Show the slides section
        document.querySelector('.slides-section').classList.remove('hidden');
        
        // Scroll to the slides
        slidesPreview.scrollIntoView({behavior: 'smooth'});
    }
    
    // Show download options
    function showDownloadOptions() {
        document.querySelector('.download-options').classList.remove('d-none');
    }
    
    // Download functions
    function downloadPptx() {
        if (!currentPresentation) return;
        
        // In a production app, you would call an API endpoint to generate the PPTX
        // For this demo, we'll just show an alert
        alert('PowerPoint download functionality would be implemented here.');
        
        // Example implementation would be:
        // window.location.href = `/api/download/pptx?presentation=${encodeURIComponent(JSON.stringify(currentPresentation))}`;
    }
    
    function downloadPdf() {
        if (!currentPresentation) return;
        
        // In a production app, you would call an API endpoint to generate the PDF
        alert('PDF download functionality would be implemented here.');
    }
    
    function downloadJson() {
        if (!currentPresentation) return;
        
        // Create a JSON blob and download it
        const jsonString = JSON.stringify(currentPresentation, null, 2);
        const blob = new Blob([jsonString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentPresentation.title.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // UI Helper functions
    function setLoadingState(isLoading) {
        if (isLoading) {
            processVideoBtn.disabled = true;
            processVideoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            // Hide any existing results
            document.querySelector('.slides-section').classList.add('hidden');
            document.getElementById('error-section').classList.add('hidden');
        } else {
            processVideoBtn.disabled = false;
            processVideoBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Slides';
        }
    }
    
    function showError(message) {
        const errorSection = document.getElementById('error-section');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        errorSection.classList.remove('hidden');
        errorSection.scrollIntoView({behavior: 'smooth'});
    }
    
    function hideError() {
        document.getElementById('error-section').classList.add('hidden');
    }
    
    function showSuccessMessage(message) {
        // You could implement a toast or other notification here
        console.log('Success:', message);
    }
    
    function resetUI() {
        hideError();
        document.querySelector('.slides-section').classList.add('hidden');
        document.querySelector('.download-options').classList.add('d-none');
        
        // Clear API key immediately for security
        if (apiKeyInput) {
            apiKeyInput.value = '';
        }
    }
    
    function togglePasswordVisibility() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            apiKeyInput.type = 'password';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
    
    // Initialize the app
    init();
});