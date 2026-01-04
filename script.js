// Complete Script.js - Service Agreement System with PDFShift Integration
// Global variables
let canvas, ctx, isDrawing = false, hasSignature = false;
let signatureData = '';
let clientData = {};
let scopeOfWorkData = {};

// API Configuration
const WEBHOOK_URL = 'https://hook.eu2.make.com/b1xehsayp5nr7qtt7cybsgd19rmcqj2t';
const PDFSHIFT_API_KEY = 'sk_b35232e4caa90a88ce18e7cf175498ed34180fd4';
const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Service Agreement System loaded, initializing...');
    
    parseURLParameters();
    initializePage();
    setupEventListeners();
});

// Parse URL parameters and populate client data and scope of work
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Client data
    clientData = {
        name: urlParams.get('client_name') || 'Client Name',
        email: urlParams.get('client_email') || 'client@email.com',
        phone: urlParams.get('client_phone') || 'Phone Number',
        address: urlParams.get('client_address') || 'Client Address',
        postcode: urlParams.get('client_postcode') || 'Postcode'
    };

    // Scope of Work data
    scopeOfWorkData = {
        workToBeDone: urlParams.get('work_to_be_done') || 'Details to be confirmed',
        materials: urlParams.get('materials_supplies') || 'Materials and supplies will be specified',
        cleanup: urlParams.get('cleanup') || 'Site will be left clean and tidy',
        exclusions: urlParams.get('exclusions') || 'Any work not specified above',
        changes: urlParams.get('changes') || 'All changes must be agreed in writing before proceeding'
    };

    console.log('Client data loaded:', clientData);
    console.log('Scope of Work data loaded:', scopeOfWorkData);

    // Update client display elements in agreement section
    updateElementText('display-client-name', clientData.name);
    updateElementText('display-client-email', clientData.email);
    updateElementText('display-client-phone', clientData.phone);
    updateElementText('display-client-address', clientData.address);
    updateElementText('display-client-postcode', clientData.postcode);

    // Update Scope of Work sections in agreement section
    updateScopeOfWorkSections();

    // Auto-populate the signature name field with client data
    const nameField = document.getElementById('client-name');
    if (nameField && clientData.name && clientData.name !== 'Client Name') {
        nameField.value = clientData.name;
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

function updateScopeOfWorkSections() {
    // Update scope of work in agreement section
    updateElementText('scope-work-display', scopeOfWorkData.workToBeDone);
    updateElementText('scope-materials-display', scopeOfWorkData.materials);
    updateElementText('scope-cleanup-display', scopeOfWorkData.cleanup);
    updateElementText('scope-exclusions-display', scopeOfWorkData.exclusions);
    updateElementText('scope-changes-display', scopeOfWorkData.changes);
    
    console.log('Scope of Work sections updated');
}

// Initialize page
function initializePage() {
    console.log('Initializing page components...');
    
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('agreement-date');
    if (dateField) {
        dateField.value = today;
        console.log('Agreement date set to:', today);
    }
    
    setTimeout(() => {
        checkFormCompletion();
    }, 500);
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    setupButton('view-agreement-btn', () => {
        console.log('View Agreement clicked');
        showSection('agreement-section');
    });
    
    setupButton('back-to-about-btn', () => {
        console.log('Back to About clicked');
        showSection('about-section');
    });
    
    setupButton('review-btn', () => {
        console.log('Review clicked');
        showReviewModal();
    });
    
    setupButton('modal-back-btn', () => {
        console.log('Modal Back clicked');
        closeReviewModal();
    });
    
    setupButton('modal-accept-btn', () => {
        console.log('Modal Accept clicked');
        acceptAgreement();
    });
    
    setupButton('clear-signature-btn', () => {
        console.log('Clear Signature clicked');
        clearSignature();
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

function checkFormCompletion() {
    const nameField = document.getElementById('client-name');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!reviewBtn) return;
    
    const nameFromField = nameField ? nameField.value.trim() : '';
    const nameFromData = clientData.name && clientData.name !== 'Client Name' ? clientData.name : '';
    const hasValidName = nameFromField || nameFromData;
    
    console.log('Form validation - Name from field:', nameFromField, 'Name from data:', nameFromData, 'Has signature:', hasSignature);
    
    if (hasValidName && hasSignature) {
        reviewBtn.disabled = false;
        console.log('Review button enabled');
    } else {
        reviewBtn.disabled = true;
        console.log('Review button disabled - missing requirements');
    }
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section activated:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
        return;
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (sectionId === 'agreement-section') {
        setTimeout(() => {
            console.log('Initializing signature pad...');
            initializeSignaturePad();
        }, 200);
    }
}

function showReviewModal() {
    console.log('Preparing review modal with contract preview...');
    
    const nameField = document.getElementById('client-name');
    const name = nameField ? nameField.value.trim() : clientData.name;
    const date = document.getElementById('agreement-date')?.value || '';
    const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : '';
    
    console.log('Review data - Name:', name, 'Date:', formattedDate);
    
    // Populate client information with yellow highlights
    updateElementText('review-client-name', clientData.name);
    updateElementText('review-client-email', clientData.email);
    updateElementText('review-client-phone', clientData.phone);
    updateElementText('review-client-address', clientData.address);
    updateElementText('review-client-postcode', clientData.postcode);
    
    // Populate scope of work with yellow highlights
    updateElementText('review-scope-work', scopeOfWorkData.workToBeDone);
    updateElementText('review-scope-materials', scopeOfWorkData.materials);
    updateElementText('review-scope-cleanup', scopeOfWorkData.cleanup);
    updateElementText('review-scope-exclusions', scopeOfWorkData.exclusions);
    updateElementText('review-scope-changes', scopeOfWorkData.changes);
    
    // Populate signed name and date
    updateElementText('review-signed-name', name);
    updateElementText('review-signed-date', formattedDate);
    
    // Display signature
    const signatureImage = document.getElementById('review-signature-image');
    if (signatureImage) {
        if (signatureData) {
            signatureImage.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 80px;" alt="Client Signature">`;
        } else {
            signatureImage.innerHTML = '<em style="color: #666;">No signature provided</em>';
        }
    }
    
    // Show the modal
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.add('active');
        // Scroll modal content to top
        const scrollArea = document.getElementById('modal-scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = 0;
        }
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        console.log('Review modal opened');
    }
}

function closeReviewModal() {
    console.log('Closing review modal...');
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
        console.log('Review modal closed');
    }
}

function initializeSignaturePad() {
    console.log('Setting up signature pad...');
    canvas = document.getElementById('signature-pad');
    if (!canvas) {
        console.error('Signature canvas not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');
    
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    
    console.log('Signature pad initialized successfully');
}

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

function draw(e) {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const pos = getEventPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing(e) {
    if (isDrawing && ctx && canvas) {
        if (e) e.preventDefault();
        isDrawing = false;
        ctx.beginPath();
        signatureData = canvas.toDataURL('image/png');
        console.log('Drawing stopped - signature saved');
    }
}

function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        startDrawing(e);
    } else if (e.type === 'touchmove') {
        draw(e);
    }
}

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

function gatherFormData() {
    const nameField = document.getElementById('client-name');
    const signedName = nameField ? nameField.value.trim() : clientData.name;
    
    // Create a clean filename for the signature
    const cleanName = signedName.replace(/[^a-z0-9]/gi, '_');
    const timestamp = Date.now();
    const filename = `signature_${cleanName}_${timestamp}.png`;
    
    return {
        clientName: clientData.name,
        clientEmail: clientData.email,
        clientPhone: clientData.phone,
        clientAddress: clientData.address,
        clientPostcode: clientData.postcode,
        signedName: signedName,
        signedDate: document.getElementById('agreement-date')?.value || new Date().toISOString().split('T')[0],
        
        // Scope of Work data
        scopeWorkToBeDone: scopeOfWorkData.workToBeDone,
        scopeMaterials: scopeOfWorkData.materials,
        scopeCleanup: scopeOfWorkData.cleanup,
        scopeExclusions: scopeOfWorkData.exclusions,
        scopeChanges: scopeOfWorkData.changes,
        
        // Format signature for Airtable attachment field
        signatureAttachment: [
            {
                url: signatureData,
                filename: filename
            }
        ],
        
        submissionTimestamp: new Date().toISOString(),
        agreementType: 'Professional Services Agreement',
        paymentTerms: '14 days from completion',
        warranty: '12 months on workmanship',
        companyName: 'Trader Brothers Ltd',
        serviceType: 'Professional Joinery Services & Bespoke Craftsmanship'
    };
}

function validateFormData(formData) {
    if (!formData.signedName || formData.signedName.trim() === '' || formData.signedName === 'Client Name') {
        alert('Client name is required for agreement processing. Please ensure client data is properly loaded.');
        return false;
    }
    
    if (!signatureData) {
        alert('Please provide your digital signature before proceeding.');
        return false;
    }
    
    return true;
}

// Send agreement data to webhook
async function sendToWebhook(formData) {
    try {
        console.log('Preparing to send data to webhook...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Webhook response status:', webhookResponse.status);
        
        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text().catch(() => 'Unknown error');
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
        }
        
        let responseData = {};
        try {
            responseData = await webhookResponse.json();
            console.log('Webhook response:', responseData);
        } catch (e) {
            console.log('Webhook completed (no JSON response)');
        }
        
        return true;
        
    } catch (error) {
        console.error('Error sending to webhook:', error);
        throw error;
    }
}

async function acceptAgreement() {
    const acceptBtn = document.getElementById('modal-accept-btn');
    if (!acceptBtn) {
        console.error('Accept button not found');
        return;
    }
    
    console.log('Starting agreement acceptance process...');
    
    const originalText = acceptBtn.textContent;
    acceptBtn.textContent = 'Processing...';
    acceptBtn.disabled = true;
    acceptBtn.style.opacity = '0.7';
    acceptBtn.style.cursor = 'not-allowed';

    try {
        const formData = gatherFormData();
        
        if (!validateFormData(formData)) {
            throw new Error('Form validation failed');
        }

        console.log('Form data prepared for webhook submission');

        console.log('Sending agreement data to webhook...');
        await sendToWebhook(formData);
        
        console.log('Agreement successfully submitted to webhook');
        
        showSuccessPopup();
        
        setTimeout(() => {
            closeReviewModal();
            showSection('thankyou-section');
        }, 2000);

    } catch (error) {
        console.error('Error in agreement submission:', error);
        
        let errorMessage = 'There was an error submitting your agreement. Please try again or contact us directly.';
        
        if (error.message.includes('validation failed')) {
            return;
        } else if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('webhook')) {
            errorMessage = 'Unable to process your agreement at this time. Please try again in a moment or contact support.';
        }
        
        alert(errorMessage + '\n\nError details: ' + error.message);
        
    } finally {
        acceptBtn.textContent = originalText;
        acceptBtn.disabled = false;
        acceptBtn.style.opacity = '1';
        acceptBtn.style.cursor = 'pointer';
    }
}

function showSuccessPopup() {
    console.log('Displaying success popup...');
    
    const existingPopup = document.querySelector('.success-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
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
        <p style="margin: 0 0 20px 0; font-size: 16px;">Your professional services agreement has been processed and our team will contact you shortly.</p>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Redirecting to confirmation page...</p>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
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

// ============================================================================
// PDFSHIFT INTEGRATION
// ============================================================================

/**
 * Generate PDF of the signed contract using PDFShift
 */
async function generateContractPDF() {
    try {
        console.log('Starting PDF generation with PDFShift...');
        
        const htmlContent = generatePDFContent();
        console.log('HTML content length:', htmlContent.length, 'characters');
        
        const payload = {
            source: htmlContent,
            sandbox: false,
            filename: `Trader_Brothers_Agreement_${clientData.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`,
            format: 'A4',
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            },
            landscape: false,
            use_print: false
        };

        console.log('Sending request to PDFShift...');
        const response = await fetch(PDFSHIFT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('api:' + PDFSHIFT_API_KEY)
            },
            body: JSON.stringify(payload)
        });

        console.log('PDFShift response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('PDFShift error response:', errorText);
            let errorData = {};
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText };
            }
            throw new Error(`PDFShift API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const pdfBlob = await response.blob();
        console.log('PDF generated successfully, size:', pdfBlob.size, 'bytes');
        
        if (pdfBlob.size < 1000) {
            console.warn('Warning: PDF file size is very small, may be corrupted');
        }
        
        return pdfBlob;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

/**
 * Generate complete HTML content for PDF with yellow highlights
 */
function generatePDFContent() {
    const nameField = document.getElementById('client-name');
    const signedName = nameField ? nameField.value.trim() : clientData.name;
    const signedDate = document.getElementById('agreement-date')?.value || new Date().toISOString().split('T')[0];
    const formattedDate = new Date(signedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Professional Services Agreement - ${signedName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Georgia, serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; background: white; }
        .document { max-width: 210mm; margin: 0 auto; background: white; padding: 40px 50px; }
        .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 30px; margin-bottom: 40px; }
        .logo-container { display: flex; align-items: center; gap: 25px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center; }
        .logo-circle { border: 4px solid #333; border-radius: 50%; padding: 10px; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
        .logo-circle img { width: 85px; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; }
        .header-text { text-align: center; flex: 1; min-width: 250px; }
        .header-text h1 { font-size: 18pt; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
        .tagline { font-size: 12pt; letter-spacing: 1px; color: #444; margin-top: 5px; }
        .parties { margin-bottom: 35px; padding: 25px; background: #fafafa; border-left: 4px solid #333; page-break-inside: avoid; }
        .parties h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 15px; }
        .contract-section { margin-bottom: 30px; page-break-inside: avoid; }
        .contract-section h3 { font-size: 12pt; font-weight: bold; color: #333; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .contract-section h4 { font-weight: bold; margin: 15px 0 5px 0; color: #333; }
        .contract-section p { margin: 10px 0; text-align: justify; }
        .signature-block { margin-top: 60px; padding-top: 30px; border-top: 2px solid #333; page-break-inside: avoid; }
        .signature-header { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px; }
        .contractor-signatures { display: flex; justify-content: space-between; gap: 60px; margin-bottom: 40px; }
        .digital-sig-box { flex: 1; border: 1px solid #333; padding: 20px; background: #fff; }
        .sig-info-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .sig-info-name { font-size: 14px; font-weight: bold; color: #222; margin-bottom: 4px; }
        .sig-info-position { font-size: 12px; color: #555; margin-bottom: 15px; }
        .sig-image-box { border: 1px solid #ccc; min-height: 60px; background: #fafafa; display: flex; align-items: center; justify-content: center; padding: 10px; }
        .sig-image-box img { max-width: 100%; max-height: 50px; height: auto; }
        .signature-section { margin-top: 40px; padding: 25px 20px; background: #fafafa; border: 2px solid #333; border-radius: 4px; page-break-inside: avoid; }
        .signature-section h2 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; color: #333; }
        .form-display { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 11pt; background: white; min-height: 35px; margin: 8px 0 15px 0; }
        .signature-preview { background: white; border: 2px solid #333; border-radius: 4px; padding: 15px; margin: 10px 0; text-align: center; min-height: 100px; display: flex; align-items: center; justify-content: center; }
        .highlight-yellow { background: #fff3cd; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        label { display: block; font-size: 9pt; color: #666; text-transform: uppercase; margin-bottom: 5px; margin-top: 15px; }
        @page { margin: 20mm; }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <div class="logo-container">
                <div class="logo-circle">
                    <img src="https://github.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/blob/main/Trader%20Brothers.png?raw=true" alt="Trader Brothers Logo">
                </div>
                <div class="header-text">
                    <h1>Professional Services Agreement</h1>
                    <div class="tagline">Professional Joinery Services & Bespoke Craftsmanship</div>
                </div>
            </div>
        </div>

        <div class="parties">
            <h2>Trader Brothers Company Information</h2>
            <p><strong>Trader Brothers Ltd</strong><br>
            <strong>Registration:</strong> [Company Registration Number]<br>
            <strong>VAT Number:</strong> [VAT Registration Number]<br>
            <strong>Address:</strong> [Business Address]<br>
            <strong>Email:</strong> [Business Email]<br>
            <strong>Phone:</strong> [Business Phone]</p>
        </div>

        <div class="parties">
            <h2>Client Information</h2>
            <p><strong><span class="highlight-yellow">${clientData.name}</span></strong><br>
            <strong>Email:</strong> <span class="highlight-yellow">${clientData.email}</span><br>
            <strong>Phone:</strong> <span class="highlight-yellow">${clientData.phone}</span><br>
            <strong>Address:</strong> <span class="highlight-yellow">${clientData.address}</span><br>
            <strong>Postcode:</strong> <span class="highlight-yellow">${clientData.postcode}</span></p>
        </div>

        <div class="contract-section">
            <h3>Scope of Work</h3>
            <div style="margin-bottom: 20px;">
                <h4>The Work To Be Done</h4>
                <p class="highlight-yellow">${scopeOfWorkData.workToBeDone}</p>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>Materials and Supplies</h4>
                <p class="highlight-yellow">${scopeOfWorkData.materials}</p>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>Cleanup</h4>
                <p class="highlight-yellow">${scopeOfWorkData.cleanup}</p>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>What Is NOT Included (Exclusions)</h4>
                <p class="highlight-yellow">${scopeOfWorkData.exclusions}</p>
            </div>
            <div style="margin-bottom: 0;">
                <h4>Changes to the Job</h4>
                <p class="highlight-yellow">${scopeOfWorkData.changes}</p>
            </div>
        </div>

        <div class="contract-section">
            <h3>1. What We Do</h3>
            <p>We provide professional joinery and carpentry services including bespoke furniture, fitted wardrobes, kitchen and bathroom fitting, commercial fit-outs, and general carpentry work. All work follows building regulations and industry standards.</p>
        </div>

        <div class="contract-section">
            <h3>2. Quotes and Pricing</h3>
            <p>Our written quotes are valid for 30 days. Prices include VAT unless stated otherwise. If you want changes to the original plan, we'll discuss costs before starting any extra work.</p>
        </div>

        <div class="contract-section">
            <h3>3. Payment</h3>
            <p>Payment is due within 14 days of completion unless we agree otherwise. For larger jobs over £3,000, we may ask for progress payments as work is completed.</p>
        </div>

        <div class="contract-section">
            <h3>4. Materials and Quality</h3>
            <p>We use quality materials suitable for the job. We guarantee our workmanship for 12 months from completion. If something goes wrong due to our work, we'll fix it at no cost to you.</p>
        </div>

        <div class="contract-section">
            <h3>5. Access and Site Preparation</h3>
            <p>You'll provide reasonable access to the work area and a safe working environment. If delays happen due to site access or preparation issues, we may need to charge extra time at our standard rates.</p>
        </div>

        <div class="contract-section">
            <h3>6. Changes and Extras</h3>
            <p>Any changes to the original job must be agreed in writing. We'll give you a written estimate for extra work before proceeding.</p>
        </div>

        <div class="contract-section">
            <h3>7. Insurance and Safety</h3>
            <p>We carry full public liability insurance and follow all health and safety requirements. We'll work safely and keep disruption to a minimum.</p>
        </div>

        <div class="contract-section">
            <h3>8. Unforeseen Circumstances</h3>
            <p>Sometimes things happen beyond our control (like material shortages, bad weather, or finding unexpected problems). We'll keep you informed and work together to find solutions.</p>
        </div>

        <div class="contract-section">
            <h3>9. Disputes</h3>
            <p>If we have any disagreements, we'll try to sort them out by talking first. This agreement is governed by English law.</p>
        </div>

        <div class="signature-block">
            <div class="signature-header">Execution</div>
            <h4 style="font-size: 10pt; text-transform: uppercase; color: #555; margin-bottom: 20px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">Signed on behalf of Trader Brothers</h4>
            <div class="contractor-signatures">
                <div class="digital-sig-box">
                    <div class="sig-info-label">Name</div>
                    <div class="sig-info-name">Olaf Sawczak</div>
                    <div class="sig-info-position">Director</div>
                    <div class="sig-info-label" style="margin-top: 15px;">Signature</div>
                    <div class="sig-image-box">
                        <img src="https://github.com/infotraderbrothers-lgtm/contract.signatures/blob/main/images/Olaf.png?raw=true" alt="Olaf Sawczak Signature">
                    </div>
                </div>
                <div class="digital-sig-box">
                    <div class="sig-info-label">Name</div>
                    <div class="sig-info-name">Milosz Sawczak</div>
                    <div class="sig-info-position">Manager</div>
                    <div class="sig-info-label" style="margin-top: 15px;">Signature</div>
                    <div class="sig-image-box">
                        <img src="https://github.com/infotraderbrothers-lgtm/contract.signatures/blob/main/images/Milosz.png?raw=true" alt="Milosz Sawczak Signature">
                    </div>
                </div>
            </div>
        </div>

        <div class="signature-section">
            <h2>Client Signature</h2>
            <label>Full Name:</label>
            <div class="form-display">${signedName}</div>
            <label>Date:</label>
            <div class="form-display">${formattedDate}</div>
            <label>Digital Signature:</label>
            <div class="signature-preview">
                <img src="${signatureData}" style="max-width: 100%; max-height: 80px;" alt="Client Signature">
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return htmlContent;
}

/**
 * Download the generated PDF
 */
function downloadPDF(pdfBlob, filename) {
    try {
        console.log('Starting PDF download, blob size:', pdfBlob.size);
        
        // Verify blob is valid
        if (!pdfBlob || pdfBlob.size === 0) {
            throw new Error('PDF blob is empty or invalid');
        }
        
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `Trader_Brothers_Agreement_${Date.now()}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        console.log('Triggering download for:', link.download);
        link.click();
        
        // Clean up after a delay to ensure download starts
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('PDF download cleanup complete');
        }, 100);
        
    } catch (error) {
        console.error('Error in downloadPDF:', error);
        throw error;
    }
}

/**
 * Main function to handle PDF generation and download
 */
async function handlePDFDownload() {
    try {
        console.log('Initiating PDF download...');
        
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.textContent = 'Generating PDF...';
            downloadBtn.disabled = true;
        }

        const pdfBlob = await generateContractPDF();
        
        const filename = `Trader_Brothers_Agreement_${clientData.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
        downloadPDF(pdfBlob, filename);
        
        if (downloadBtn) {
            downloadBtn.textContent = '📄 Download Agreement PDF';
            downloadBtn.disabled = false;
        }

        console.log('PDF downloaded successfully');
        
    } catch (error) {
        console.error('Error in PDF download process:', error);
        alert('There was an error generating your PDF. Please try again or contact support.\n\nError: ' + error.message);
        
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.textContent = '📄 Download Agreement PDF';
            downloadBtn.disabled = false;
        }
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('Service Agreement System - script.js loaded successfully');
