// Global variables
let canvas, ctx, isDrawing = false, hasSignature = false;
let signatureData = '';
let clientData = {};

// Make.com webhook configuration
const WEBHOOK_URL = 'https://hook.eu2.make.com/b1xehsayp5nr7qtt7cybsgd19rmcqj2t';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    parseURLParameters();
    initializePage();
    setupEventListeners();
});

// Parse URL parameters and populate client data
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    clientData = {
        name: urlParams.get('client_name') || 'Client Name',
        email: urlParams.get('client_email') || 'client@email.com',
        phone: urlParams.get('client_phone') || 'Phone Number',
        address: urlParams.get('client_address') || 'Client Address',
        postcode: urlParams.get('client_postcode') || 'Postcode'
    };

    console.log('Client data:', clientData);

    // Update display elements
    updateElementText('display-client-name', clientData.name);
    updateElementText('display-client-email', clientData.email);
    updateElementText('display-client-phone', clientData.phone);
    updateElementText('display-client-address', clientData.address);
    updateElementText('display-client-postcode', clientData.postcode);

    // Pre-fill the signature form name field
    setTimeout(() => {
        const nameField = document.getElementById('client-name');
        if (nameField) {
            nameField.value = clientData.name;
            console.log('Pre-filled name field with:', clientData.name);
        }
    }, 100);
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Initialize page
function initializePage() {
    console.log('Initializing page...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('agreement-date');
    if (dateField) {
        dateField.value = today;
        console.log('Date set to:', today);
    }
    
    // Add event listeners for form validation
    const nameField = document.getElementById('client-name');
    if (nameField) {
        nameField.addEventListener('input', checkFormCompletion);
    }
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // View Agreement button
    setupButton('view-agreement-btn', () => {
        console.log('View Agreement clicked');
        showSection('agreement-section');
    });
    
    // Back to About button
    setupButton('back-to-about-btn', () => {
        console.log('Back to About clicked');
        showSection('about-section');
    });
    
    // Review button
    setupButton('review-btn', () => {
        console.log('Review clicked');
        showReview();
    });
    
    // Back to Agreement button
    setupButton('back-to-agreement-btn', () => {
        console.log('Back to Agreement clicked');
        showSection('agreement-section');
    });
    
    // Accept Agreement button
    setupButton('accept-btn', () => {
        console.log('Accept Agreement clicked');
        acceptAgreement();
    });
    
    // Clear Signature button
    setupButton('clear-signature-btn', () => {
        console.log('Clear Signature clicked');
        clearSignature();
    });
    
    // Download button
    setupButton('download-btn', () => {
        console.log('Download clicked');
        downloadAgreement();
    });
}

function setupButton(id, callback) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            callback();
        });
    }
}

// Check if form is complete and enable/disable review button
function checkFormCompletion() {
    const nameField = document.getElementById('client-name');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!nameField || !reviewBtn) return;
    
    const name = nameField.value.trim();
    
    console.log('Form validation - Name:', name, 'Has signature:', hasSignature);
    
    // Check if we have a name and a signature
    if (name && hasSignature) {
        reviewBtn.disabled = false;
        reviewBtn.classList.add('glow');
        console.log('Review button enabled');
    } else {
        reviewBtn.disabled = true;
        reviewBtn.classList.remove('glow');
        console.log('Review button disabled');
    }
}

// Show specific section and hide others
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section found and activated:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Initialize signature pad if showing agreement section
    if (sectionId === 'agreement-section') {
        setTimeout(() => {
            console.log('Initializing signature pad after delay...');
            initializeSignaturePad();
        }, 200);
    }
}

// Show review section with populated data
function showReview() {
    console.log('Showing review...');
    
    // Get form values
    const name = document.getElementById('client-name')?.value || '';
    const date = document.getElementById('agreement-date')?.value || '';
    
    console.log('Review data - Name:', name, 'Date:', date);
    
    // Update review display
    const reviewNameEl = document.getElementById('review-name');
    const reviewDateEl = document.getElementById('review-date');
    
    if (reviewNameEl) {
        reviewNameEl.textContent = name || 'Not provided';
    }
    if (reviewDateEl) {
        reviewDateEl.textContent = date ? new Date(date).toLocaleDateString('en-GB') : 'Not provided';
    }
    
    // Display signature preview
    const signaturePreview = document.getElementById('signature-preview');
    if (signaturePreview) {
        if (signatureData) {
            signaturePreview.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 80px; border: 1px solid #ddd; border-radius: 5px;" alt="Digital Signature">`;
        } else {
            signaturePreview.innerHTML = '<em>No signature provided</em>';
        }
    }
    
    showSection('review-section');
}

// Initialize signature pad functionality
function initializeSignaturePad() {
    console.log('Initializing signature pad...');
    canvas = document.getElementById('signature-pad');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Set drawing styles
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    signatureData = '';
    checkFormCompletion();
    console.log('Signature cleared');
}

// Accept agreement and send to webhook
async function acceptAgreement() {
    const acceptBtn = document.getElementById('accept-btn');
    if (!acceptBtn) {
        console.error('Accept button not found');
        return;
    }
    
    console.log('Starting agreement acceptance process...');
    
    // Update button state
    const originalText = acceptBtn.textContent;
    acceptBtn.textContent = 'Processing...';
    acceptBtn.disabled = true;
    acceptBtn.style.opacity = '0.7';

    try {
        // Gather form data
        const formData = {
            // Form inputs
            signatureClientName: document.getElementById('client-name')?.value || '',
            signedDate: document.getElementById('agreement-date')?.value || new Date().toISOString().split('T')[0],
            signature: signatureData,
            
            // Client info from URL parameters
            clientName: clientData.name,
            clientEmail: clientData.email,
            clientPhone: clientData.phone,
            clientAddress: clientData.address,
            clientPostcode: clientData.postcode,
            
            // Agreement details
            submissionTimestamp: new Date().toISOString(),
            agreementType: 'Professional Services Agreement',
            paymentTerms: '14 days from completion',
            warranty: '12 months on workmanship',
            
            // Company details
            companyName: 'Trader Brothers Ltd',
            serviceType: 'Professional Joinery Services & Bespoke Craftsmanship'
        };

        console.log('Form data prepared:', formData);

        // Validate required data
        if (!formData.signatureClientName.trim()) {
            throw new Error('Client name is required');
        }
        
        if (!signatureData) {
            throw new Error('Digital signature is required');
        }

        // Generate PDF with fallback handling
        console.log('Generating PDF...');
        let pdf = null;
        let pdfBase64 = null;
        
        try {
            // Call the PDF generation function from pdf-application.js
            pdf = await generateProfessionalPDF(formData);
            
            if (pdf && typeof pdf.output === 'function') {
                const pdfBlob = pdf.output('blob');
                pdfBase64 = await blobToBase64(pdfBlob);
                console.log('PDF generated successfully, size:', pdfBase64.length);
            } else {
                console.warn('PDF generation returned invalid result');
            }
        } catch (pdfError) {
            console.error('PDF generation failed:', pdfError);
        }
        
        // Prepare webhook data (send even if PDF generation failed)
        const webhookData = {
            ...formData,
            pdfDocument: pdfBase64,
            pdfFileName: pdfBase64 ? `TraderBrothers_Agreement_${formData.signatureClientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf` : null,
            pdfGenerationStatus: pdfBase64 ? 'success' : 'failed'
        };

        console.log('Sending to webhook:', WEBHOOK_URL);

        // Send to make.com webhook with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Webhook response status:', webhookResponse.status);

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text().catch(() => 'Unknown error');
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
        }
        
        const responseData = await webhookResponse.json().catch(() => ({}));
        console.log('Webhook response:', responseData);
        
        // Store PDF and data globally for download
        window.agreementPDF = pdf;
        window.agreementData = formData;
        
        console.log('Agreement successfully submitted to webhook');
        
        // Show success popup first
        showSuccessPopup();
        
        // Then show thank you page after a brief delay
        setTimeout(() => {
            showSection('thankyou-section');
        }, 2000);

    } catch (error) {
        console.error('Error submitting agreement:', error);
        
        let errorMessage = 'There was an error submitting your agreement. Please try again or contact us directly.';
        
        if (error.message.includes('Client name is required')) {
            errorMessage = 'Please enter your full name before accepting the agreement.';
        } else if (error.message.includes('Digital signature is required')) {
            errorMessage = 'Please provide your digital signature before accepting the agreement.';
        } else if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your internet connection and try again.';
        }
        
        alert(errorMessage + '\n\nError details: ' + error.message);
        
        // Reset button state
        acceptBtn.textContent = originalText;
        acceptBtn.disabled = false;
        acceptBtn.style.opacity = '1';
    }
}

// Show success popup
function showSuccessPopup() {
    console.log('Showing success popup...');
    
    // Remove any existing popup
    const existingPopup = document.querySelector('.success-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-in;
    `;
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        margin: 20px;
        animation: slideIn 0.3s ease-out;
        position: relative;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 20px; animation: checkmark 0.6s ease-in-out;">✓</div>
        <h2 style="margin: 0 0 15px 0; font-size: 24px;">Agreement Submitted Successfully!</h2>
        <p style="margin: 0 0 20px 0; font-size: 16px;">Your professional services agreement has been processed and sent to our team.</p>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Redirecting to confirmation page...</p>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-50px) scale(0.9); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove popup after delay
    setTimeout(() => {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 1800);
}

// Helper function to convert blob to base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Download agreement PDF - Enhanced version
async function downloadAgreement() {
    console.log('Starting PDF download...');
    
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generating PDF...';
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.7';
        
        // Reset button after completion
        const resetButton = () => {
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
                downloadBtn.style.opacity = '1';
            }, 2000);
        };
        
        try {
            let pdf = null;
            
            // Try to use stored PDF first
            if (window.agreementPDF && window.agreementData) {
                console.log('Using stored PDF for download');
                pdf = window.agreementPDF;
            } else {
                console.log('No stored PDF found, generating new one for download...');
                
                // Create form data from available information
                const formData = {
                    signatureClientName: clientData.name || 'Client Name',
                    signedDate: new Date().toISOString().split('T')[0],
                    signature: signatureData || '',
                    clientName: clientData.name,
                    clientEmail: clientData.email,
                    clientPhone: clientData.phone,
                    clientAddress: clientData.address,
                    clientPostcode: clientData.postcode,
                    submissionTimestamp: new Date().toISOString(),
                    agreementType: 'Professional Services Agreement',
                    paymentTerms: '14 days from completion',
                    warranty: '12 months on workmanship',
                    companyName: 'Trader Brothers Ltd',
                    serviceType: 'Professional Joinery Services & Bespoke Craftsmanship'
                };
                
                // Generate PDF
                pdf = await generateProfessionalPDF(formData);
            }
            
            if (pdf && typeof pdf.save === 'function') {
                const clientName = (window.agreementData?.signatureClientName || clientData.name || 'Client').replace(/\s+/g, '_');
                const dateStr = new Date().toISOString().split('T')[0];
                const filename = `TraderBrothers_Agreement_${clientName}_${dateStr}.pdf`;
                
                downloadBtn.textContent = 'Downloading...';
                
                // Save the PDF
                pdf.save(filename);
                console.log('PDF downloaded successfully:', filename);
                
                // Show success message
                showDownloadSuccess();
                resetButton();
                
            } else {
                throw new Error('PDF generation failed - invalid PDF object');
            }
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Unable to generate PDF for download at this time. Please contact us for a copy of your agreement.\n\nError: ' + error.message + '\n\nEmail: [Business Email]\nPhone: [Business Phone]');
            resetButton();
        }
    }
}

// Show download success message
function showDownloadSuccess() {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
        font-family: inherit;
        font-size: 14px;
        font-weight: bold;
    `;
    successMsg.textContent = '📄 PDF downloaded successfully!';
    document.body.appendChild(successMsg);
    
    // Add animation styles if not already present
    if (!document.querySelector('#download-success-styles')) {
        const style = document.createElement('style');
        style.id = 'download-success-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        successMsg.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 300);
    }, 3000);
}ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Remove existing event listeners by cloning
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');
    
    // Reapply styles after cloning
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    
    console.log('Signature pad initialized successfully');
}

// Get event position relative to canvas
function getEventPos(e) {
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

// Start drawing on canvas
function startDrawing(e) {
    if (!ctx) return;
    e.preventDefault();
    isDrawing = true;
    hasSignature = true;
    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    checkFormCompletion();
    console.log('Started drawing, signature detected');
}

// Draw on canvas
function draw(e) {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const pos = getEventPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

// Stop drawing
function stopDrawing(e) {
    if (isDrawing && ctx && canvas) {
        if (e) e.preventDefault();
        isDrawing = false;
        ctx.beginPath();
        signatureData = canvas.toDataURL();
        console.log('Stopped drawing, signature saved');
    }
}

// Handle touch events
function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        startDrawing(e);
    } else if (e.type === 'touchmove') {
        draw(e);
    }
}

// Clear signature pad
function clearSignature() {
    console.log('Clearing signature...');
    if (!canvas || !ctx) {
        console.log('Canvas or context not available');
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#
