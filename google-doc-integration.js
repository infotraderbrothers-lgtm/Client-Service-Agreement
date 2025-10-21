// google-docs-integration.js - Add Google Docs webhook to existing flow
// Add this to your existing acceptAgreement function in script.js

/**
 * INTEGRATION INSTRUCTIONS:
 * 
 * In your script.js, modify the acceptAgreement function to include this call
 * after form validation and before or after PDF/HTML generation:
 * 
 * Add this line after "if (!validateFormData(formData))" check:
 * 
 *     // Send to Make.com for Google Docs
 *     await sendToGoogleDocsWebhook(formData);
 */

/**
 * Send data to Make.com webhook for Google Docs population
 * @param {Object} formData - Form data from gatherFormData()
 */
async function sendToGoogleDocsWebhook(formData) {
    try {
        console.log('Sending data to Make.com for Google Docs...');
        
        if (window.GoogleDocsWebhook && typeof window.GoogleDocsWebhook.sendToMake === 'function') {
            const result = await window.GoogleDocsWebhook.sendToMake(formData);
            
            if (result && result.success) {
                console.log('✓ Data sent to Make.com successfully');
                return result;
            } else {
                console.warn('⚠ Make.com returned unexpected result:', result);
                return result;
            }
        } else {
            console.warn('⚠ Google Docs webhook module not loaded - skipping');
            return { success: false, message: 'Module not loaded' };
        }
        
    } catch (error) {
        console.error('✗ Error sending to Make.com:', error);
        // Don't throw - allow the process to continue even if this fails
        return { success: false, error: error.message };
    }
}

/**
 * COMPLETE MODIFIED acceptAgreement FUNCTION
 * Replace your existing acceptAgreement function with this:
 */
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
    acceptBtn.style.cursor = 'not-allowed';

    try {
        // Gather and validate form data
        const formData = gatherFormData();
        
        if (!validateFormData(formData)) {
            throw new Error('Form validation failed');
        }

        console.log('Form data prepared for webhook submission');

        // ===== NEW: Send to Make.com for Google Docs =====
        console.log('Sending data to Make.com for Google Docs population...');
        await sendToGoogleDocsWebhook(formData);

        // ===== Generate PDF for email =====
        console.log('Generating PDF binary file for webhook upload...');
        let pdfData = null;
        
        try {
            if (window.PDFGenerator && typeof window.PDFGenerator.generateWithViewLink === 'function') {
                pdfData = await window.PDFGenerator.generateWithViewLink(formData);
                if (pdfData && pdfData.blob) {
                    console.log('PDF generated successfully for binary file upload');
                    console.log('PDF filename:', pdfData.filename);
                    console.log('PDF file size:', Math.round(pdfData.blob.size / 1024), 'KB');
                } else {
                    throw new Error('PDF generation returned invalid data');
                }
            } else {
                throw new Error('PDF generation not available');
            }
        } catch (pdfError) {
            console.error('PDF generation failed:', pdfError);
            throw new Error('Failed to generate PDF: ' + pdfError.message);
        }
        
        // ===== Generate HTML for email =====
        console.log('Generating HTML binary file for webhook upload...');
        let htmlData = null;
        
        try {
            if (window.HTMLGenerator && typeof window.HTMLGenerator.generateWithBlob === 'function') {
                htmlData = await window.HTMLGenerator.generateWithBlob(formData);
                if (htmlData && htmlData.blob && htmlData.success) {
                    console.log('HTML generated successfully for binary file upload');
                    console.log('HTML filename:', htmlData.filename);
                    console.log('HTML file size:', Math.round(htmlData.blob.size / 1024), 'KB');
                } else {
                    throw new Error('HTML generation returned invalid data');
                }
            } else {
                throw new Error('HTML generation not available');
            }
        } catch (htmlError) {
            console.error('HTML generation failed:', htmlError);
            throw new Error('Failed to generate HTML: ' + htmlError.message);
        }
        
        // Send both PDF and HTML files to email webhook
        console.log('Uploading PDF and HTML files to webhook for processing...');
        await sendFilesToWebhook(pdfData.blob, htmlData.blob, clientData, formData);
        
        console.log('Agreement, PDF, and HTML files successfully submitted to webhook');
        
        // Show success popup
        showSuccessPopup();
        
        // Redirect to thank you page
        setTimeout(() => {
            showSection('thankyou-section');
        }, 2000);

    } catch (error) {
        console.error('Error in agreement submission:', error);
        
        let errorMessage = 'There was an error submitting your agreement. Please try again or contact us directly.';
        
        if (error.message.includes('validation failed')) {
            return;
        } else if (error.name === 'AbortError') {
            errorMessage = 'Upload timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('PDF generation')) {
            errorMessage = 'Unable to generate your agreement PDF. Please try again or contact support.';
        } else if (error.message.includes('HTML generation')) {
            errorMessage = 'Unable to generate your agreement HTML. Please try again or contact support.';
        } else if (error.message.includes('webhook')) {
            errorMessage = 'Unable to process your agreement at this time. Please try again in a moment or contact support.';
        }
        
        alert(errorMessage + '\n\nError details: ' + error.message);
        
    } finally {
        // Reset button state
        acceptBtn.textContent = originalText;
        acceptBtn.disabled = false;
        acceptBtn.style.opacity = '1';
        acceptBtn.style.cursor = 'pointer';
    }
}

// Make function available globally
if (typeof window !== 'undefined') {
    window.sendToGoogleDocsWebhook = sendToGoogleDocsWebhook;
}
