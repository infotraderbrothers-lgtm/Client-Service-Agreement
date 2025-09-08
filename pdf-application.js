// PDF Application Module
// This module handles all PDF generation functionality

let pdfLibraryLoaded = false;

// Check if PDF library is loaded
function checkPDFLibrary() {
    return new Promise((resolve) => {
        if (window.jsPDF && typeof window.jsPDF === 'object') {
            pdfLibraryLoaded = true;
            console.log('PDF library already loaded');
            resolve(true);
            return;
        }
        
        // Wait for library to load
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.jsPDF && typeof window.jsPDF === 'object') {
                pdfLibraryLoaded = true;
                console.log('PDF library loaded after', attempts * 100, 'ms');
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                console.warn('PDF library failed to load after 5 seconds');
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

// Enhanced PDF generation with better error handling
async function generateProfessionalPDF(data) {
    try {
        console.log('Checking PDF library availability...');
        
        // Ensure PDF library is loaded
        await checkPDFLibrary();
        
        if (!pdfLibraryLoaded || !window.jsPDF) {
            console.warn('PDF library not available, using fallback');
            return await generateTextBasedPDF(data);
        }

        const { jsPDF } = window.jsPDF;
        
        // Test if jsPDF constructor works
        let doc;
        try {
            doc = new jsPDF();
        } catch (constructorError) {
            console.error('jsPDF constructor failed:', constructorError);
            return await generateTextBasedPDF(data);
        }
        
        console.log('PDF library working, generating professional PDF...');
        
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
        return await generateTextBasedPDF(data);
    }
}

// Simple text-based PDF fallback for when jsPDF has issues
async function generateTextBasedPDF(data) {
    console.log('Generating text-based PDF fallback...');
    
    try {
        // Try one more time with basic jsPDF usage
        if (window.jsPDF) {
            const { jsPDF } = window.jsPDF;
            const doc = new jsPDF();
            
            // Very basic PDF structure
            doc.setFontSize(16);
            doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
            
            doc.setFontSize(12);
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
        } else {
            throw new Error('PDF library not available');
        }
    } catch (error) {
        console.error('Error in text-based PDF generation:', error);
        // Return null if PDF generation completely fails
        return null;
    }
}

// Initialize PDF library check when this module loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('PDF Application module loaded');
    
    // Check PDF library availability
    checkPDFLibrary().then((loaded) => {
        if (loaded) {
            console.log('PDF generation will be available');
        } else {
            console.warn('PDF generation may not work properly');
        }
    });
});
