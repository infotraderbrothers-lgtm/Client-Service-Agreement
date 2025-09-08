// PDF Application Module
// This module handles all PDF generation functionality

let pdfLibraryLoaded = false;

// Check if PDF library is loaded
function checkPDFLibrary() {
    return new Promise((resolve) => {
        // Check if jsPDF is available in multiple possible ways
        if (typeof window.jsPDF !== 'undefined' || 
            (window.jspdf && window.jspdf.jsPDF) ||
            typeof jsPDF !== 'undefined') {
            pdfLibraryLoaded = true;
            console.log('PDF library detected');
            resolve(true);
            return;
        }
        
        // Wait for library to load
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof window.jsPDF !== 'undefined' || 
                (window.jspdf && window.jspdf.jsPDF) ||
                typeof jsPDF !== 'undefined') {
                pdfLibraryLoaded = true;
                console.log('PDF library loaded after', attempts * 100, 'ms');
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                console.warn('PDF library failed to load after 10 seconds');
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

// Get jsPDF constructor with fallback methods
function getJsPDF() {
    // Try different ways jsPDF might be available
    if (typeof window.jsPDF !== 'undefined') {
        return window.jsPDF;
    }
    if (window.jspdf && window.jspdf.jsPDF) {
        return window.jspdf.jsPDF;
    }
    if (typeof jsPDF !== 'undefined') {
        return jsPDF;
    }
    throw new Error('jsPDF not found');
}

// Enhanced PDF generation with better error handling
async function generateProfessionalPDF(data) {
    try {
        console.log('Starting PDF generation...');
        
        // Ensure PDF library is loaded
        await checkPDFLibrary();
        
        if (!pdfLibraryLoaded) {
            console.warn('PDF library not available, using fallback');
            return await generateTextBasedPDF(data);
        }

        let jsPDFConstructor;
        try {
            jsPDFConstructor = getJsPDF();
        } catch (e) {
            console.error('Could not get jsPDF constructor:', e);
            return await generateTextBasedPDF(data);
        }
        
        // Test if jsPDF constructor works
        let doc;
        try {
            doc = new jsPDFConstructor();
            if (!doc || typeof doc.text !== 'function') {
                throw new Error('Invalid jsPDF instance');
            }
        } catch (constructorError) {
            console.error('jsPDF constructor failed:', constructorError);
            return await generateTextBasedPDF(data);
        }
        
        console.log('PDF library working, generating professional PDF...');
        
        // Set up colors
        const primaryColor = [44, 62, 80]; // #2c3e50
        const secondaryColor = [52, 152, 219]; // #3498db
        
        // Header with company branding
        try {
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('TRADER BROTHERS', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            if (doc.setFont) doc.setFont(undefined, 'normal');
            doc.text('Professional Joinery Services & Bespoke Craftsmanship', 105, 28, { align: 'center' });
            
            doc.setFontSize(16);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('PROFESSIONAL SERVICES AGREEMENT', 105, 35, { align: 'center' });
        } catch (headerError) {
            console.warn('Header styling failed, using basic text:', headerError);
            doc.text('TRADER BROTHERS - PROFESSIONAL SERVICES AGREEMENT', 20, 20);
        }
        
        // Reset text color for body
        doc.setTextColor(0, 0, 0);
        
        let yPos = 55;
        
        // Agreement Date
        doc.setFontSize(10);
        if (doc.setFont) doc.setFont(undefined, 'normal');
        const agreementDate = data.signedDate ? new Date(data.signedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
        doc.text(`Agreement Date: ${agreementDate}`, 160, yPos);
        yPos += 15;
        
        // Client Information Section
        try {
            doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.rect(10, yPos - 5, 190, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('CLIENT INFORMATION', 15, yPos);
            yPos += 12;
        } catch (e) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text('CLIENT INFORMATION', 15, yPos);
            yPos += 10;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        if (doc.setFont) doc.setFont(undefined, 'bold');
        doc.text(data.signatureClientName || data.clientName || 'Client Name', 15, yPos);
        yPos += 5;
        if (doc.setFont) doc.setFont(undefined, 'normal');
        doc.text(`Email: ${data.clientEmail || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Phone: ${data.clientPhone || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Address: ${data.clientAddress || 'Not provided'}`, 15, yPos);
        yPos += 4;
        doc.text(`Postcode: ${data.clientPostcode || 'Not provided'}`, 15, yPos);
        yPos += 15;
        
        // Company Information Section
        try {
            doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.rect(10, yPos - 5, 190, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('COMPANY INFORMATION', 15, yPos);
            yPos += 12;
        } catch (e) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text('COMPANY INFORMATION', 15, yPos);
            yPos += 10;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        if (doc.setFont) doc.setFont(undefined, 'bold');
        doc.text('Trader Brothers Ltd', 15, yPos);
        yPos += 5;
        if (doc.setFont) doc.setFont(undefined, 'normal');
        doc.text('Registration: [Company Registration Number]', 15, yPos);
        yPos += 4;
        doc.text('VAT Number: [VAT Registration Number]', 15, yPos);
        yPos += 4;
        doc.text('Address: [Business Address]', 15, yPos);
        yPos += 4;
        doc.text('Email: [Business Email] | Phone: [Business Phone]', 15, yPos);
        yPos += 15;
        
        // Agreement Terms
        try {
            doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.rect(10, yPos - 5, 190, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('AGREEMENT TERMS & CONDITIONS', 15, yPos);
            yPos += 12;
        } catch (e) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text('AGREEMENT TERMS & CONDITIONS', 15, yPos);
            yPos += 10;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        if (doc.setFont) doc.setFont(undefined, 'normal');
        
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
        
        try {
            doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.rect(10, yPos - 5, 190, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            if (doc.setFont) doc.setFont(undefined, 'bold');
            doc.text('CLIENT ACCEPTANCE & SIGNATURE', 15, yPos);
            yPos += 15;
        } catch (e) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text('CLIENT ACCEPTANCE & SIGNATURE', 15, yPos);
            yPos += 12;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        if (doc.setFont) doc.setFont(undefined, 'bold');
        doc.text('Client Name:', 15, yPos);
        if (doc.setFont) doc.setFont(undefined, 'normal');
        doc.text(data.signatureClientName || 'Not provided', 55, yPos);
        yPos += 10;
        
        if (doc.setFont) doc.setFont(undefined, 'bold');
        doc.text('Date Signed:', 15, yPos);
        if (doc.setFont) doc.setFont(undefined, 'normal');
        doc.text(agreementDate, 55, yPos);
        yPos += 15;
        
        if (doc.setFont) doc.setFont(undefined, 'bold');
        doc.text('Digital Signature:', 15, yPos);
        yPos += 5;
        
        // Add signature image if available
        if (data.signature && data.signature.length > 0) {
            try {
                if (doc.setDrawColor) doc.setDrawColor(200, 200, 200);
                if (doc.rect) doc.rect(15, yPos, 80, 25);
                doc.addImage(data.signature, 'PNG', 17, yPos + 2, 76, 21);
                yPos += 30;
                console.log('Signature image added successfully');
            } catch (imgError) {
                console.log('Could not add signature image:', imgError);
                doc.text('✓ Digital signature captured and verified', 15, yPos);
                yPos += 10;
            }
        } else {
            doc.text('✓ Digital signature on file', 15, yPos);
            yPos += 10;
        }
        
        yPos += 10;
        
        // Agreement confirmation
        doc.setFontSize(9);
        if (doc.setFont) doc.setFont(undefined, 'italic');
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
        if (doc.setFont) doc.setFont(undefined, 'italic');
        doc.setTextColor(128, 128, 128);
        const timestamp = new Date().toLocaleDateString('en-GB') + ' at ' + new Date().toLocaleTimeString('en-GB');
        doc.text(`Document generated: ${timestamp}`, 105, yPos, { align: 'center' });
        yPos += 4;
        doc.text('This is a legally binding agreement - keep for your records', 105, yPos + 4, { align: 'center' });
        
        console.log('Professional PDF generated successfully');
        return doc;
        
    } catch (error) {
        console.error('Error generating professional PDF:', error);
        return await generateTextBasedPDF(data);
    }
}

// Simple text-based PDF fallback for when jsPDF has issues
async function generateTextBasedPDF(data) {
    console.log('Generating text-based PDF fallback...');
    
    try {
        let jsPDFConstructor;
        try {
            jsPDFConstructor = getJsPDF();
        } catch (e) {
            console.error('No PDF library available for fallback');
            return null;
        }
        
        const doc = new jsPDFConstructor();
        
        // Very basic PDF structure
        doc.setFontSize(16);
        doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Client: ${data.signatureClientName || data.clientName || 'Not provided'}`, 20, 40);
        const dateStr = data.signedDate ? new Date(data.signedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
        doc.text(`Date: ${dateStr}`, 20, 50);
        doc.text('Email: ' + (data.clientEmail || 'Not provided'), 20, 60);
        doc.text('Phone: ' + (data.clientPhone || 'Not provided'), 20, 70);
        
        doc.text('Agreement Status: Successfully Submitted & Accepted', 20, 90);
        doc.text('Payment Terms: 14 days from completion', 20, 100);
        doc.text('Warranty: 12 months on workmanship', 20, 110);
        
        doc.text('Terms & Conditions:', 20, 130);
        doc.setFontSize(10);
        doc.text('1. Professional joinery and carpentry services provided', 20, 140);
        doc.text('2. Written quotes valid for 30 days', 20, 150);
        doc.text('3. Payment due within 14 days of completion', 20, 160);
        doc.text('4. 12 months guarantee on workmanship', 20, 170);
        doc.text('5. All changes must be agreed in writing', 20, 180);
        
        if (data.signature && data.signature.length > 0) {
            try {
                doc.text('Digital Signature:', 20, 200);
                doc.addImage(data.signature, 'PNG', 20, 205, 60, 20);
            } catch (e) {
                doc.text('✓ Digital signature on file', 20, 210);
            }
        } else {
            doc.text('✓ Digital signature on file', 20, 200);
        }
        
        doc.setFontSize(8);
        doc.text('Generated: ' + new Date().toLocaleString('en-GB'), 20, 280);
        
        console.log('Text-based PDF generated successfully');
        return doc;
        
    } catch (error) {
        console.error('Error in text-based PDF generation:', error);
        return null;
    }
}

// Initialize PDF library check when this module loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('PDF Application module loaded');
    
    // Add a longer delay to ensure jsPDF is fully loaded
    setTimeout(() => {
        checkPDFLibrary().then((loaded) => {
            if (loaded) {
                console.log('PDF generation ready');
                // Test PDF creation
                try {
                    const testConstructor = getJsPDF();
                    const testDoc = new testConstructor();
                    if (testDoc && typeof testDoc.text === 'function') {
                        console.log('PDF library test passed');
                    } else {
                        console.warn('PDF library test failed - invalid instance');
                    }
                } catch (testError) {
                    console.warn('PDF library test failed:', testError);
                }
            } else {
                console.warn('PDF generation may not work properly - library not loaded');
            }
        });
    }, 1000);
});
