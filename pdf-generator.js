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
    doc.text(`Client: ${data.signatureClientName}`, 20, 40);
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
