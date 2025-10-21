// HTML Agreement Generator
// Generates a standalone HTML version of the signed agreement

window.HTMLGenerator = (function() {
    'use strict';

    console.log('HTML Agreement Generator module loading...');

    // Generate standalone HTML document with all agreement content
    function generateStandaloneHTML(formData) {
        console.log('Generating standalone HTML agreement...');

        try {
            // Get the CSS content (inline it into the HTML)
            const cssContent = getCSSContent();

            // Build the complete HTML document
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trader Brothers - Service Agreement - ${formData.signatureClientName}</title>
    <style>
        ${cssContent}
        /* Additional styles for static document */
        body {
            padding: 20px;
        }
        .navigation, .btn, button, .signature-controls {
            display: none !important;
        }
        .section {
            display: block !important;
        }
        #about-section, #review-section, #thankyou-section {
            display: none !important;
        }
        #agreement-section {
            display: block !important;
        }
        .signature-pad {
            display: none !important;
        }
        .signature-display {
            background: white;
            border: 2px solid #d0d0d0;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            text-align: center;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .signature-display img {
            max-width: 100%;
            max-height: 100px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .form-group input {
            border: none !important;
            background: transparent !important;
            font-weight: bold;
            padding: 5px 0 !important;
            pointer-events: none;
        }
        .signature-section {
            page-break-inside: avoid;
        }
        @media print {
            body {
                background: white;
            }
            .container {
                max-width: 100%;
            }
        }
        /* Watermark style for official document */
        .document-status {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TR<span class="gold-a">A</span>DER BROTHERS</div>
            <div class="tagline">Professional Joinery Services & Bespoke Craftsmanship</div>
        </div>

        <div class="main-content">
            <div class="document-status">
                ✓ SIGNED AGREEMENT - Generated on ${new Date(formData.signedDate).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                })}
            </div>

            <div id="agreement-section" class="section active">
                <h1>Professional Services Agreement</h1>
                
                <div class="contract-section">
                    <h3>Trader Brothers Company Information</h3>
                    <p><strong>Trader Brothers Ltd</strong><br>
                    <strong>Registration:</strong> [Company Registration Number]<br>
                    <strong>VAT Number:</strong> [VAT Registration Number]<br>
                    <strong>Address:</strong> [Business Address]<br>
                    <strong>Email:</strong> [Business Email]<br>
                    <strong>Phone:</strong> [Business Phone]</p>
                </div>

                <div class="contract-section">
                    <h3>Client Information</h3>
                    <p><strong>${formData.signatureClientName}</strong><br>
                    <strong>Email:</strong> ${formData.clientEmail}<br>
                    <strong>Phone:</strong> ${formData.clientPhone}<br>
                    <strong>Address:</strong> ${formData.clientAddress}<br>
                    <strong>Postcode:</strong> ${formData.clientPostcode}</p>
                </div>

                <div class="contract-section">
                    <h3>1. What We Do</h3>
                    <p>We provide professional joinery and carpentry services including bespoke furniture, fitted wardrobes, kitchen and bathroom fitting, commercial fit-outs, and general carpentry work. All work follows building regulations and industry standards.</p>
                </div>

                <div class="contract-section">
                    <h3>2. Quotes and Pricing</h3>
                    <p>Our written quotes are valid for 30 days. Prices include VAT unless stated otherwise. If you want changes to the original plan, we'll discuss costs before starting any extra work.</p>
                </div>

                <div class="contract-section">
                    <h3>3. Payment</h3>
                    <p>Payment is due within 14 days of completion unless we agree otherwise. For larger jobs over £3,000, we may ask for progress payments as work is completed.</p>
                </div>

                <div class="contract-section">
                    <h3>4. Materials and Quality</h3>
                    <p>We use quality materials suitable for the job. We guarantee our workmanship for 12 months from completion. If something goes wrong due to our work, we'll fix it at no cost to you.</p>
                </div>

                <div class="contract-section">
                    <h3>5. Access and Site Preparation</h3>
                    <p>You'll provide reasonable access to the work area and a safe working environment. If delays happen due to site access or preparation issues, we may need to charge extra time at our standard rates.</p>
                </div>

                <div class="contract-section">
                    <h3>6. Changes and Extras</h3>
                    <p>Any changes to the original job must be agreed in writing. We'll give you a written estimate for extra work before proceeding.</p>
                </div>

                <div class="contract-section">
                    <h3>7. Insurance and Safety</h3>
                    <p>We carry full public liability insurance and follow all health and safety requirements. We'll work safely and keep disruption to a minimum.</p>
                </div>

                <div class="contract-section">
                    <h3>8. Unforeseen Circumstances</h3>
                    <p>Sometimes things happen beyond our control (like material shortages, bad weather, or finding unexpected problems). We'll keep you informed and work together to find solutions.</p>
                </div>

                <div class="contract-section">
                    <h3>9. Disputes</h3>
                    <p>If we have any disagreements, we'll try to sort them out by talking first. This agreement is governed by English law.</p>
                </div>

                <div class="signature-section">
                    <h2 style="color: white;">Client Signature</h2>
                    
                    <div class="form-group">
                        <label for="client-name">Full Name:</label>
                        <input type="text" id="client-name" value="${formData.signatureClientName}" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="agreement-date">Date Signed:</label>
                        <input type="text" id="agreement-date" value="${new Date(formData.signedDate).toLocaleDateString('en-GB')}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Digital Signature:</label>
                        <div class="signature-display">
                            <img src="${formData.signature}" alt="Client Signature">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background: rgba(188, 156, 34, 0.1); border-radius: 10px;">
            <p style="margin: 0; color: #2d2d2d; font-size: 14px;">
                <strong>This is an official signed agreement between ${formData.signatureClientName} and Trader Brothers Ltd</strong><br>
                Document generated: ${new Date(formData.submissionTimestamp).toLocaleString('en-GB')}<br>
                Agreement Type: ${formData.agreementType}
            </p>
        </div>
    </div>
</body>
</html>`;

            console.log('HTML document generated successfully');
            return htmlContent;

        } catch (error) {
            console.error('Error generating HTML:', error);
            throw error;
        }
    }

    // Get CSS content from the page's stylesheet
    function getCSSContent() {
        try {
            // Try to get CSS from linked stylesheet
            const styleSheets = document.styleSheets;
            let cssText = '';

            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const sheet = styleSheets[i];
                    // Only get CSS from our styles.css file
                    if (sheet.href && sheet.href.includes('styles.css')) {
                        const rules = sheet.cssRules || sheet.rules;
                        for (let j = 0; j < rules.length; j++) {
                            cssText += rules[j].cssText + '\n';
                        }
                    }
                } catch (e) {
                    console.warn('Could not access stylesheet:', e);
                }
            }

            // Fallback: if we couldn't get the CSS, include basic styling
            if (!cssText) {
                console.warn('Using fallback CSS');
                cssText = getFallbackCSS();
            }

            return cssText;

        } catch (error) {
            console.error('Error extracting CSS:', error);
            return getFallbackCSS();
        }
    }

    // Fallback CSS with essential styling
    function getFallbackCSS() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #2d2d2d;
                background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 25px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .gold-a {
                color: #bc9c22;
            }
            .tagline {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            .main-content {
                background: rgba(255, 255, 255, 0.98);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #1a1a1a;
                margin-bottom: 20px;
                font-size: 2.2rem;
                text-align: center;
            }
            h2 {
                color: white;
                margin-bottom: 15px;
            }
            h3 {
                color: #2d2d2d;
                margin-bottom: 12px;
                font-size: 1.2rem;
            }
            .contract-section {
                background: #ffffff;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
                border-left: 5px solid #bc9c22;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            .signature-section {
                background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                color: white;
                padding: 30px;
                border-radius: 20px;
                margin-top: 25px;
            }
            .form-group {
                margin-bottom: 18px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
            }
            input {
                width: 100%;
                padding: 12px;
                border-radius: 10px;
                font-size: 16px;
            }
        `;
    }

    // Create HTML file blob
    function createHTMLBlob(htmlContent) {
        return new Blob([htmlContent], { type: 'text/html' });
    }

    // Generate filename
    function generateFilename(clientName) {
        const cleanName = clientName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
        const dateString = new Date().toISOString().split('T')[0];
        return `TraderBrothers_Agreement_${cleanName}_${dateString}.html`;
    }

    // Main generation function with blob return
    async function generateWithBlob(formData) {
        try {
            console.log('Starting HTML generation with blob...');

            // Generate the HTML content
            const htmlContent = generateStandaloneHTML(formData);

            // Create blob
            const blob = createHTMLBlob(htmlContent);

            // Generate filename
            const filename = generateFilename(formData.signatureClientName);

            console.log('HTML blob created:', filename, 'Size:', Math.round(blob.size / 1024), 'KB');

            return {
                blob: blob,
                filename: filename,
                success: true
            };

        } catch (error) {
            console.error('Error in HTML generation:', error);
            return {
                blob: null,
                filename: null,
                success: false,
                error: error.message
            };
        }
    }

    // Optional: Generate and download locally (for testing)
    async function generateAndDownload(formData) {
        try {
            const result = await generateWithBlob(formData);
            
            if (!result.success) {
                throw new Error('HTML generation failed');
            }

            // Create download link
            const url = URL.createObjectURL(result.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('HTML file downloaded successfully');
            return true;

        } catch (error) {
            console.error('Error downloading HTML:', error);
            return false;
        }
    }

    // Check if module is ready
    function checkLibrary() {
        console.log('HTML Generator module ready');
        return Promise.resolve(true);
    }

    // Public API
    const api = {
        generateWithBlob: generateWithBlob,
        generateAndDownload: generateAndDownload,
        checkLibrary: checkLibrary
    };

    console.log('HTML Agreement Generator module loaded successfully');
    return api;

})();

// Verify module loaded
if (window.HTMLGenerator) {
    console.log('✓ HTML Agreement Generator available globally');
} else {
    console.error('✗ HTML Agreement Generator failed to initialize');
}
