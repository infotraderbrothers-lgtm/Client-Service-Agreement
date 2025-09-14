// Complete Script.js - Service Agreement System
// Global variables
let canvas, ctx, isDrawing = false, hasSignature = false;
let signatureData = '';
let clientData = {};

// Make.com webhook configuration
const WEBHOOK_URL = 'https://hook.eu2.make.com/b1xehsayp5nr7qtt7cybsgd19rmcqj2t';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Service Agreement System loaded, initializing...');
    
    parseURLParameters();
    initializePage();
    setupEventListeners();
    
    // Initialize PDF system
    setTimeout(() => {
        initializePDFSystem();
    }, 1000);
});

// Initialize PDF system
async function initializePDFSystem() {
    if (window.PDFGenerator && typeof window.PDFGenerator.checkLibrary === 'function') {
        const pdfReady = await window.PDFGenerator.checkLibrary();
        if (pdfReady) {
            console.log('PDF generation system ready');
        } else {
            console.warn('PDF system not ready - some features may be limited');
        }
    } else {
        console.warn('PDF module not loaded');
    }
}

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

    console.log('Client data loaded:', clientData);

    // Update display elements
    updateElementText('display-client-name', clientData.name);
    updateElementText('display-client-email', clientData.email);
    updateElementText('display-client-phone', clientData.phone);
    updateElementText('display-client-address', clientData.address);
    updateElementText('display-client-postcode', clientData.postcode);

    // Auto-populate the signature name field with client data
    const nameField = document.getElementById('client-name');
    if (nameField && clientData.name && clientData.name !== 'Client Name') {
        nameField.value = clientData.name;
        // Make field readonly to prevent editing for CRM matching accuracy
        nameField.readOnly = true;
        nameField.style.backgroundColor = '#f8f9fa';
        nameField.style.cursor = 'not-allowed';
        console.log('Client name auto-populated and locked:', clientData.name);
    }
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Initialize page
function initializePage() {
    console.log('Initializing page components...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('agreement-date');
    if (dateField) {
        dateField.value = today;
        console.log('Agreement date set to:', today);
    }
    
    // Check initial form completion state
    setTimeout(() => {
        checkFormCompletion();
    }, 500);
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
    
    // Download PDF button (optional)
    setupButton('download-pdf-btn', () => {
        console.log('Download PDF clicked');
        downloadPDF();
    });
}

function setupButton(id, callback) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            callback();
        });
        console.log(`Event listener added for: ${id}`);
    } else {
        console.log(`Button not found: ${id}`);
    }
}

// Check if form is complete and enable/disable review button
function checkFormCompletion() {
    const nameField = document.getElementById('client-name');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!reviewBtn) return;
    
    // Get name value - either from auto-populated field or URL parameter
    const nameFromField = nameField ? nameField.value.trim() : '';
    const nameFromData = clientData.name && clientData.name !== 'Client Name' ? clientData.name : '';
    const hasValidName = nameFromField || nameFromData;
    
    console.log('Form validation - Name from field:', nameFromField, 'Name from data:', nameFromData, 'Has signature:', hasSignature);
    
    // Check if we have a valid name and a signature
    if (hasValidName && hasSignature) {
        reviewBtn.disabled = false;
        reviewBtn.classList.add('glow');
        console.log('Review button enabled');
    } else {
        reviewBtn.disabled = true;
        reviewBtn.classList.remove('glow');
        console.log('Review button disabled - missing requirements');
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
        console.log('Section activated:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
        return;
    }
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Initialize signature pad if showing agreement section
    if (sectionId === 'agreement-section') {
        setTimeout(() => {
            console.log('Initializing signature pad...');
            initializeSignaturePad();
        }, 200);
    }
}

// Show review section with populated data
function showReview() {
    console.log('Preparing review section...');
    
    // Get name from field or use client data as fallback
    const nameField = document.getElementById('client-name');
    const name = nameField ? nameField.value.trim() : clientData.name;
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
            signaturePreview.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 80px; border: 1px solid #ddd; border-radius: 5px; background: white;" alt="Digital Signature">`;
        } else {
            signaturePreview.innerHTML = '<em style="color: #666;">No signature provided</em>';
        }
    }
    
    showSection('review-section');
}

// Initialize signature pad functionality
function initializeSignaturePad() {
    console.log('Setting up signature pad...');
    canvas = document.getElementById('signature-pad');
    if (!canvas) {
        console.error('Signature canvas not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    
    // Set drawing styles
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Remove existing event listeners by cloning
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');
    
    // Reapply settings after cloning
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
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
    console.log('Drawing started - signature detected');
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
        signatureData = canvas.toDataURL('image/png');
        console.log('Drawing stopped - signature saved');
    }
}

// Handle touch events for mobile
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
        console.log('Canvas or context not available for clearing');
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    hasSignature = false;
    signatureData = '';
    checkFormCompletion();
    console.log('Signature cleared successfully');
}

// Download PDF function (optional feature)
async function downloadPDF() {
    console.log('Download PDF requested...');
    
    const formData = gatherFormData();
    if (!validateFormData(formData)) {
        return;
    }
    
    try {
        if (window.PDFGenerator && typeof window.PDFGenerator.generateAndDownload === 'function') {
            const success = await window.PDFGenerator.generateAndDownload(formData);
            if (success) {
                console.log('PDF download completed');
            } else {
                throw new Error('PDF generation failed');
            }
        } else {
            throw new Error('PDF generation not available');
        }
    } catch (error) {
        console.error('PDF download error:', error);
        alert('Unable to generate PDF. Please complete the agreement process to receive your copy via email.');
    }
}

// Gather form data helper function
function gatherFormData() {
    // Get name from form field or fallback to client data
    const nameField = document.getElementById('client-name');
    const clientName = nameField ? nameField.value.trim() : clientData.name;
    
    return {
        // Form inputs - use client name for accurate CRM matching
        signatureClientName: clientName || clientData.name,
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
}

// Validate form data
function validateFormData(formData) {
    if (!formData.signatureClientName || formData.signatureClientName.trim() === '' || formData.signatureClientName === 'Client Name') {
        alert('Client name is required for agreement processing. Please ensure client data is properly loaded.');
        return false;
    }
    
    if (!signatureData) {
        alert('Please provide your digital signature before proceeding.');
        return false;
    }
    
    return true;
}

// Send PDF as binary file to webhook using FormData
async function sendPDFAsFileToWebhook(pdfBlob, clientData, formData) {
    try {
        console.log('Preparing to send PDF as binary file to webhook...');
        
        // Create FormData object for multipart file upload
        const formDataPayload = new FormData();
        
        // Generate clean filename
        const clientName = formData.signatureClientName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const dateString = new Date().toISOString().split('T')[0];
        const filename = `TraderBrothers_Agreement_${clientName}_${dateString}.pdf`;
        
        // Add the PDF file as binary blob
        formDataPayload.append('pdf_file', pdfBlob, filename);
        
        // Add client and form data as JSON string
        formDataPayload.append('client_data', JSON.stringify({
            clientName: formData.signatureClientName,
            clientEmail: formData.clientEmail,
            signedDate: formData.signedDate,
            submissionTimestamp: formData.submissionTimestamp,
            agreementType: formData.agreementType,
            clientPhone: formData.clientPhone,
            clientAddress: formData.clientAddress,
            clientPostcode: formData.clientPostcode,
            paymentTerms: formData.paymentTerms,
            warranty: formData.warranty,
            companyName: formData.companyName,
            serviceType: formData.serviceType
        }));
        
        // Add individual fields for easier Make.com processing
        formDataPayload.append('client_name', formData.signatureClientName);
        formDataPayload.append('client_email', formData.clientEmail);
        formDataPayload.append('signed_date', formData.signedDate);
        formDataPayload.append('submission_timestamp', formData.submissionTimestamp);
        formDataPayload.append('pdf_filename', filename);
        formDataPayload.append('file_size', pdfBlob.size.toString());
        
        console.log('Sending PDF as binary file to webhook:', filename);
        console.log('File size:', Math.round(pdfBlob.size / 1024), 'KB');
        
        // Send to webhook with binary file upload
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for file upload
        
        const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: formDataPayload, // Send FormData directly - this sends the PDF as binary
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Binary file upload webhook response status:', webhookResponse.status);
        
        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text().catch(() => 'Unknown error');
            throw new Error(`Binary file upload webhook failed: ${webhookResponse.status} - ${errorText}`);
        }
        
        let responseData = {};
        try {
            responseData = await webhookResponse.json();
            console.log('Binary file upload webhook response:', responseData);
        } catch (e) {
            console.log('Binary file upload webhook completed (no JSON response)');
        }
        
        return true;
        
    } catch (error) {
        console.error('Error sending PDF as binary file to webhook:', error);
        throw error;
    }
}

// Accept agreement and send to webhook for email processing
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
    acceptBtn.style.cursor = 'not-allowed';

    try {
        // Gather and validate form data
        const formData = gatherFormData();
        
        if (!validateFormData(formData)) {
            throw new Error('Form validation failed');
        }

        console.log('Form data prepared for webhook submission');

        // Generate PDF for binary file upload to webhook
        console.log('Generating PDF binary file for webhook upload...');
        let pdfData = null;
        
        try {
            if (window.PDFGenerator && typeof window.PDFGenerator.generateWithViewLink === 'function') {
                pdfData = await window.PDFGenerator.generateWithViewLink(formData);
                if (pdfData && pdfData.blob) {
                    console.log('PDF generated successfully for binary file upload');
                    console.log('PDF filename:', pdfData.filename);
                    console.log('PDF file size:', Math.round(pdfData.blob.size / 1024), 'KB');
                } else {
                    throw new Error('PDF generation returned invalid data');
                }
            } else {
                throw new Error('PDF generation not available');
            }
        } catch (pdfError) {
            console.error('PDF generation failed:', pdfError);
            throw new Error('Failed to generate PDF: ' + pdfError.message);
        }
        
        // Send PDF as binary file to webhook
        console.log('Uploading PDF as binary file to webhook for processing...');
        await sendPDFAsFileToWebhook(pdfData.blob, clientData, formData);
        
        console.log('Agreement and PDF binary file successfully submitted to webhook');
        
        // Show success popup
        showSuccessPopup();
        
        // Redirect to thank you page
        setTimeout(() => {
            showSection('thankyou-section');
        }, 2000);

    } catch (error) {
        console.error('Error in agreement submission:', error);
        
        let errorMessage = 'There was an error submitting your agreement. Please try again or contact us directly.';
        
        if (error.message.includes('validation failed')) {
            // Validation errors already show specific alerts
            return;
        } else if (error.name === 'AbortError') {
            errorMessage = 'Upload timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('PDF generation')) {
            errorMessage = 'Unable to generate your agreement PDF. Please try again or contact support.';
        } else if (error.message.includes('webhook')) {
            errorMessage = 'Unable to process your agreement at this time. Please try again in a moment or contact support.';
        }
        
        alert(errorMessage + '\n\nError details: ' + error.message);
        
    } finally {
        // Reset button state
        acceptBtn.textContent = originalText;
        acceptBtn.disabled = false;
        acceptBtn.style.opacity = '1';
        acceptBtn.style.cursor = 'pointer';
    }
}

// Show success popup with enhanced styling
function showSuccessPopup() {
    console.log('Displaying success popup...');
    
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
        <p style="margin: 0 0 20px 0; font-size: 16px;">Your professional services agreement has been processed and will be emailed to you shortly.</p>
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

// Error handling for uncaught errors
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Log system ready
console.log('Service Agreement System - script.js loaded successfully');
