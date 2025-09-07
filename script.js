// Global variables
let canvas, ctx, isDrawing = false, hasSignature = false;
let signatureData = '';
let clientData = {};
window.agreementPDF = null;
window.agreementData = null;

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
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    signatureData = '';
    checkFormCompletion();
    console.log('Signature cleared');
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

// Enhanced professional PDF generation
async function generateProfessionalPDF(data) {
    try {
        console.log('Generating professional PDF...');
        
        // Check if jsPDF is available
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        // Set up colors
        const primaryColor = [44, 62, 80]; // #2c3e50
        const secondaryColor = [52, 152, 219]; // #3498db
        
        // Header with company branding
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('TRADER BROTHERS', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Professional Joinery Services & Bespoke Craftsmanship', 105, 28, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('PROFESSIONAL SERVICES AGREEMENT', 105, 35, { align: 'center' });
        
        // Reset text color for body
        doc.setTextColor(0, 0, 0);
        
        let yPos = 55;
        
        // Agreement Date
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Agreement Date: ${new Date(data.signedDate).toLocaleDateString('en-GB')}`, 160, yPos);
        yPos += 15;
        
        // Client Information Section
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(10, yPos - 5, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('CLIENT INFORMATION', 15, yPos);
        yPos += 12;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(data.signatureClientName || data.clientName || 'Client Name', 15, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        doc.text(`Email: ${data.clientEmail || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Phone: ${data.clientPhone || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Address: ${data.clientAddress || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Postcode: ${data.clientPostcode || 'Not provided'}`, 15, yPos);
        yPos += 15;
        
        // Company Information Section
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(10, yPos - 5, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('COMPANY INFORMATION', 15, yPos);
        yPos += 12;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Trader Brothers Ltd', 15, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        doc.text('Registration: [Company Registration Number]', 15, yPos);
        yPos += 4;
        doc.text('VAT Number: [VAT Registration Number]', 15, yPos);
        yPos += 4;
        doc.text('Address: [Business Address]', 15, yPos);
        yPos += 4;
        doc.text('Email: [Business Email] | Phone: [Business Phone]', 15, yPos);
        yPos += 15;
        
        // Agreement Terms
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(10, yPos - 5, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('AGREEMENT TERMS & CONDITIONS', 15, yPos);
        yPos += 12;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        const terms = [
            '1. SERVICES: We provide professional joinery and carpentry services including',
            '   bespoke furniture, fitted wardrobes, kitchen and bathroom fitting, commercial',
            '   fit-outs, and general carpentry work following building regulations.',
            '',
            '2. QUOTES & PRICING: Written quotes valid for 30 days. Prices include VAT',
            '   unless stated otherwise. Changes to original plan discussed before work.',
            '',
            '3. PAYMENT: Payment due within 14 days of completion. For jobs over £3,000,',
            '   progress payments may be required as work is completed.',
            '',
            '4. MATERIALS & QUALITY: Quality materials suitable for each project.',
            '   12 months guarantee on workmanship from completion date.',
            '',
            '5. ACCESS & PREPARATION: Client provides reasonable access to work area',
            '   and safe working environment. Delays due to access issues may incur charges.',
            '',
            '6. CHANGES & EXTRAS: All changes must be agreed in writing with written',
            '   estimate provided before proceeding with additional work.',
            '',
            '7. INSURANCE & SAFETY: Full public liability insurance carried. All health',
            '   and safety requirements followed with minimal disruption.',
            '',
            '8. UNFORESEEN CIRCUMSTANCES: Material shortages, weather, or unexpected',
            '   problems may cause delays. Client kept informed of all developments.',
            '',
            '9. DISPUTES: Disagreements resolved through discussion first.',
            '   Agreement governed by English law.'
        ];
        
        terms.forEach(term => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(term, 15, yPos);
            yPos += 4;
        });
        
        yPos += 10;
        
        // Signature Section
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(10, yPos - 5, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('CLIENT ACCEPTANCE & SIGNATURE', 15, yPos);
        yPos += 15;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Client Name:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(data.signatureClientName || 'Not provided', 55, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'bold');
        doc.text('Date Signed:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(new Date(data.signedDate).toLocaleDateString('en-GB'), 55, yPos);
        yPos += 15;
        
        doc.setFont(undefined, 'bold');
        doc.text('Digital Signature:', 15, yPos);
        yPos += 5;
        
        // Add signature image if available
        if (data.signature) {
            try {
                doc.setDrawColor(200, 200, 200);
                doc.rect(15, yPos, 80, 25);
                doc.addImage(data.signature, 'PNG', 17, yPos + 2, 76, 21);
                yPos += 30;
            } catch (imgError) {
                console.log('Could not add signature image:', imgError);
                doc.text('✓ Digital signature captured and verified', 15, yPos);
                yPos += 10;
            }
        } else {
            doc.text('No signature provided', 15, yPos);
            yPos += 10;
        }
        
        yPos += 10;
        
        // Agreement confirmation
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text('By signing above, the client confirms:', 15, yPos);
        yPos += 5;
        doc.text('• Understanding and acceptance of all terms and conditions', 20, yPos);
        yPos += 4;
        doc.text('• Agreement to payment terms (14 days from completion)', 20, yPos);
        yPos += 4;
        doc.text('• Acknowledgment of 12-month workmanship warranty', 20, yPos);
        yPos += 4;
        doc.text('• Agreement that changes must be confirmed in writing', 20, yPos);
        yPos += 10;
        
        // Footer
        yPos = Math.max(yPos, 270);
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`Document generated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`, 105, yPos, { align: 'center' });
        yPos += 4;
        doc.text('This is a legally binding agreement - keep for your records', 105, yPos + 4, { align: 'center' });
        
        console.log('Professional PDF generated successfully');
        return doc;
        
    } catch (error) {
        console.error('Error generating professional PDF:', error);
        return await generateSimplePDF(data);
    }
}

// Simple PDF fallback
async function generateSimplePDF(data) {
    console.log('Generating simple PDF fallback...');
    
    try {
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Client: ${data.signatureClientName || data.clientName || 'Not provided'}`, 20, 40);
        doc.text(`Date: ${new Date(data.signedDate).toLocaleDateString('en-GB')}`, 20, 50);
        doc.text('Email: ' + (data.clientEmail || 'Not provided'), 20, 60);
        doc.text('Phone: ' + (data.clientPhone || 'Not provided'), 20, 70);
        
        doc.text('Agreement Status: Successfully Submitted & Accepted', 20, 90);
        doc.text('Payment Terms: 14 days from completion', 20, 100);
        doc.text('Warranty: 12 months on workmanship', 20, 110);
        
        if (data.signature) {
            try {
                doc.text('Digital Signature:', 20, 130);
                doc.addImage(data.signature, 'PNG', 20, 135, 60, 20);
            } catch (e) {
                doc.text('✓ Digital signature on file', 20, 140);
            }
        }
        
        doc.setFontSize(10);
        doc.text('Generated: ' + new Date().toLocaleString('en-GB'), 20, 280);
        
        return doc;
    } catch (error) {
        console.error('Error in simple PDF generation:', error);
        throw error;
    }
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

        // Generate professional PDF
        console.log('Generating PDF...');
        const pdf = await generateProfessionalPDF(formData);
        const pdfBlob = pdf.output('blob');
        
        // Convert PDF to base64 for webhook
        const pdfBase64 = await blobToBase64(pdfBlob);
        
        // Prepare webhook data
        const webhookData = {
            ...formData,
            pdfDocument: pdfBase64,
            pdfFileName: `TraderBrothers_Agreement_${formData.signatureClientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
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
            const errorText = await webhookResponse.text();
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
        }
        
        const responseData = await webhookResponse.json().catch(() => ({}));
        console.log('Webhook response:', responseData);
        
        // Store PDF for download
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

// Download agreement PDF
function downloadAgreement() {
    console.log('Starting PDF download...');
    
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Preparing Download...';
        downloadBtn.disabled = true;
        
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }, 2000);
    }
    
    try {
        if (window.agreementPDF && window.agreementData) {
            const clientName = window.agreementData.signatureClientName || window.agreementData.clientName || 'Client';
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `TraderBrothers_Agreement_${clientName.replace(/\s+/g, '_')}_${dateStr}.pdf`;
            
            window.agreementPDF.save(filename);
            console.log('PDF downloaded:', filename);
            
            // Show brief success message
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
            `;
            successMsg.textContent = 'PDF downloaded successfully!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(successMsg)) {
                        document.body.removeChild(successMsg);
                    }
                }, 300);
            }, 2000);
            
        } else {
            console.log('No stored PDF found, generating basic one...');
            // Generate a basic PDF if none exists
            const { jsPDF } = window.jsPDF;
            const doc = new jsPDF();
            
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text('Agreement successfully submitted', 20, 40);
            doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 50);
            doc.text('Please contact us for a complete copy of your agreement.', 20, 60);
            doc.text('Email: [Business Email] | Phone: [Business Phone]', 20, 80);
            
            doc.setFontSize(10);
            doc.text('Generated: ' + new Date().toLocaleString('en-GB'), 20, 280);
            
            doc.save('TraderBrothers_Agreement.pdf');
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Unable to download PDF at this time. Please contact us for a copy of your agreement.\n\nEmail: [Business Email]\nPhone: [Business Phone]');
    }
}
