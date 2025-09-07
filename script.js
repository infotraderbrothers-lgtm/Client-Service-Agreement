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

    // Update display elements
    document.getElementById('display-client-name').textContent = clientData.name;
    document.getElementById('display-client-email').textContent = clientData.email;
    document.getElementById('display-client-phone').textContent = clientData.phone;
    document.getElementById('display-client-address').textContent = clientData.address;
    document.getElementById('display-client-postcode').textContent = clientData.postcode;

    // Pre-fill the signature form name field
    setTimeout(() => {
        const nameField = document.getElementById('client-name');
        if (nameField) {
            nameField.value = clientData.name;
        }
    }, 100);
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
    const viewAgreementBtn = document.getElementById('view-agreement-btn');
    if (viewAgreementBtn) {
        viewAgreementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('View Agreement clicked');
            showSection('agreement-section');
        });
    }
    
    // Back to About button
    const backToAboutBtn = document.getElementById('back-to-about-btn');
    if (backToAboutBtn) {
        backToAboutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back to About clicked');
            showSection('about-section');
        });
    }
    
    // Review button
    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Review clicked');
            showReview();
        });
    }
    
    // Back to Agreement button
    const backToAgreementBtn = document.getElementById('back-to-agreement-btn');
    if (backToAgreementBtn) {
        backToAgreementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back to Agreement clicked');
            showSection('agreement-section');
        });
    }
    
    // Accept Agreement button
    const acceptBtn = document.getElementById('accept-btn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Accept Agreement clicked');
            acceptAgreement();
        });
    }
    
    // Clear Signature button
    const clearSignatureBtn = document.getElementById('clear-signature-btn');
    if (clearSignatureBtn) {
        clearSignatureBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clear Signature clicked');
            clearSignature();
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Download clicked');
            downloadAgreement();
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
            signaturePreview.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 80px;" alt="Digital Signature">`;
        } else {
            signaturePreview.innerHTML = '<em>Signature will appear here</em>';
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
    resizeCanvas();
    
    // Clear existing event listeners by cloning element
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');
    
    // Set up canvas again
    resizeCanvas();
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
    
    console.log('Signature pad initialized successfully');
}

// Resize canvas to fit container
function resizeCanvas() {
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
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
        e.preventDefault();
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
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
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

// Professional PDF generation
async function generateProfessionalPDF(data) {
    try {
        console.log('Generating PDF...');
        
        // Check if jsPDF is available
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        // Set up colors and styling
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
        doc.text(data.clientName || 'Client Name', 15, yPos);
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
        
        // Agreement Terms
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(10, yPos - 5, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('AGREEMENT TERMS', 15, yPos);
        yPos += 12;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        const terms = [
            '1. SERVICES: Professional joinery and carpentry services including bespoke furniture,',
            '   fitted wardrobes, kitchen fitting, and general carpentry work.',
            '2. PAYMENT: Payment due within 14 days of completion.',
            '3. WARRANTY: 12 months guarantee on workmanship.',
            '4. MATERIALS: Quality materials suitable for each project.',
            '5. CHANGES: Any changes must be agreed in writing.',
            '6. INSURANCE: Full public liability insurance carried.',
            '7. GOVERNING LAW: Agreement governed by English law.'
        ];
        
        terms.forEach(term => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(term, 15, yPos);
            yPos += 5;
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
        doc.text('CLIENT ACCEPTANCE', 15, yPos);
        yPos += 15;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Client Name:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(data.signatureClientName || 'Not provided', 55, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'bold');
        doc.text('Date:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(new Date(data.signedDate).toLocaleDateString('en-GB'), 35, yPos);
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
                doc.text('Digital signature captured', 15, yPos);
                yPos += 10;
            }
        } else {
            doc.text('No signature provided', 15, yPos);
            yPos += 10;
        }
        
        // Footer
        yPos = 280;
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text('Document generated: ' + new Date().toLocaleDateString('en-GB'), 105, yPos, { align: 'center' });
        
        console.log('PDF generated successfully');
        return doc;
        
    } catch (error) {
        console.error('Error generating professional PDF:', error);
        return await generateSimplePDF(data);
    }
}

// Simple PDF fallback
async function generateSimplePDF(data) {
    console.log('Generating simple PDF fallback...');
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${data.signatureClientName || data.clientName}`, 20, 40);
    doc.text(`Date: ${new Date(data.signedDate).toLocaleDateString('en-GB')}`, 20, 50);
    doc.text('Agreement successfully submitted', 20, 60);
    
    if (data.signature) {
        try {
            doc.text('Digital Signature:', 20, 80);
            doc.addImage(data.signature, 'PNG', 20, 85, 60, 20);
        } catch (e) {
            doc.text('Digital signature on file', 20, 90);
        }
    }
    
    return doc;
}

// Accept agreement and send to webhook
async function acceptAgreement() {
    const acceptBtn = document.getElementById('accept-btn');
    if (!acceptBtn) return;
    
    console.log('Starting agreement acceptance process...');
    acceptBtn.textContent = 'Processing...';
    acceptBtn.disabled = true;

    try {
        // Gather form data
        const formData = {
            // Form inputs
            signatureClientName: document.getElementById('client-name')?.value || '',
            signedDate: document.getElementById('agreement-date')?.value || '',
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

        // Generate professional PDF
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

        // Send to make.com webhook
        const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        });

        console.log('Webhook response status:', webhookResponse.status);

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
        }
        
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
        alert('There was an error submitting your agreement. Please try again or contact us directly.\n\nError: ' + error.message);
        acceptBtn.textContent = 'Accept Agreement';
        acceptBtn.disabled = false;
    }
}

// Show success popup
function showSuccessPopup() {
    console.log('Showing success popup...');
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
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
    `;
    
    popup.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 20px;">✓</div>
        <h2 style="margin: 0 0 15px 0; font-size: 24px;">Agreement Submitted!</h2>
        <p style="margin: 0 0 20px 0; font-size: 16px;">Your professional services agreement has been successfully processed and sent to our team.</p>
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
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
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
    }, 1500);
}

// Download agreement PDF
function downloadAgreement() {
    console.log('Starting PDF download...');
    try {
        if (window.agreementPDF && window.agreementData) {
            const clientName = window.agreementData.signatureClientName || window.agreementData.clientName || 'Client';
            const filename = `TraderBrothers_Agreement_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            window.agreementPDF.save(filename);
            console.log('PDF downloaded:', filename);
        } else {
            console.log('No stored PDF found, generating basic one...');
            // Generate a basic PDF if none exists
            const { jsPDF } = window.jsPDF;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
            doc.setFontSize(12);
            doc.text('Agreement successfully submitted', 20, 40);
            doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 50);
            doc.text('Please contact us for a complete copy of your agreement.', 20, 60);
            doc.save('TraderBrothers_Agreement.pdf');
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Unable to download PDF. Please contact us for a copy of your agreement.');
    }
}
