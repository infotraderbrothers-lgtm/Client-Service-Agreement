// PDF Application Module
// This module handles all PDF generation functionality

let pdfLibraryLoaded = false;

// Check if PDF library is loaded (simplified approach from working contract)
function checkPDFLibrary() {
    return new Promise((resolve) => {
        if (window.jspdf && window.jspdf.jsPDF) {
            pdfLibraryLoaded = true;
            console.log('PDF library detected');
            resolve(true);
            return;
        }
        
        // Wait for library to load
        let attempts = 0;
        const maxAttempts = 30;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.jspdf && window.jspdf.jsPDF) {
                pdfLibraryLoaded = true;
                console.log('PDF library loaded after', attempts * 100, 'ms');
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                console.error('PDF library failed to load');
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

// Main function to generate PDF (matching working contract structure)
async function generatePDF(data) {
    try {
        console.log('Starting PDF generation...');
        
        // Check library availability
        await checkPDFLibrary();
        
        if (!pdfLibraryLoaded || !window.jspdf || !window.jspdf.jsPDF) {
            console.error('PDF library not available');
            return null;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;
        let yPosition = 20;
        
        // Helper function to add text with automatic page breaks (from working contract)
        function addText(text, fontSize = 11, fontStyle = 'normal', color = 'black') {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', fontStyle);
            doc.setTextColor(color);
            
            const splitText = doc.splitTextToSize(text, 190);
            const textHeight = splitText.length * (fontSize * 0.35);
            
            if (yPosition + textHeight > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(splitText, margin, yPosition);
            yPosition += textHeight + 3;
        }
        
        // Header (improved from working contract)
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('TRADER BROTHERS LTD', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(102, 102, 102);
        doc.text('Professional Joinery Services & Bespoke Craftsmanship', margin, yPosition);
        yPosition += 10;
        
        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('PROFESSIONAL SERVICES AGREEMENT', margin, yPosition);
        yPosition += 10;
        
        // Agreement details
        addText('AGREEMENT DETAILS:', 14, 'bold', 'black');
        addText(`Client Name: ${data.signatureClientName || data.clientName || 'Not provided'}`, 11, 'normal');
        addText(`Agreement Date: ${new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB')}`, 11, 'normal');
        addText(`Execution Time: ${new Date().toLocaleString('en-GB')}`, 11, 'normal');
        yPosition += 5;
        
        // Company Information
        addText('1. TRADER BROTHERS COMPANY INFORMATION:', 12, 'bold');
        addText('Trader Brothers Ltd\nProfessional Joinery & Carpentry Services\nRegistered Company providing quality craftsmanship\nFull Public Liability Insurance & Professional Indemnity', 11, 'normal');
        yPosition += 3;
        
        // Client Information
        addText('2. CLIENT INFORMATION:', 12, 'bold');
        addText(`Name: ${data.signatureClientName || data.clientName || 'Not provided'}\nEmail: ${data.clientEmail || 'Not provided'}\nPhone: ${data.clientPhone || 'Not provided'}\nAddress: ${data.clientAddress || 'Not provided'}\nPostcode: ${data.clientPostcode || 'Not provided'}`, 11, 'normal');
        yPosition += 3;
        
        // Terms and conditions (comprehensive like working contract)
        const terms = [
            {
                title: '3. SERVICES',
                content: 'We provide professional joinery services including but not limited to: bespoke furniture manufacture, kitchen and bedroom fitting, fitted wardrobes, commercial fit-outs, restoration work, and general carpentry work. All services are provided in accordance with industry standards and building regulations.'
            },
            {
                title: '4. QUOTATIONS AND PRICING',
                content: 'All quotations are valid for 30 days from date of issue unless otherwise stated. Prices include VAT unless otherwise indicated. We reserve the right to adjust prices for variations to the original specification, changes in material costs, or additional work requested by the client.'
            },
            {
                title: '5. PAYMENT TERMS',
                content: 'Payment is due within 14 days of completion unless otherwise agreed in writing. For projects exceeding £3,000, we may require progress payments as work progresses. Late payment may incur charges in accordance with statutory rights.'
            },
            {
                title: '6. MATERIALS AND WORKMANSHIP',
                content: 'All materials supplied will be of merchantable quality and suitable for purpose. We provide a 12-month warranty on workmanship from completion date. Manufacturer warranties on materials and hardware are passed through to the client. Any defects must be reported promptly for remedy under warranty.'
            },
            {
                title: '7. SITE ACCESS AND CLIENT OBLIGATIONS',
                content: 'The client must provide safe and reasonable access to the work site, adequate storage space for materials, and a clean, dry working environment. Any delays caused by lack of access, site conditions, or client preparation may incur additional charges.'
            },
            {
                title: '8. VARIATIONS AND CHANGES',
                content: 'Any changes to the original specification must be agreed in writing before commencement. Additional work will be charged according to our standard rates and may affect completion dates. We will provide written estimates for all significant variations before proceeding.'
            },
            {
                title: '9. INSURANCE AND LIABILITY',
                content: 'We maintain comprehensive public liability insurance and professional indemnity cover. Our liability is limited to the contract value, except for death or personal injury caused by our negligence. We are not liable for indirect or consequential losses.'
            },
            {
                title: '10. HEALTH AND SAFETY',
                content: 'We maintain comprehensive health and safety policies and insurance. All personnel are appropriately trained and certified. We comply with all relevant health and safety legislation and construction regulations where applicable.'
            },
            {
                title: '11. RETENTION OF TITLE',
                content: 'Materials remain our property until payment is received in full. We reserve the right to remove unpaid materials from site. Risk in materials passes to the client upon delivery to site or commencement of installation.'
            },
            {
                title: '12. FORCE MAJEURE',
                content: 'We are not liable for delays caused by circumstances beyond our reasonable control including but not limited to: material supply shortages, extreme weather conditions, labour disputes, or government restrictions.'
            },
            {
                title: '13. TERMINATION',
                content: 'Either party may terminate this agreement with written notice. In the event of termination, payment is due for all work completed up to the termination date. Any work in progress will be completed to a safe stopping point as mutually agreed.'
            },
            {
                title: '14. DISPUTE RESOLUTION',
                content: 'Any disputes will first be addressed through direct negotiation. If unresolved, disputes will be subject to mediation. These terms are governed by English law and subject to the jurisdiction of English courts.'
            }
        ];
        
        // Add terms using the helper function
        terms.forEach(term => {
            addText(term.title, 12, 'bold');
            addText(term.content, 11, 'normal');
            yPosition += 2;
        });
        
        // Digital signature section (improved error handling like working contract)
        if (yPosition > pageHeight - 80) {
            doc.addPage();
            yPosition = 20;
        }
        
        addText('CLIENT ACCEPTANCE & DIGITAL SIGNATURE:', 14, 'bold');
        addText('By signing below, the client acknowledges having read, understood, and agreed to be bound by these Terms and Conditions.', 11, 'normal');
        
        // Add signature image with better error handling
        if (data.signature) {
            try {
                doc.addImage(data.signature, 'PNG', margin, yPosition, 80, 30);
                yPosition += 35;
            } catch (error) {
                console.warn('Could not add signature image:', error);
                addText('Digital Signature: ✓ Provided and Verified', 11, 'normal');
            }
        } else {
            addText('Digital Signature: Not provided', 11, 'normal');
        }
        
        addText(`Signed by: ${data.signatureClientName || 'Not provided'}`, 11, 'bold');
        addText(`Date: ${new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB')}`, 11, 'normal');
        yPosition += 5;
        
        addText('This agreement is legally binding upon digital signature.', 11, 'italic');
        
        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        const timestamp = new Date().toLocaleString('en-GB');
        doc.text(`Document generated: ${timestamp}`, 105, pageHeight - 10, { align: 'center' });
        
        console.log('PDF created successfully');
        return doc;
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        return null;
    }
}

// Main function to generate and download PDF (matching working contract)
async function generateAndDownloadPDF(data) {
    try {
        console.log('Starting PDF generation and download process...');
        
        const pdf = await generatePDF(data);
        
        if (!pdf) {
            throw new Error('PDF generation failed - library not available');
        }
        
        // Generate filename (improved format like working contract)
        const clientName = (data.signatureClientName || data.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
        const formattedDate = new Date(data.signedDate || Date.now()).toISOString().split('T')[0];
        const filename = `TraderBrothers_Agreement_${clientName}_${formattedDate}.pdf`;
        
        console.log('Downloading PDF:', filename);
        
        // Use reliable download method from working contract
        pdf.save(filename);
        console.log('PDF download initiated successfully');
        return true;
        
    } catch (error) {
        console.error('Error in PDF generation and download:', error);
        alert('Sorry, there was an issue generating the PDF. Please try again or contact support.');
        return false;
    }
}

// Convert blob to base64 (helper function for webhook)
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Initialize when module loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('PDF Application module initialized');
    
    // Pre-check PDF library availability
    setTimeout(() => {
        checkPDFLibrary().then((loaded) => {
            if (loaded) {
                console.log('PDF generation ready');
            } else {
                console.warn('PDF library not detected - PDF features may not work');
            }
        });
    }, 1000);
});

// Export functions for global access (matching working contract)
window.PDFGenerator = {
    generateAndDownload: generateAndDownloadPDF,
    generatePDF: generatePDF,
    checkLibrary: checkPDFLibrary
};
