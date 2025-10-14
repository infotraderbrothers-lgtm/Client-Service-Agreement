// Complete PDF Application Module for Service Agreement System
// Optimized for GitHub Pages hosting and Make.com integration
// Updated to match exact agreement page design with Trader Brothers colors

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

// Enhanced PDF generation matching the agreement page design exactly
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
        
        // Trader Brothers brand colors (matching styles.css)
        const darkGray = [45, 45, 45];      // #2d2d2d
        const darkerGray = [26, 26, 26];    // #1a1a1a
        const gold = [188, 156, 34];        // #bc9c22
        const lightGold = [212, 175, 55];   // #d4af37
        const textGray = [61, 61, 61];      // #3d3d3d
        const lightBg = [250, 246, 232];    // #faf6e8
        
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
        
        // Professional header with Trader Brothers branding (matching the HTML header)
        doc.setFillColor(darkerGray[0], darkerGray[1], darkerGray[2]);
        doc.rect(0, 0, pageWidth, 22, 'F');
        
        // Company name in white
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TRADER BROTHERS', pageWidth / 2, 12, { align: 'center' });
        
        // Tagline
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(255, 255, 255);
        doc.text('Professional Joinery Services & Bespoke Craftsmanship', pageWidth / 2, 18, { align: 'center' });
        
        // Reset position after header
        yPosition = 35;
        
        // Agreement title (matching the HTML h1 style)
        doc.setTextColor(darkerGray[0], darkerGray[1], darkerGray[2]);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Services Agreement', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Company information section (matching contract-section style with gold border)
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(1.5);
        doc.line(margin, yPosition - 3, margin, yPosition + 25);
        
        doc.setFillColor(255, 255, 255);
        doc.rect(margin + 2, yPosition - 5, contentWidth - 2, 28, 'F');
        
        doc.setTextColor(darkerGray[0], darkerGray[1], darkerGray[2]);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Trader Brothers Company Information', margin + 5, yPosition + 2);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('Trader Brothers Ltd', margin + 5, yPosition + 9);
        doc.text('Registration: [Company Registration Number]', margin + 5, yPosition + 14);
        doc.text('VAT Number: [VAT Registration Number]', margin + 5, yPosition + 19);
        
        yPosition += 35;
        
        // Client Name, Date, and Signature section (replacing client details)
        // This section has the gold accent box styling
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(1.5);
        doc.line(margin, yPosition - 3, margin, yPosition + 60);
        
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(margin + 2, yPosition - 5, contentWidth - 2, 63, 'F');
        
        doc.setTextColor(darkerGray[0], darkerGray[1], darkerGray[2]);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Client Details & Digital Signature', margin + 5, yPosition + 2);
        
        // Client name
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('Full Name:', margin + 5, yPosition + 12);
        doc.setFont('helvetica', 'normal');
        doc.text(data.signatureClientName || data.clientName || 'Not provided', margin + 28, yPosition + 12);
        
        // Date
        doc.setFont('helvetica', 'bold');
        doc.text('Date:', margin + 5, yPosition + 20);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(data.signedDate || Date.now()).toLocaleDateString('en-GB'), margin + 18, yPosition + 20);
        
        // Digital Signature label
        doc.setFont('helvetica', 'bold');
        doc.text('Digital Signature:', margin + 5, yPosition + 28);
        
        // Add signature with enhanced error handling
        if (data.signature) {
            try {
                // Create signature box with white background (matching signature pad)
                doc.setFillColor(255, 255, 255);
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.rect(margin + 5, yPosition + 30, 80, 25, 'FD');
                
                // Add signature image
                doc.addImage(data.signature, 'PNG', margin + 7, yPosition + 32, 76, 21);
                
                console.log('Digital signature added to PDF');
            } catch (signatureError) {
                console.warn('Could not add signature image:', signatureError);
                
                // Fallback signature indicator
                doc.setFillColor(255, 255, 255);
                doc.rect(margin + 5, yPosition + 30, 80, 25, 'F');
                doc.setTextColor(76, 175, 80);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('✓ Digital Signature Verified', margin + 10, yPosition + 43);
            }
        } else {
            // No signature box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(200, 200, 200);
            doc.rect(margin + 5, yPosition + 30, 80, 25, 'FD');
            doc.setTextColor(255, 87, 34);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text('No signature provided', margin + 10, yPosition + 43);
        }
        
        yPosition += 70;
        
        // All contract sections matching the HTML exactly
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
        
        // Add all sections with styling matching contract-section class
        sections.forEach(section => {
            // Check if we need a new page
            if (yPosition > pageHeight - 45) {
                doc.addPage();
                yPosition = 25;
            }
            
            // Gold left border (matching border-left: 5px solid #bc9c22)
            doc.setDrawColor(gold[0], gold[1], gold[2]);
            doc.setLineWidth(1.5);
            doc.line(margin, yPosition - 2, margin, yPosition + 28);
            
            // White background box
            doc.setFillColor(255, 255, 255);
            doc.rect(margin + 2, yPosition - 3, contentWidth - 2, 30, 'F');
            
            // Section title (h3 style)
            doc.setTextColor(darkerGray[0], darkerGray[1], darkerGray[2]);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(section.title, margin + 5, yPosition + 3);
            
            // Section content
            doc.setTextColor(textGray[0], textGray[1], textGray[2]);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const splitContent = doc.splitTextToSize(section.content, contentWidth - 12);
            doc.text(splitContent, margin + 5, yPosition + 10);
            
            yPosition += 35;
        });
        
        // Legal acceptance text at bottom
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 25;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const legalText = 'By signing above, the client acknowledges having read, understood, and agreed to be bound by these terms and conditions for professional joinery services. This agreement constitutes a legally binding contract upon digital acceptance.';
        const splitLegal = doc.splitTextToSize(legalText, contentWidth);
        doc.text(splitLegal, margin, yPosition);
        
        // Professional footer (matching the design)
        const footerY = pageHeight - 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        
        const timestamp = new Date().toLocaleString('en-GB');
        doc.text('Trader Brothers Ltd - Professional Joinery Services', margin, footerY);
        doc.text(`Generated: ${timestamp}`, pageWidth - margin, footerY, { align: 'right' });
        
        console.log('Professional PDF generated successfully with Trader Brothers branding');
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
        const filename = `TraderBrothers_Agreement_${sanitizedName}`;
        
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
console.log('PDF Application Module loaded successfully - Ready for GitHub Pages deployment with Trader Brothers branding');
