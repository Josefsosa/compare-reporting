// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    
    // DOM Elements
    const imageTab = document.getElementById('image-tab');
    const pdfTab = document.getElementById('pdf-tab');
    const switchButton = document.getElementById('switch-button');
    const inputTypeButtons = document.querySelectorAll('.input-type-button');
    const fileInputs = document.querySelectorAll('.file-input');
    const urlInputs = document.querySelectorAll('input[type="url"]');
    const loadUrlButtons = document.querySelectorAll('.load-url-button');
    const compareButton = document.getElementById('compare-button');
    const resultsSection = document.getElementById('results-section');
    const newComparisonButton = document.getElementById('new-comparison');
    const exportPdfButton = document.getElementById('export-pdf');
    const shareResultsButton = document.getElementById('share-results');
    const howItWorksLink = document.getElementById('how-it-works');
    const howItWorksModal = document.getElementById('how-it-works-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // State
    let currentMode = 'image'; // 'image' or 'pdf'
    let documentsLoaded = {
        left: false,
        right: false
    };
    
    // Initialize handlers
    const imageHandler = new ImageHandler();
    const pdfHandler = new PDFHandler();
    const comparisonMetrics = new ComparisonMetrics();
    
    // Tab switching
    imageTab.addEventListener('click', () => {
        if (currentMode !== 'image') {
            setMode('image');
        }
    });
    
    pdfTab.addEventListener('click', () => {
        if (currentMode !== 'pdf') {
            setMode('pdf');
        }
    });
    
    // Input type switching (file or URL)
    inputTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            const side = button.getAttribute('data-side');
            
            // Update active button
            document.querySelectorAll(`.input-type-button[data-side="${side}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Show corresponding input
            document.getElementById(`${side}-file-input`).classList.toggle('hidden', type !== 'file');
            document.getElementById(`${side}-url-input`).classList.toggle('hidden', type !== 'url');
        });
    });
    
    // File input handling
    fileInputs.forEach(input => {
        const side = input.id.includes('left') ? 'left' : 'right';
        
        // Drag and drop functionality
        const dropArea = input.closest('.file-drop-area');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('highlight');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('highlight');
            });
        });
        
        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            
            if (file) {
                handleFileSelect(file, side);
            }
        });
        
        // Regular file input change
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileSelect(file, side);
            }
        });
    });
    
    // URL input handling
    loadUrlButtons.forEach(button => {
        button.addEventListener('click', () => {
            const side = button.id.includes('left') ? 'left' : 'right';
            const url = document.getElementById(`url-${side}`).value.trim();
            
            if (url) {
                loadFromUrl(url, side);
            }
        });
    });
    
    // Enter key for URL inputs
    urlInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const side = input.id.includes('left') ? 'left' : 'right';
                const url = input.value.trim();
                
                if (url) {
                    loadFromUrl(url, side);
                }
            }
        });
    });
    
    // Switch sides button
    switchButton.addEventListener('click', () => {
        // Switch loaded content
        const leftPreview = document.getElementById('preview-left');
        const rightPreview = document.getElementById('preview-right');
        const leftPreviewContent = leftPreview.innerHTML;
        const rightPreviewContent = rightPreview.innerHTML;
        
        leftPreview.innerHTML = rightPreviewContent;
        rightPreview.innerHTML = leftPreviewContent;
        
        // Switch loaded state
        const leftLoaded = documentsLoaded.left;
        documentsLoaded.left = documentsLoaded.right;
        documentsLoaded.right = leftLoaded;
        
        // Update file info displays
        const leftFileInfo = document.getElementById('file-info-left');
        const rightFileInfo = document.getElementById('file-info-right');
        const leftFileInfoText = leftFileInfo.textContent;
        
        leftFileInfo.textContent = rightFileInfo.textContent;
        rightFileInfo.textContent = leftFileInfoText;
        
        // Update compare button state
        updateCompareButtonState();
    });
    
    // Compare button
    compareButton.addEventListener('click', () => {
        performComparison();
    });
    
    // New comparison button
    newComparisonButton.addEventListener('click', () => {
        resetComparison();
    });
    
    // Export PDF button
    exportPdfButton.addEventListener('click', () => {
        alert('Export to PDF functionality would be implemented here');
        // In a real implementation, this would generate a PDF of the comparison results
    });
    
    // Share results button
    shareResultsButton.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Technology Comparison Results',
                text: 'Check out my technology comparison results',
                url: window.location.href
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            alert('Share functionality is not supported in your browser');
            // Could implement clipboard copy as fallback
        }
    });
    
    // Modal handlers
    howItWorksLink.addEventListener('click', (e) => {
        e.preventDefault();
        howItWorksModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        howItWorksModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === howItWorksModal) {
            howItWorksModal.style.display = 'none';
        }
    });
    
    // Helper functions
    function setMode(mode) {
        currentMode = mode;
        
        // Update UI
        if (mode === 'image') {
            imageTab.classList.add('active');
            pdfTab.classList.remove('active');
        } else {
            imageTab.classList.remove('active');
            pdfTab.classList.add('active');
        }
        
        // Reset the comparison
        resetComparison();
    }
    
    function handleFileSelect(file, side) {
        // Update file info display
        const fileInfo = document.getElementById(`file-info-${side}`);
        fileInfo.textContent = file.name;
        
        // Process file based on type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const previewElement = document.getElementById(`preview-${side}`);
        
        // Clear preview
        previewElement.innerHTML = '';
        
        if (['pdf'].includes(fileExtension) && currentMode === 'pdf') {
            // Handle PDF
            pdfHandler.loadPDF(file, previewElement)
                .then(() => {
                    documentsLoaded[side] = true;
                    updateCompareButtonState();
                })
                .catch(error => {
                    console.error('Error loading PDF:', error);
                    previewElement.innerHTML = `
                        <div class="empty-state error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading PDF: ${error.message || 'Unknown error'}</p>
                        </div>
                    `;
                    documentsLoaded[side] = false;
                    updateCompareButtonState();
                });
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) && currentMode === 'image') {
            // Handle Image
            imageHandler.loadImage(file, previewElement)
                .then(() => {
                    documentsLoaded[side] = true;
                    updateCompareButtonState();
                })
                .catch(error => {
                    console.error('Error loading image:', error);
                    previewElement.innerHTML = `
                        <div class="empty-state error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading image: ${error.message || 'Unknown error'}</p>
                        </div>
                    `;
                    documentsLoaded[side] = false;
                    updateCompareButtonState();
                });
        } else {
            // Unsupported file type
            previewElement.innerHTML = `
                <div class="empty-state error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unsupported file type. Please upload ${currentMode === 'pdf' ? 'a PDF' : 'an image'} file.</p>
                </div>
            `;
            documentsLoaded[side] = false;
            updateCompareButtonState();
        }
    }
    
    function loadFromUrl(url, side) {
        const previewElement = document.getElementById(`preview-${side}`);
        
        // Show loading state
        previewElement.innerHTML = `
            <div class="empty-state loading">
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
        
        // Check URL file type
        const fileExtension = url.split('.').pop().toLowerCase().split('?')[0];
        
        if (currentMode === 'pdf' && fileExtension === 'pdf') {
            // Handle PDF URL
            pdfHandler.loadPDFFromUrl(url, previewElement)
                .then(() => {
                    documentsLoaded[side] = true;
                    updateCompareButtonState();
                    document.getElementById(`file-info-${side}`).textContent = 'PDF loaded from URL';
                })
                .catch(error => {
                    console.error('Error loading PDF from URL:', error);
                    previewElement.innerHTML = `
                        <div class="empty-state error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading PDF from URL: ${error.message || 'Unknown error'}</p>
                        </div>
                    `;
                    documentsLoaded[side] = false;
                    updateCompareButtonState();
                });
        } else if (currentMode === 'image' && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            // Handle Image URL
            imageHandler.loadImageFromUrl(url, previewElement)
                .then(() => {
                    documentsLoaded[side] = true;
                    updateCompareButtonState();
                    document.getElementById(`file-info-${side}`).textContent = 'Image loaded from URL';
                })
                .catch(error => {
                    console.error('Error loading image from URL:', error);
                    previewElement.innerHTML = `
                        <div class="empty-state error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading image from URL: ${error.message || 'Unknown error'}</p>
                        </div>
                    `;
                    documentsLoaded[side] = false;
                    updateCompareButtonState();
                });
        } else {
            // Unsupported or unknown file type
            previewElement.innerHTML = `
                <div class="empty-state error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unsupported or unknown file type from URL. Please provide a URL to ${currentMode === 'pdf' ? 'a PDF' : 'an image'} file.</p>
                </div>
            `;
            documentsLoaded[side] = false;
            updateCompareButtonState();
        }
    }
    
    function updateCompareButtonState() {
        compareButton.disabled = !(documentsLoaded.left && documentsLoaded.right);
    }
    
    function performComparison() {
        // Show loading state
        compareButton.disabled = true;
        compareButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        // Simulate analysis delay
        setTimeout(() => {
            // Get comparison results
            const results = comparisonMetrics.generateComparison();
            
            // Update comparison results UI
            updateResultsDisplay(results);
            
            // Show results section
            resultsSection.classList.remove('hidden');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Reset compare button
            compareButton.disabled = false;
            compareButton.innerHTML = '<i class="fas fa-balance-scale"></i> Compare';
        }, 2000);
    }
    
    function updateResultsDisplay(results) {
        // Update overall scores
        document.getElementById('score-value-left').textContent = results.overallScores.averageA;
        document.getElementById('score-value-right').textContent = results.overallScores.averageB;
        
        // Update score labels
        const leftRating = getRatingLabel(results.overallScores.averageA);
        const rightRating = getRatingLabel(results.overallScores.averageB);
        document.getElementById('score-label-left').textContent = leftRating;
        document.getElementById('score-label-right').textContent = rightRating;
        
        // Color the score circles based on score
        const leftScoreCircle = document.getElementById('score-circle-left');
        const rightScoreCircle = document.getElementById('score-circle-right');
        leftScoreCircle.style.borderColor = getScoreColor(results.overallScores.averageA);
        rightScoreCircle.style.borderColor = getScoreColor(results.overallScores.averageB);
        
        // Generate comparison chart
        generateComparisonChart(results.categoryScores);
        
        // Populate detailed criteria
        populateDetailedCriteria(results.categories);
        
        // Populate recommendations
        populateRecommendations(results.businessRecommendations, 'business-recommendations');
        populateRecommendations(results.scientificRecommendations.concat(results.humanitarianRecommendations), 'technical-recommendations');
        
        // Set conclusions
        document.getElementById('conclusion-text-left').textContent = results.conclusionA;
        document.getElementById('conclusion-text-right').textContent = results.conclusionB;
    }
    
    function getRatingLabel(score) {
        if (score >= 90) return "Exceptional";
        if (score >= 80) return "Excellent";
        if (score >= 70) return "Very Good";
        if (score >= 60) return "Good";
        if (score >= 50) return "Average";
        return "Below Average";
    }
    
    function getScoreColor(score) {
        if (score >= 90) return "#22c55e"; // success-color
        if (score >= 80) return "#84cc16"; // green
        if (score >= 70) return "#3b82f6"; // primary-color
        if (score >= 60) return "#6366f1"; // indigo
        if (score >= 50) return "#f59e0b"; // accent-color
        return "#ef4444"; // danger-color
    }
    
    function generateComparisonChart(categoryScores) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        
        // Destroy any existing chart
        if (window.comparisonChart) {
            window.comparisonChart.destroy();
        }
        
        // Create new chart
        window.comparisonChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categoryScores.map(cat => cat.name),
                datasets: [
                    {
                        label: 'Document A',
                        data: categoryScores.map(cat => cat.averageA),
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                    },
                    {
                        label: 'Document B',
                        data: categoryScores.map(cat => cat.averageB),
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(245, 158, 11, 1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
    
    function populateDetailedCriteria(categories) {
        const container = document.getElementById('criteria-categories');
        container.innerHTML = '';
        
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'criteria-category';
            
            categoryElement.innerHTML = `
                <h4>${category.name}</h4>
                <div class="criteria-items">
                    ${category.criteria.map(criterion => `
                        <div class="criteria-item">
                            <div class="criteria-name">${criterion.name}</div>
                            <div class="criteria-scores">
                                <div class="criteria-score">
                                    <div class="score-indicator">
                                        <div class="score-fill" style="width: ${criterion.scoreA}%; background-color: ${getScoreColor(criterion.scoreA)};"></div>
                                    </div>
                                    <span>${criterion.scoreA}</span>
                                </div>
                                <div class="criteria-score">
                                    <div class="score-indicator">
                                        <div class="score-fill" style="width: ${criterion.scoreB}%; background-color: ${getScoreColor(criterion.scoreB)};"></div>
                                    </div>
                                    <span>${criterion.scoreB}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categoryElement);
        });
    }
    
    function populateRecommendations(recommendations, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            container.appendChild(li);
        });
    }
    
    function resetComparison() {
        // Reset document previews
        document.getElementById('preview-left').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-image"></i>
                <p>No document loaded</p>
            </div>
        `;
        document.getElementById('preview-right').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-image"></i>
                <p>No document loaded</p>
            </div>
        `;
        
        // Reset file info
        document.getElementById('file-info-left').textContent = '';
        document.getElementById('file-info-right').textContent = '';
        
        // Reset loaded state
        documentsLoaded.left = false;
        documentsLoaded.right = false;
        
        // Disable compare button
        updateCompareButtonState();
        
        // Hide results section
        resultsSection.classList.add('hidden');
        
        // Reset file inputs
        document.getElementById('file-left').value = '';
        document.getElementById('file-right').value = '';
        document.getElementById('url-left').value = '';
        document.getElementById('url-right').value = '';
        
        // Reset to file input type for both sides
        document.querySelectorAll('.input-type-button[data-type="file"]').forEach(button => {
            button.click();
        });
    }
});
