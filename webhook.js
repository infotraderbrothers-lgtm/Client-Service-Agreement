// Make.com webhook configuration
const WEBHOOK_URL = 'https://hook.eu2.make.com/b1xehsayp5nr7qtt7cybsgd19rmcqj2t';

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
        
        // Show thank you page
        showSection('thankyou-section');

    } catch (error) {
        console.error('Error submitting agreement:', error);
        alert('There was an error submitting your agreement. Please try again or contact us directly.');
        acceptBtn.textContent = 'Accept Agreement';
        acceptBtn.disabled = false;
    }
}

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
