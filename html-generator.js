// HTML Agreement Generator
// Generates a professional standalone HTML version of the signed agreement

window.HTMLGenerator = (function() {
    'use strict';

    console.log('HTML Agreement Generator module loading...');

    // Generate professional standalone HTML document
    function generateStandaloneHTML(formData) {
        console.log('Generating professional HTML agreement...');

        try {
            // Format the signed date properly
            const signedDate = new Date(formData.signedDate || Date.now());
            const formattedDate = signedDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Build the complete HTML document with professional styling
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Trader Brothers — Professional Services Agreement</title>
  <style>
    :root {
      --black:#111111;
      --white:#ffffff;
      --gold:#bc9c22;
      --page-width:800px;
      --body-font:'Segoe UI', Roboto, Arial, sans-serif;
    }

    html,body {height:100%;margin:0;background:#f6f6f6;font-family:var(--body-font);color:var(--black);}
    .page {width:100%;display:flex;justify-content:center;padding:30px 0;}
    .sheet {background:var(--white);width:calc(var(--page-width));box-shadow:0 10px 30px rgba(0,0,0,0.08);border-radius:8px;padding:36px;box-sizing:border-box;}

    /* Header */
    .header {display:flex;align-items:center;gap:18px;border-bottom:6px solid rgba(188,156,34,0.08);padding-bottom:18px;margin-bottom:22px;}
    .logo-placeholder {
      width:96px;height:96px;
      background:linear-gradient(180deg,var(--black),#333);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:var(--white);font-weight:700;font-size:14px;
    }
    .brand {display:flex;flex-direction:column;}
    .brand .name {font-size:20px;font-weight:800;letter-spacing:1px;}
    .brand .tag {font-size:12px;color:#666;margin-top:4px;}

    /* Title */
    .title {margin-top:8px;margin-bottom:20px;text-align:center;}
    .title h1 {margin:0;font-size:18px;letter-spacing:0.6px;}

    /* Section layout */
    .section {margin-bottom:16px;}
    h3 {margin:0 0 8px 0;font-size:14px;color:var(--black);}
    p, li {font-size:13px;line-height:1.45;color:#222;margin:0;}
    ul {margin:8px 0 0 18px;padding:0;}

    /* Signature section */
    .signatures {margin-top:26px;}
    .sign-box {padding:18px;border-radius:8px;background:linear-gradient(180deg,#fafafa,#fff);border:1px solid #eee;}
    .sign-label {font-size:12px;color:#555;font-weight:600;margin-bottom:12px;}
    .sign-data {font-size:13px;color:#222;margin:8px 0;}
    .signature-image {
      margin:16px 0;
      padding:12px;
      background:var(--white);
      border:2px solid #e0e0e0;
      border-radius:6px;
      text-align:center;
      min-height:80px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .signature-image img {
      max-width:100%;
      max-height:100px;
      display:block;
    }
    .signed-badge {
      background:linear-gradient(135deg, #4CAF50, #45a049);
      color:var(--white);
      padding:12px 20px;
      border-radius:6px;
      text-align:center;
      font-weight:600;
      font-size:13px;
      margin-top:16px;
      box-shadow:0 4px 12px rgba(76,175,80,0.25);
    }

    /* Print */
    @media print {
      body {background:var(--white);}
      .page {padding:0;}
      .sheet {box-shadow:none;border-radius:0;}
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="sheet">

      <div class="header">
        <div class="logo-placeholder">LOGO</div>
        <div class="brand">
          <div class="name">TRADER BROTHERS</div>
          <div class="tag">Professional Joinery Services & Bespoke Craftsmanship</div>
        </div>
      </div>

      <div class="title">
        <h1>PROFESSIONAL SERVICES AGREEMENT</h1>
      </div>

      <div class="section">
        <h3>Trader Brothers Company Information</h3>
        <p><strong>Trader Brothers Ltd</strong><br>
        Registration: [Company Registration Number]<br>
        VAT Number: [VAT Registration Number]<br>
        Address: [Business Address]<br>
        Email: [Business Email]<br>
        Phone: [Business Phone]</p>
      </div>

      <div class="section">
        <h3>1. What We Do</h3>
        <p>We provide professional joinery and carpentry services including bespoke furniture, fitted wardrobes, kitchen and bathroom fitting, commercial fit-outs, and general carpentry work. All work follows building regulations and industry standards.</p>
      </div>

      <div class="section">
        <h3>2. Quotes and Pricing</h3>
        <p>Our written quotes are valid for 30 days. Prices include VAT unless stated otherwise. If you want changes to the original plan, we'll discuss costs before starting any extra work.</p>
      </div>

      <div class="section">
        <h3>3. Payment</h3>
        <p>Payment is due within 14 days of completion unless we agree otherwise. For larger jobs over £3,000, we may ask for progress payments as work is completed.</p>
      </div>

      <div class="section">
        <h3>4. Materials and Quality</h3>
        <p>We use quality materials suitable for the job. We guarantee our workmanship for 12 months from completion. If something goes wrong due to our work, we'll fix it at no cost to you.</p>
      </div>

      <div class="section">
        <h3>5. Access and Site Preparation</h3>
        <p>You'll provide reasonable access to the work area and a safe working environment. If delays happen due to site access or preparation issues, we may need to charge extra time at our standard rates.</p>
      </div>

      <div class="section">
        <h3>6. Changes and Extras</h3>
        <p>Any changes to the original job must be agreed in writing. We'll give you a written estimate for extra work before proceeding.</p>
      </div>

      <div class="section">
        <h3>7. Insurance and Safety</h3>
        <p>We carry full public liability insurance and follow all health and safety requirements. We'll work safely and keep disruption to a minimum.</p>
      </div>

      <div class="section">
        <h3>8. Unforeseen Circumstances</h3>
        <p>Sometimes things happen beyond our control (like material shortages, bad weather, or finding unexpected problems). We'll keep you informed and work together to find solutions.</p>
      </div>

      <div class="section">
        <h3>9. Disputes</h3>
        <p>If we have any disagreements, we'll try to sort them out by talking first. This agreement is governed by English law.</p>
      </div>

      <div class="signatures">
        <div class="sign-box">
          <div class="sign-label">Client Information & Digital Signature</div>
          
          <div class="sign-data"><strong>Name:</strong> ${formData.signatureClientName || 'Not provided'}</div>
          <div class="sign-data"><strong>Email:</strong> ${formData.clientEmail || 'Not provided'}</div>
          <div class="sign-data"><strong>Phone:</strong> ${formData.clientPhone || 'Not provided'}</div>
          <div class="sign-data"><strong>Address:</strong> ${formData.clientAddress || 'Not provided'}</div>
          <div class="sign-data"><strong>Postcode:</strong> ${formData.clientPostcode || 'Not provided'}</div>
          <div class="sign-data"><strong>Date Signed:</strong> ${formattedDate}</div>
          
          ${formData.signature ? `
          <div class="signature-image">
            <img src="${formData.signature}" alt="Client Digital Signature">
          </div>
          ` : `
          <div class="signature-image">
            <em style="color:#999;">No signature provided</em>
          </div>
          `}
          
          <div class="signed-badge">
            ✓ Digitally Signed Agreement — ${formattedDate}
          </div>
        </div>
      </div>

      <div style="margin-top:26px;padding:16px;background:#f9f9f9;border-radius:6px;text-align:center;font-size:11px;color:#666;">
        <p style="margin:0;"><strong>This is an official signed agreement between ${formData.signatureClientName || 'Client'} and Trader Brothers Ltd</strong></p>
        <p style="margin:6px 0 0 0;">Document generated: ${new Date(formData.submissionTimestamp || Date.now()).toLocaleString('en-GB')} | Agreement Type: ${formData.agreementType || 'Professional Services Agreement'}</p>
      </div>

    </div>
  </div>
</body>
</html>`;

            console.log('Professional HTML document generated successfully');
            return htmlContent;

        } catch (error) {
            console.error('Error generating HTML:', error);
            throw error;
        }
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
            console.log('Starting professional HTML generation with blob...');

            // Generate the HTML content
            const htmlContent = generateStandaloneHTML(formData);

            // Create blob
            const blob = createHTMLBlob(htmlContent);

            // Generate filename
            const filename = generateFilename(formData.signatureClientName);

            console.log('Professional HTML blob created:', filename, 'Size:', Math.round(blob.size / 1024), 'KB');

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
