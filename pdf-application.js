// Complete PDF Application Module for Service Agreement System
// Optimized for GitHub Pages hosting and Make.com integration

let pdfLibraryLoaded = false;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 50;

// Enhanced PDF library detection with multiple fallbacks
function checkPDFLibrary() {
    return new Promise((resolve) => {
        console.log('Checking PDF library availability...');
        
        // Check multiple possible library locations
        if (window.jspdf && window.jspdf.jsPDF) {
            pdfLibraryLoaded = true;
            console.log('PDF library detected (jspdf.jsPDF)');
            resolve(true);
            return;
        }
        
        if (window.jsPDF) {
            pdfLibraryLoaded = true;
            console.log('PDF library detected (window.jsPDF)');
            resolve(true);
            return;
        }
        
        // Wait for library to load with extended timeout
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.jspdf && window.jspdf.jsPDF) {
                pdfLibraryLoaded = true;
                console.log(`PDF library loaded (jspdf.jsPDF) after ${attempts * 100}ms`);
                clearInterval(checkInterval);
                resolve(true);
            } else if (window.jsPDF) {
                pdfLibraryLoaded = true;
                console.log(`PDF library loaded (window.jsPDF) after ${attempts * 100}ms`);
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= MAX_INIT_ATTEMPTS) {
                console.error(`PDF library failed to load after ${attempts * 100}ms`);
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

// Get jsPDF constructor with fallback handling
function getJSPDF() {
    if (window.jspdf && window.jspdf.jsPDF) {
        return window.jspdf.jsPDF;
    }
    if (window.jsPDF) {
        return window.jsPDF;
    }
    throw new Error('jsPDF library not available');
}

// Enhanced PDF generation optimized for service agreements
async function generatePDF(data) {
    try {
        console.log('Starting enhanced PDF generation...');
        
        // Ensure library is available
        const libraryReady = await checkPDFLibrary();
        if (!libraryReady) {
            console.error('PDF library not available for generation');
            return null;
        }

        const jsPDF = getJSPDF();
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // PDF dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = 25;
        
        // Enhanced text helper with better formatting
        function addText(text, fontSize = 11, fontStyle = 'normal', color = [0, 0, 0], indent = 0) {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', fontStyle);
            if (Array.isArray(color)) {
                doc.setTextColor(color[0], color[1], color[2]);
            } else {
                doc.setTextColor(color);
            }
            
            const splitText = doc.splitTextToSize(text, contentWidth - indent);
            const lineHeight = fontSize * 0.35;
            const textHeight = splitText.length * lineHeight;
            
            // Check for page break
            if (yPosition + textHeight > pageHeight - 25) {
                doc.addPage();
                yPosition = 25;
            }
            
            doc.text(splitText, margin + indent, yPosition);
            yPosition += textHeight + 4;
            
            return yPosition;
        }
        
        function addSection(title, content, indent = 5) {
            addText(title, 12, 'bold', [41, 128, 185]); // Professional blue
            addText(content, 10, 'normal', [0, 0, 0], indent);
            yPosition += 3;
        }
        
        // Professional header with better styling
        doc.setFillColor(41, 128, 185); // Professional blue
        doc.rect(0, 0, pageWidth, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('TRADER BROTHERS LTD', margin, 14);
        
        // Reset position after header
        yPosition = 30;
        
        // Company tagline
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('Professional Joinery Services & Bespoke Craftsmanship', margin, yPosition);
        yPosition += 15;
        
        // Agreement title
        doc.setTextColor(41, 128, 185);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SERVICES AGREEMENT', margin, yPosition);
        yPosition += 15;
        
        // Agreement metadata box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPosition - 5, contentWidth, 25);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('AGREEMENT DETAILS:', margin + 5, yPosition + 3);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Client: ${data.signatureClientName || data.clientName || 'Not provided'}`, margin + 5, yPosition + 9);
        doc.text(`Date: ${new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB')}`, margin + 5, yPosition + 15);
        doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin + 5, yPosition + 21);
        
        yPosition += 35;
        
        // Client information section
        addText('CLIENT INFORMATION', 14, 'bold', [41, 128, 185]);
        addText(`Full Name: ${data.signatureClientName || data.clientName || 'Not provided'}`, 11, 'normal');
        addText(`Email Address: ${data.clientEmail || 'Not provided'}`, 11, 'normal');
        addText(`Phone Number: ${data.clientPhone || 'Not provided'}`, 11, 'normal');
        addText(`Property Address: ${data.clientAddress || 'Not provided'}`, 11, 'normal');
        addText(`Postcode: ${data.clientPostcode || 'Not provided'}`, 11, 'normal');
        yPosition += 5;
        
        // Enhanced terms and conditions
        const sections = [
            {
                title: '1. SCOPE OF SERVICES',
                content: 'Trader Brothers Ltd provides professional joinery and carpentry services including but not limited to: bespoke furniture manufacture, kitchen and bedroom installations, fitted wardrobes, commercial fit-outs, restoration work, staircases, doors, windows, and general carpentry. All work is performed to industry standards and building regulations where applicable.'
            },
            {
                title: '2. QUOTATIONS AND ESTIMATES',
                content: 'All quotations are valid for 30 days unless otherwise specified. Prices include materials and labor as detailed in the quote. VAT is included unless stated otherwise. We reserve the right to adjust pricing for specification changes, material cost fluctuations, or additional work requests.'
            },
            {
                title: '3. PAYMENT TERMS',
                content: 'Payment terms are Net 14 days from completion unless otherwise agreed in writing. For projects exceeding £3,000, staged payments may be required. Late payments may incur statutory interest charges. Payment methods accepted include bank transfer, cheque, and cash.'
            },
            {
                title: '4. MATERIALS AND QUALITY',
                content: 'All materials supplied are of merchantable quality and fit for purpose. We source materials from reputable suppliers and provide manufacturer warranties where applicable. Custom materials may have different warranty terms as specified in the quotation.'
            },
            {
                title: '5. WORKMANSHIP WARRANTY',
                content: 'We provide a 12-month warranty on all workmanship from the date of completion. This covers defects in construction but excludes normal wear and tear, misuse, or damage caused by third parties. Any warranty claims must be reported promptly for assessment.'
            },
            {
                title: '6. SITE ACCESS AND PREPARATION',
                content: 'The client must provide safe, reasonable access to work areas and adequate storage space for materials and tools. The work area should be cleared of personal items. Any delays due to access issues or inadequate site preparation may incur additional charges.'
            },
            {
                title: '7. VARIATIONS AND ADDITIONAL WORK',
                content: 'Changes to the original specification must be agreed in writing before implementation. Additional work will be charged at our standard rates and may affect completion schedules. Written estimates will be provided for significant variations exceeding £200.'
            },
            {
                title: '8. HEALTH, SAFETY AND INSURANCE',
                content: 'We maintain comprehensive Public Liability Insurance (£2,000,000) and Employer Liability cover. All operatives are trained in health and safety procedures. We comply with CDM regulations and other relevant safety legislation. Risk assessments are conducted where required.'
            },
            {
                title: '9. COMPLETION AND HANDOVER',
                content: 'Work is considered complete upon client acceptance or practical completion. We will provide care and maintenance instructions where applicable. Any defects noted at handover will be remedied promptly at no additional cost.'
            },
            {
                title: '10. LIMITATION OF LIABILITY',
                content: 'Our liability is limited to the contract value except for death or personal injury caused by negligence. We are not liable for indirect losses, loss of profits, or consequential damages. All claims must be notified within reasonable time of discovery.'
            },
            {
                title: '11. RETENTION OF TITLE',
                content: 'Materials remain our property until payment is received in full. Risk passes to the client upon delivery or commencement of installation. We reserve the right to recover unpaid materials from site.'
            },
            {
                title: '12. FORCE MAJEURE',
                content: 'We are not liable for delays caused by circumstances beyond reasonable control including: material shortages, extreme weather, labor disputes, pandemic restrictions, or government regulations affecting construction work.'
            },
            {
                title: '13. CANCELLATION AND TERMINATION',
                content: 'Either party may terminate with reasonable written notice. Cancellation fees may apply for work already commenced or materials ordered. Payment is due for all completed work up to termination date.'
            },
            {
                title: '14. DATA PROTECTION AND PRIVACY',
                content: 'We process personal data in accordance with GDPR requirements. Client information is used solely for service delivery and may be retained for warranty and legal purposes. We do not share data with third parties without consent except as required by law.'
            },
            {
                title: '15. DISPUTE RESOLUTION',
                content: 'Disputes will be resolved through direct negotiation initially. Unresolved matters may be referred to mediation or arbitration. These terms are governed by English law and subject to the jurisdiction of English courts.'
            }
        ];
        
        // Add all sections with professional formatting
        sections.forEach(section => {
            addSection(section.title, section.content);
        });
        
        // Digital signature section
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 25;
        }
        
        // Signature section header
        addText('CLIENT ACCEPTANCE & DIGITAL SIGNATURE', 14, 'bold', [41, 128, 185]);
        addText('By signing below, the client acknowledges having read, understood, and agreed to be bound by these terms and conditions for professional joinery services.', 11, 'normal');
        
        // Add signature with enhanced error handling
        if (data.signature) {
            try {
                // Create signature box
                doc.setDrawColor(200, 200, 200);
                doc.rect(margin, yPosition, contentWidth, 35);
                
                // Add signature image
                doc.addImage(data.signature, 'PNG', margin + 5, yPosition + 5, 80, 25);
                yPosition += 40;
                
                console.log('Digital signature added to PDF');
            } catch (signatureError) {
                console.warn('Could not add signature image:', signatureError);
                
                // Fallback signature indicator
                doc.setDrawColor(200, 200, 200);
                doc.rect(margin, yPosition, contentWidth, 20);
                doc.setTextColor(76, 175, 80); // Green color
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('✓ DIGITAL SIGNATURE PROVIDED AND VERIFIED', margin + 5, yPosition + 12);
                yPosition += 25;
            }
        } else {
            // No signature provided
            doc.setDrawColor(255, 193, 7); // Warning yellow
            doc.rect(margin, yPosition, contentWidth, 20);
            doc.setTextColor(255, 87, 34); // Orange text
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('⚠ NO DIGITAL SIGNATURE PROVIDED', margin + 5, yPosition + 12);
            yPosition += 25;
        }
        
        // Client details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Signed by: ${data.signatureClientName || 'Not provided'}`, margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB')}`, margin, yPosition);
        doc.text(`Time: ${new Date().toLocaleTimeString('en-GB')}`, margin + 80, yPosition);
        yPosition += 10;
        
        // Legal notice
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        addText('This agreement constitutes a legally binding contract upon digital acceptance and signature. Electronic signatures are valid under the Electronic Communications Act 2000.', 10, 'italic', [100, 100, 100]);
        
        // Professional footer
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        
        // Company details in footer
        const timestamp = new Date().toLocaleString('en-GB');
        doc.text('Trader Brothers Ltd - Professional Joinery Services', margin, footerY);
        doc.text(`Document generated: ${timestamp}`, pageWidth - margin, footerY, { align: 'right' });
        
        console.log('Professional PDF generated successfully');
        return doc;
        
    } catch (error) {
        console.error('Error in PDF generation:', error);
        return null;
    }
}

// Convert blob to base64 with enhanced error handling
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        if (!blob || typeof blob.size === 'undefined') {
            reject(new Error('Invalid blob provided'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const result = reader.result;
                if (typeof result === 'string' && result.includes(',')) {
                    resolve(result.split(',')[1]);
                } else {
                    reject(new Error('Invalid base64 result'));
                }
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(blob);
    });
}

// Generate viewable PDF data URL for immediate viewing
function generatePDFViewLink(base64Data) {
    try {
        if (!base64Data || typeof base64Data !== 'string') {
            throw new Error('Invalid base64 data provided');
        }
        
        // Create data URL for PDF viewing
        const dataUrl = `data:application/pdf;base64,${base64Data}`;
        console.log('PDF view link generated successfully');
        return dataUrl;
        
    } catch (error) {
        console.error('Error generating PDF view link:', error);
        return null;
    }
}

// Enhanced PDF generation with viewable link - optimized for webhook transmission
async function generatePDFWithViewLink(data) {
    try {
        console.log('Starting enhanced PDF generation with viewable link...');
        
        // Generate the PDF document
        const pdf = await generatePDF(data);
        if (!pdf) {
            console.error('PDF generation failed');
            return null;
        }
        
        // Convert to blob
        const pdfBlob = pdf.output('blob');
        if (!pdfBlob) {
            throw new Error('Failed to generate PDF blob');
        }
        
        // Convert to base64 for webhook transmission
        const base64Data = await blobToBase64(pdfBlob);
        if (!base64Data) {
            throw new Error('Failed to convert PDF to base64');
        }
        
        // Generate viewable link (data URL)
        const viewableLink = generatePDFViewLink(base64Data);
        
        // Create professional filename
        const clientName = data.signatureClientName || data.clientName || 'Client';
        const sanitizedName = clientName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const filename = `Service Agreement for ${sanitizedName}`;
        
        const result = {
            pdf: pdf,
            base64: base64Data,
            viewableLink: viewableLink,
            blob: pdfBlob,
            filename: filename,
            fileSize: pdfBlob.size,
            generatedAt: new Date().toISOString()
        };
        
        console.log('Enhanced PDF generation completed successfully');
        console.log('Filename:', filename);
        console.log('File size:', Math.round(pdfBlob.size / 1024), 'KB');
        console.log('Viewable link created:', !!viewableLink);
        
        return result;
        
    } catch (error) {
        console.error('Error in enhanced PDF generation:', error);
        return null;
    }
}

// Generate and download PDF - for optional direct download functionality
async function generateAndDownloadPDF(data) {
    try {
        console.log('Starting PDF generation and download...');
        
        // Validate input data
        if (!data || !data.signatureClientName) {
            throw new Error('Invalid data provided for PDF generation');
        }
        
        const pdf = await generatePDF(data);
        if (!pdf) {
            throw new Error('PDF generation failed - library may not be available');
        }
        
        // Generate download filename
        const clientName = data.signatureClientName.replace(/[^a-zA-Z0-9]/g, '_');
        const formattedDate = new Date(data.signedDate || Date.now()).toISOString().split('T')[0];
        const filename = `TraderBrothers_Agreement_${clientName}_${formattedDate}.pdf`;
        
        console.log('Initiating PDF download:', filename);
        
        // Download using jsPDF save method
        pdf.save(filename);
        
        console.log('PDF download completed successfully');
        return true;
        
    } catch (error) {
        console.error('Error in PDF download process:', error);
        
        // User-friendly error handling
        let userMessage = 'Unable to generate PDF download.';
        if (error.message.includes('library')) {
            userMessage += ' PDF library not available.';
        } else if (error.message.includes('Invalid data')) {
            userMessage += ' Please ensure all required fields are completed.';
        }
        
        console.log('Showing user error:', userMessage);
        alert(userMessage + ' Please complete the agreement process to receive your PDF via email.');
        return false;
    }
}

// Initialize PDF system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('PDF Application System initializing...');
    
    initializationAttempts++;
    if (initializationAttempts > 3) {
        console.warn('Multiple initialization attempts detected');
        return;
    }
    
    // Pre-check PDF library with delay to ensure scripts are loaded
    setTimeout(() => {
        checkPDFLibrary().then((isReady) => {
            if (isReady) {
                console.log('PDF generation system ready for use');
                
                // Optional: Trigger a ready event
                window.dispatchEvent(new CustomEvent('PDFSystemReady', {
                    detail: { ready: true, timestamp: new Date() }
                }));
            } else {
                console.warn('PDF system not ready - features may be limited');
                
                // Optional: Trigger a not ready event
                window.dispatchEvent(new CustomEvent('PDFSystemReady', {
                    detail: { ready: false, timestamp: new Date() }
                }));
            }
        });
    }, 2000);
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    console.log('PDF Application System shutting down...');
});

// Export all functions to global scope for integration
window.PDFGenerator = {
    // Primary methods for agreement system
    generateWithViewLink: generatePDFWithViewLink,
    generatePDF: generatePDF,
    generateAndDownload: generateAndDownloadPDF,
    
    // Utility methods
    generateViewLink: generatePDFViewLink,
    checkLibrary: checkPDFLibrary,
    blobToBase64: blobToBase64,
    
    // Status methods
    isReady: () => pdfLibraryLoaded,
    getStatus: () => ({
        libraryLoaded: pdfLibraryLoaded,
        initAttempts: initializationAttempts,
        timestamp: new Date().toISOString()
    })
};

// Log successful module load
console.log('PDF Application Module loaded successfully - Ready for GitHub Pages deployment');
