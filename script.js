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
        showReview();
    });
    
    setupButton('back-to-agreement-btn', () => {
        console.log('Back to Agreement clicked');
        showSection('agreement-section');
    });
    
    setupButton('accept-btn', () => {
        console.log('Accept Agreement clicked');
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
        reviewBtn.classList.add('glow');
        console.log('Review button enabled');
    } else {
        reviewBtn.disabled = true;
        reviewBtn.classList.remove('glow');
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

function showReview() {
    console.log('Preparing review section...');
    
    const nameField = document.getElementById('client-name');
    const name = nameField ? nameField.value.trim() : clientData.name;
    const date = document.getElementById('agreement-date')?.value || '';
    
    console.log('Review data - Name:', name, 'Date:', date);
    
    const reviewNameEl = document.getElementById('review-name');
    const reviewDateEl = document.getElementById('review-date');
    
    if (reviewNameEl) {
        reviewNameEl.textContent = name || 'Not provided';
    }
    if (reviewDateEl) {
        reviewDateEl.textContent = date ? new Date(date).toLocaleDateString('en-GB') : 'Not provided';
    }
    
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
        console.log('Signature attachment format:', formData.signatureAttachment);
        
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
    const acceptBtn = document.getElementById('accept-btn');
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

window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('Service Agreement System - script.js loaded successfully');
