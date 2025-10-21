// Complete PDF Application Module for Service Agreement System
// Updated to match the new professional HTML template design
// Optimized for Make.com integration with clean, minimal styling

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

// Enhanced PDF generation matching the professional HTML template
async function generatePDF(data) {
    try {
        console.log('Starting professional PDF generation...');
        
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
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = 25;
        
        // Professional color scheme (matching new template)
        const black = [17, 17, 17];           // #111111
        const darkGray = [51, 51, 51];        // #333333
        const textGray = [34, 34, 34];        // #222222
        const lightGray = [102, 102, 102];    // #666666
        const gold = [188, 156, 34];          // #bc9c22
        const lightBg = [250, 250, 250];      // #fafafa
        const green = [76, 175, 80];          // #4CAF50
        
        // Helper function to add text with proper formatting
        function addText(text, fontSize = 11, fontStyle = 'normal', color = textGray, indent = 0) {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', fontStyle);
            doc.setTextColor(color[0], color[1], color[2]);
            
            const splitText = doc.splitTextToSize(text, contentWidth - indent);
            const lineHeight = fontSize * 0.35;
            const textHeight = splitText.length * lineHeight;
            
            // Check for page break
            if (yPosition + textHeight > pageHeight - 25) {
                doc.addPage();
                yPosition = 25;
            }
            
            doc.text(splitText, margin + indent, yPosition);
            yPosition += textHeight + 3;
            
            return yPosition;
        }
        
        // Professional header (matching HTML template)
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Logo placeholder circle
        doc.setFillColor(black[0], black[1], black[2]);
        doc.circle(margin + 10, 15, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('LOGO', margin + 10, 16, { align: 'center' });
        
        // Company name and tagline
        doc.setTextColor(black[0], black[1], black[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('TRADER BROTHERS', margin + 25, 13);
        
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Professional Joinery Services & Bespoke Craftsmanship', margin + 25, 19);
        
        // Gold accent line
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(1.5);
        doc.line(margin, 30, pageWidth - margin, 30);
        
        yPosition = 45;
        
        // Document title (centered)
        doc.setTextColor(black[0], black[1], black[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SERVICES AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 12;
        
        // Company Information section
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(black[0], black[1], black[2]);
        doc.text('Trader Brothers Company Information', margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('Trader Brothers Ltd', margin, yPosition);
        yPosition += 5;
        doc.text('Registration: [Company Registration Number]', margin, yPosition);
        yPosition += 5;
        doc.text('VAT Number: [VAT Registration Number]', margin, yPosition);
        yPosition += 5;
        doc.text('Address: [Business Address]', margin, yPosition);
        yPosition += 5;
        doc.text('Email: [Business Email]', margin, yPosition);
        yPosition += 5;
        doc.text('Phone: [Business Phone]', margin, yPosition);
        yPosition += 10;
        
        // All contract sections (matching HTML exactly)
        const sections = [
            {
                title: '1. What We Do',
                content: 'We provide professional joinery and carpentry services including bespoke furniture, fitted wardrobes, kitchen and bathroom fitting, commercial fit-outs, and general carpentry work. All work follows building regulations and industry standards.'
            },
            {
                title: '2. Quotes and Pricing',
                content: 'Our written quotes are valid for 30 days. Prices include VAT unless stated otherwise. If you want changes to the original plan, we\'ll discuss costs before starting any extra work.'
            },
            {
                title: '3. Payment',
                content: 'Payment is due within 14 days of completion unless we agree otherwise. For larger jobs over £3,000, we may ask for progress payments as work is completed.'
            },
            {
                title: '4. Materials and Quality',
                content: 'We use quality materials suitable for the job. We guarantee our workmanship for 12 months from completion. If something goes wrong due to our work, we\'ll fix it at no cost to you.'
            },
            {
                title: '5. Access and Site Preparation',
                content: 'You\'ll provide reasonable access to the work area and a safe working environment. If delays happen due to site access or preparation issues, we may need to charge extra time at our standard rates.'
            },
            {
                title: '6. Changes and Extras',
                content: 'Any changes to the original job must be agreed in writing. We\'ll give you a written estimate for extra work before proceeding.'
            },
            {
                title: '7. Insurance and Safety',
                content: 'We carry full public liability insurance and follow all health and safety requirements. We\'ll work safely and keep disruption to a minimum.'
            },
            {
                title: '8. Unforeseen Circumstances',
                content: 'Sometimes things happen beyond our control (like material shortages, bad weather, or finding unexpected problems). We\'ll keep you informed and work together to find solutions.'
            },
            {
                title: '9. Disputes',
                content: 'If we have any disagreements, we\'ll try to sort them out by talking first. This agreement is governed by English law.'
            }
        ];
        
        // Add all sections with clean styling
        sections.forEach((section, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 35) {
                doc.addPage();
                yPosition = 25;
            }
            
            // Section title
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(black[0], black[1], black[2]);
            doc.text(section.title, margin, yPosition);
            yPosition += 6;
            
            // Section content
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textGray[0], textGray[1], textGray[2]);
            const splitContent = doc.splitTextToSize(section.content, contentWidth);
            doc.text(splitContent, margin, yPosition);
            yPosition += (splitContent.length * 5) + 6;
        });
        
        // Client Information & Digital Signature section
        if (yPosition > pageHeight - 90) {
            doc.addPage();
            yPosition = 25;
        }
        
        // Light background box for signature section
        const signatureBoxHeight = 75;
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.roundedRect(margin, yPosition, contentWidth, signatureBoxHeight, 3, 3, 'F');
        
        // Border
        doc.setDrawColor(238, 238, 238);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPosition, contentWidth, signatureBoxHeight, 3, 3, 'S');
        
        yPosition += 6;
        
        // Section title
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.text('Client Information & Digital Signature', margin + 4, yPosition);
        yPosition += 7;
        
        // Client details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(black[0], black[1], black[2]);
        
        const clientInfo = [
            { label: 'Name:', value: data.signatureClientName || 'Not provided' },
            { label: 'Email:', value: data.clientEmail || 'Not provided' },
            { label: 'Phone:', value: data.clientPhone || 'Not provided' },
            { label: 'Address:', value: data.clientAddress || 'Not provided' },
            { label: 'Postcode:', value: data.clientPostcode || 'Not provided' },
            { 
                label: 'Date Signed:', 
                value: new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }
        ];
        
        clientInfo.forEach(info => {
            doc.setFont('helvetica', 'bold');
            doc.text(info.label, margin + 4, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(info.value, margin + 30, yPosition);
            yPosition += 5;
        });
        
        yPosition += 3;
        
        // Add signature with enhanced error handling
        if (data.signature) {
            try {
                // White signature box
                doc.setFillColor(255, 255, 255);
                doc.setDrawColor(224, 224, 224);
                doc.setLineWidth(0.5);
                doc.roundedRect(margin + 4, yPosition, 70, 20, 2, 2, 'FD');
                
                // Add signature image
                doc.addImage(data.signature, 'PNG', margin + 6, yPosition + 2, 66, 16);
                
                console.log('Digital signature added to PDF');
            } catch (signatureError) {
                console.warn('Could not add signature image:', signatureError);
                
                // Fallback
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(margin + 4, yPosition, 70, 20, 2, 2, 'FD');
                doc.setTextColor(green[0], green[1], green[2]);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('✓ Digital Signature Verified', margin + 8, yPosition + 12);
            }
        } else {
            // No signature box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(224, 224, 224);
            doc.roundedRect(margin + 4, yPosition, 70, 20, 2, 2, 'FD');
            doc.setTextColor(255, 87, 34);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text('No signature provided', margin + 8, yPosition + 12);
        }
        
        // Green signed badge
        yPosition += 25;
        doc.setFillColor(green[0], green[1], green[2]);
        doc.roundedRect(margin, yPosition, contentWidth, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const signedText = `✓ Digitally Signed Agreement — ${new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        doc.text(signedText, pageWidth / 2, yPosition + 6.5, { align: 'center' });
        
        yPosition += 15;
        
        // Document metadata footer
        if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 25;
        }
        
        doc.setFillColor(249, 249, 249);
        doc.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'F');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        const metaText1 = `This is an official signed agreement between ${data.signatureClientName || 'Client'} and Trader Brothers Ltd`;
        doc.text(metaText1, pageWidth / 2, yPosition + 5, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        const timestamp = new Date(data.submissionTimestamp || Date.now()).toLocaleString('en-GB');
        const metaText2 = `Document generated: ${timestamp} | Agreement Type: ${data.agreementType || 'Professional Services Agreement'}`;
        doc.text(metaText2, pageWidth / 2, yPosition + 10, { align: 'center' });
        
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
        console.log('Starting professional PDF generation with viewable link...');
        
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
        const sanitizedName = clientName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
        const dateString = new Date().toISOString().split('T')[0];
        const filename = `TraderBrothers_Agreement_${sanitizedName}_${dateString}`;
        
        const result = {
            pdf: pdf,
            base64: base64Data,
            viewableLink: viewableLink,
            blob: pdfBlob,
            filename: filename,
            fileSize: pdfBlob.size,
            generatedAt: new Date().toISOString()
        };
        
        console.log('Professional PDF generation completed successfully');
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
        const clientName = data.signatureClientName.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_');
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
console.log('PDF Application Module loaded successfully - Professional template design');
