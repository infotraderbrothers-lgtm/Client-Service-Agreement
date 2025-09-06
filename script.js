// Combined JavaScript for Trader Brothers Professional Services Agreement
// Includes: signature pad, form validation, PDF generation, and webhook integration

// Global variables
let canvas, ctx, isDrawing = false, hasSignature = false;
let signatureData = '';
window.agreementPDF = null;
window.agreementData = null;

// Make.com webhook configuration
const WEBHOOK_URL = 'https://hook.eu2.make.com/b1xehsayp5nr7qtt7cybsgd19rmcqj2t';

// ===== INITIALIZATION =====

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page
function initializePage() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('agreement-date');
    if (dateField) {
        dateField.value = today;
    }
    
    // Add event listeners for form validation
    const nameField = document.getElementById('client-name');
    if (nameField) {
        nameField.addEventListener('input', checkFormCompletion);
    }
}

// ===== FORM VALIDATION =====

// Check if form is complete and enable/disable review button
function checkFormCompletion() {
    const nameField = document.getElementById('client-name');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!nameField || !reviewBtn) return;
    
    const name = nameField.value.trim();
    
    // Check if we have a name and a signature
    if (name && hasSignature) {
        reviewBtn.disabled = false;
        reviewBtn.classList.add('glow');
    } else {
        reviewBtn.disabled = true;
        reviewBtn.classList.remove('glow');
    }
}

// ===== SECTION NAVIGATION =====

// Show specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Initialize signature pad if showing agreement section
    if (sectionId === 'agreement-section') {
        setTimeout(initializeSignaturePad, 100);
    }
}

// Show review section with populated data
function showReview() {
    // Get form values
    const name = document.getElementById('client-name')?.value || '';
    const date = document.getElementById('agreement-date')?.value || '';
    
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

// ===== SIGNATURE PAD FUNCTIONALITY =====

// Initialize signature pad functionality
function initializeSignaturePad() {
    canvas = document.getElementById('signature-pad');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Clear any existing event listeners
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('mouseout', stopDrawing);
    canvas.removeEventListener('touchstart', handleTouch);
    canvas.removeEventListener('touchmove', handleTouch);
    canvas.removeEventListener('touchend', stopDrawing);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
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
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    hasSignature = false;
    signatureData = '';
    checkFormCompletion();
}

// ===== PDF GENERATION =====

// Professional PDF generation
async function generateProfessionalPDF(data) {
    try {
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
        doc.text('Email: [Business Email]', 15, yPos);
        yPos += 4;
        doc.text('Phone: [Business Phone]', 15, yPos);
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
        doc.text(data.clientName || data.signatureClientName || 'Client Name', 15, yPos);
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
        
        // Agreement Terms Section
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
            '1. SERVICES: We provide professional joinery and carpentry services including bespoke furniture,',
            '   fitted wardrobes, kitchen and bathroom fitting, commercial fit-outs, and general carpentry work.',
            '   All work follows building regulations and industry standards.',
            '',
            '2. PAYMENT: Payment is due within 14 days of completion unless otherwise agreed.',
            '   For larger jobs over £3,000, progress payments may be required.',
            '',
            '3. WARRANTY: We guarantee our workmanship for 12 months from completion.',
            '   Any defects due to our workmanship will be rectified at no cost.',
            '',
            '4. MATERIALS: We use quality materials suitable for each project.',
            '',
            '5. CHANGES: Any changes to the original scope must be agreed in writing',
            '   with cost estimates provided before proceeding.',
            '',
            '6. INSURANCE: We carry full public liability insurance and follow all',
            '   health and safety requirements.',
            '',
            '7. GOVERNING LAW: This agreement is governed by English law.'
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
        doc.text('CLIENT ACCEPTANCE', 15, yPos);
        yPos += 15;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('By signing below, the client accepts all terms and conditions of this agreement:', 15, yPos);
        yPos += 15;
        
        doc.setFont(undefined, 'bold');
        doc.text('Client Name:', 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(data.signatureClientName || data.clientName || 'Not provided', 55, yPos);
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
                // Create a border for the signature
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
        doc.text('This agreement was digitally signed and submitted via Trader Brothers online platform.', 105, yPos, { align: 'center' });
        doc.text(`Document generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`, 105, yPos + 4, { align: 'center' });
        
        return doc;
        
    } catch (error) {
        console.error('Error generating professional PDF:', error);
        // Fallback to simple PDF
        return await generateSimplePDF(data);
    }
}

// Simple PDF fallback
async function generateSimplePDF(data) {
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

// ===== WEBHOOK INTEGRATION =====

// Helper function to extract client info from HTML
function extractClientInfo(htmlText, label) {
    try {
        if (label === 'strong') {
            const match = htmlText.match(/<strong>([^<]+)<\/strong>/);
            return match ? match[1].replace(/[{}]/g, '').trim() : '';
        } else {
            const regex = new RegExp(`<strong>${label}</strong>\\s*([^<]+)`, 'i');
            const match = htmlText.match(regex);
            return match ? match[1].replace(/[{}]/g, '').trim() : '';
        }
    } catch (e) {
        return '';
    }
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

// Accept agreement and send to webhook
async function acceptAgreement() {
    const acceptBtn = document.getElementById('accept-btn');
    if (!acceptBtn) return;
    
    acceptBtn.textContent = 'Processing...';
    acceptBtn.disabled = true;

    try {
        // Extract client info from the display (populated by make.com)
        const clientInfoSection = document.querySelector('.contract-section:nth-of-type(2) p');
        const clientInfoText = clientInfoSection ? clientInfoSection.innerHTML : '';
        
        // Parse client info from the HTML
        const clientName = extractClientInfo(clientInfoText, 'strong');
        const clientEmail = extractClientInfo(clientInfoText, 'Email:');
        const clientPhone = extractClientInfo(clientInfoText, 'Phone:');
        const clientAddress = extractClientInfo(clientInfoText, 'Address:');
        const clientPostcode = extractClientInfo(clientInfoText, 'Postcode:');

        // Gather form data
        const formData = {
            // Form inputs
            signatureClientName: document.getElementById('client-name')?.value || '',
            signedDate: document.getElementById('agreement-date')?.value || '',
            signature: signatureData,
            
            // Client info from make.com populated section
            clientName: clientName,
            clientEmail: clientEmail,
            clientPhone: clientPhone,
            clientAddress: clientAddress,
            clientPostcode: clientPostcode,
            
            // Agreement details
            submissionTimestamp: new Date().toISOString(),
            agreementType: 'Professional Services Agreement',
            paymentTerms: '14 days from completion',
            warranty: '12 months on workmanship',
            
            // Company details
            companyName: 'Trader Brothers Ltd',
            serviceType: 'Professional Joinery Services & Bespoke Craftsmanship'
        };

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

        // Send to make.com webhook
        const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        });

        if (!webhookResponse.ok) {
            throw new Error(`Webhook failed: ${webhookResponse.status}`);
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
        alert('There was an error submitting your agreement. Please try again or contact us directly.');
        acceptBtn.textContent = 'Accept Agreement';
        acceptBtn.disabled = false;
    }
}

// Show success popup
function showSuccessPopup() {
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
            document.body.removeChild(overlay);
            document.head.removeChild(style);
        }, 300);
    }, 1500);
}

// Download agreement PDF
function downloadAgreement() {
    try {
        if (window.agreementPDF && window.agreementData) {
            const clientName = window.agreementData.signatureClientName || window.agreementData.clientName || 'Client';
            const filename = `TraderBrothers_Agreement_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            window.agreementPDF.save(filename);
        } else {
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
        alert('Unable to download PDF. Please contact us at [Business Email] for a copy of your agreement.');
    }
}

// Helper function for safe element retrieval
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// Initialize when page loads (fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
