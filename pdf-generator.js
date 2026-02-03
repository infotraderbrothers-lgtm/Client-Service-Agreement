// PDF Generator for Service Agreement
// Uses PDFShift API to convert HTML to PDF

const PDFSHIFT_API_KEY = 'sk_b620db3746ace840fc2030d7ff07e49153afbde0';
const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf';

async function handlePDFDownload() {
    try {
        console.log('Initiating PDF download...');
        
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.textContent = 'Generating PDF...';
            downloadBtn.disabled = true;
        }

        const pdfBlob = await generateContractPDF();
        
        const filename = `Trader_Brothers_Agreement_${clientData.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
        downloadPDF(pdfBlob, filename);
        
        if (downloadBtn) {
            downloadBtn.textContent = '📄 Download Agreement PDF';
            downloadBtn.disabled = false;
        }

        console.log('PDF downloaded successfully');
        
    } catch (error) {
        console.error('Error in PDF download process:', error);
        alert('There was an error generating your PDF. Please try again or contact support.\n\nError: ' + error.message);
        
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.textContent = '📄 Download Agreement PDF';
            downloadBtn.disabled = false;
        }
    }
}

async function generateContractPDF() {
    try {
        console.log('Starting PDF generation with PDFShift...');
        
        const optimizedSignature = await optimizeSignatureForPDF();
        console.log('Signature optimization complete');
        
        const htmlContent = generatePDFContent(optimizedSignature);
        console.log('HTML content generated, length:', htmlContent.length, 'characters');
        
        const requestBody = {
            source: htmlContent,
            sandbox: false,
            landscape: false,
            use_print: false
        };

        console.log('Sending request to PDFShift...');
        const response = await fetch(PDFSHIFT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('api:' + PDFSHIFT_API_KEY)
            },
            body: JSON.stringify(requestBody)
        });

        console.log('PDFShift response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('PDFShift error response:', errorText);
            let errorData = {};
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText };
            }
            throw new Error(`PDFShift API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('PDF received, size:', arrayBuffer.byteLength, 'bytes');
        
        if (arrayBuffer.byteLength < 1000) {
            console.warn('Warning: PDF file size is very small, may be corrupted');
            throw new Error('Received invalid PDF data (file too small)');
        }
        
        const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
        console.log('PDF blob created successfully');
        
        return pdfBlob;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

async function optimizeSignatureForPDF() {
    try {
        console.log('Optimizing signature image for PDF...');
        
        if (!signatureData) {
            throw new Error('No signature data available');
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                const optimizedCanvas = document.createElement('canvas');
                optimizedCanvas.width = 400;
                optimizedCanvas.height = 100;
                const ctx = optimizedCanvas.getContext('2d');
                
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, optimizedCanvas.width, optimizedCanvas.height);
                
                const aspectRatio = img.width / img.height;
                let drawWidth = optimizedCanvas.width - 20;
                let drawHeight = drawWidth / aspectRatio;
                
                if (drawHeight > optimizedCanvas.height - 20) {
                    drawHeight = optimizedCanvas.height - 20;
                    drawWidth = drawHeight * aspectRatio;
                }
                
                const x = (optimizedCanvas.width - drawWidth) / 2;
                const y = (optimizedCanvas.height - drawHeight) / 2;
                
                ctx.drawImage(img, x, y, drawWidth, drawHeight);
                
                const optimizedData = optimizedCanvas.toDataURL('image/png', 0.9);
                console.log('Signature optimized, original size:', signatureData.length, 'optimized size:', optimizedData.length);
                resolve(optimizedData);
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load signature image'));
            };
            
            img.src = signatureData;
        });
        
    } catch (error) {
        console.error('Error optimizing signature:', error);
        return signatureData;
    }
}

function generatePDFContent(optimizedSignatureData) {
    const signatureToUse = optimizedSignatureData || signatureData;
    const nameField = document.getElementById('client-name');
    const signedName = nameField ? nameField.value.trim() : clientData.name;
    const signedDate = document.getElementById('agreement-date')?.value || new Date().toISOString().split('T')[0];
    const formattedDate = new Date(signedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Get materials provision text for PDF
    const materialsProviderText = materialsProvisionData.provider === 'company' ? 'Trader Brothers will provide all materials' :
                                  materialsProvisionData.provider === 'client' ? 'Client will provide all materials' :
                                  materialsProvisionData.provider === 'split' ? 'Split - both parties will provide materials' :
                                  'Not specified';
    
    const materialsDetailsHTML = (materialsProvisionData.details && (materialsProvisionData.provider === 'client' || materialsProvisionData.provider === 'split')) ?
        `<div style="margin-top: 10px;">
            <p><strong>Details:</strong></p>
            <p class="highlight-yellow" style="white-space: pre-wrap;">${materialsProvisionData.details}</p>
        </div>` : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Professional Services Agreement - ${signedName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Georgia, serif; font-size: 10pt; line-height: 1.35; color: #1a1a1a; background: white; }
        .document { max-width: 210mm; margin: 0 auto; background: white; padding: 25px 30px; }
        .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 18px; margin-bottom: 25px; }
        .logo-container { display: flex; align-items: center; gap: 18px; margin-bottom: 12px; flex-wrap: wrap; justify-content: center; }
        .logo-circle { border: 3px solid #333; border-radius: 50%; padding: 8px; width: 85px; height: 85px; display: flex; align-items: center; justify-content: center; }
        .logo-circle img { width: 65px; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; }
        .header-text { text-align: center; flex: 1; min-width: 250px; }
        .header-text h1 { font-size: 16pt; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; }
        .tagline { font-size: 10pt; letter-spacing: 0.8px; color: #444; margin-top: 4px; }
        .parties { margin-bottom: 20px; padding: 15px; background: #fafafa; border-left: 3px solid #333; page-break-inside: avoid; }
        .parties h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.8px; color: #666; margin-bottom: 10px; }
        .contract-section { margin-bottom: 18px; page-break-inside: avoid; }
        .contract-section h3 { font-size: 11pt; font-weight: bold; color: #333; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        .contract-section h4 { font-weight: bold; margin: 10px 0 4px 0; color: #333; font-size: 10pt; }
        .contract-section p { margin: 6px 0; text-align: justify; }
        .signature-block { margin-top: 35px; padding-top: 20px; border-top: 2px solid #333; page-break-inside: avoid; }
        .signature-header { font-size: 12pt; font-weight: bold; text-align: center; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 0.8px; }
        .contractor-signatures { display: flex; justify-content: space-between; gap: 40px; margin-bottom: 25px; }
        .digital-sig-box { flex: 1; border: 1px solid #333; padding: 12px; background: #fff; }
        .sig-info-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 6px; }
        .sig-info-name { font-size: 12px; font-weight: bold; color: #222; margin-bottom: 3px; }
        .sig-info-position { font-size: 10px; color: #555; margin-bottom: 10px; }
        .sig-image-box { border: 1px solid #ccc; min-height: 50px; background: #fafafa; display: flex; align-items: center; justify-content: center; padding: 8px; }
        .sig-image-box img { max-width: 100%; max-height: 40px; height: auto; }
        .signature-section { margin-top: 25px; padding: 15px; background: #fafafa; border: 2px solid #333; border-radius: 4px; page-break-inside: avoid; }
        .signature-section h2 { font-size: 12pt; font-weight: bold; text-align: center; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.8px; color: #333; }
        .form-display { padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 10pt; background: white; min-height: 28px; margin: 6px 0 10px 0; }
        .signature-preview { background: white; border: 2px solid #333; border-radius: 4px; padding: 10px; margin: 8px 0; text-align: center; min-height: 80px; display: flex; align-items: center; justify-content: center; }
        .highlight-yellow { background: #fff3cd; padding: 2px 5px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 9pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        label { display: block; font-size: 8pt; color: #666; text-transform: uppercase; margin-bottom: 4px; margin-top: 10px; }
        @page { margin: 15mm; }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <div class="logo-container">
                <div class="logo-circle">
                    <img src="https://github.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/blob/main/Trader%20Brothers.png?raw=true" alt="Trader Brothers Logo">
                </div>
                <div class="header-text">
                    <h1>Professional Services Agreement</h1>
                    <div class="tagline">Professional Construction & Renovation Services</div>
                </div>
            </div>
        </div>

        <div class="parties">
            <h2>Trader Brothers Company Information</h2>
            <p><strong>Trader Brothers Ltd</strong><br>
            <strong>Registration:</strong> SC815790<br>
            <strong>Address:</strong> 8 Craigour Terrace<br>
            <strong>Email:</strong> traderbrotherslimited@gmail.com<br>
            <strong>Phone:</strong> 07931 810557</p>
        </div>

        <div class="parties">
            <h2>Client Information</h2>
            <p><strong><span class="highlight-yellow">${clientData.name}</span></strong><br>
            <strong>Email:</strong> <span class="highlight-yellow">${clientData.email}</span><br>
            <strong>Phone:</strong> <span class="highlight-yellow">${clientData.phone}</span><br>
            <strong>Address:</strong> <span class="highlight-yellow">${clientData.address}</span><br>
            <strong>Postcode:</strong> <span class="highlight-yellow">${clientData.postcode}</span></p>
        </div>

        <div class="contract-section">
            <h3>Scope of Work</h3>
            <div style="margin-bottom: 12px;">
                <h4>The Work To Be Done</h4>
                <p class="highlight-yellow">${scopeOfWorkData.workToBeDone}</p>
            </div>
            <div style="margin-bottom: 12px;">
                <h4>Materials and Supplies</h4>
                <p class="highlight-yellow">${scopeOfWorkData.materials}</p>
            </div>
            <div style="margin-bottom: 12px;">
                <h4>Cleanup</h4>
                <p class="highlight-yellow">${scopeOfWorkData.cleanup}</p>
            </div>
            <div style="margin-bottom: 12px;">
                <h4>What Is NOT Included (Exclusions)</h4>
                <p class="highlight-yellow">${scopeOfWorkData.exclusions}</p>
            </div>
            <div style="margin-bottom: 0;">
                <h4>Changes to the Job</h4>
                <p class="highlight-yellow">${scopeOfWorkData.changes}</p>
            </div>
        </div>

        <div class="contract-section">
            <h3>1. What We Do</h3>
            <p>We provide comprehensive construction and renovation services including new builds, extensions, complete renovations, interior design solutions, custom kitchen fitting, and luxurious bathroom remodels. All work follows building regulations and industry standards, delivering exceptional craftsmanship tailored to your vision and lifestyle.</p>
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
            <p>We use quality materials suitable for the job. We guarantee our workmanship for 12 months from completion. If something goes wrong due to our work, we'll fix it at no cost to you. Please note that any materials provided by the customer may not be subject to the 12-month guarantee/warranty unless specifically agreed upon in writing.</p>
        </div>

        <div class="contract-section">
            <h3>Materials Provision</h3>
            <p><strong>Materials Provided By:</strong> <span class="highlight-yellow">${materialsProviderText}</span></p>
            ${materialsDetailsHTML}
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

        <div class="signature-block">
            <div class="signature-header">Execution</div>
            <h4 style="font-size: 9pt; text-transform: uppercase; color: #555; margin-bottom: 15px; padding-bottom: 4px; border-bottom: 1px solid #ccc;">Signed on behalf of Trader Brothers</h4>
            <div class="contractor-signatures">
                <div class="digital-sig-box">
                    <div class="sig-info-label">Name</div>
                    <div class="sig-info-name">Olaf Sawczak</div>
                    <div class="sig-info-position">Director</div>
                    <div class="sig-info-label" style="margin-top: 10px;">Signature</div>
                    <div class="sig-image-box">
                        <img src="https://github.com/infotraderbrothers-lgtm/contract.signatures/blob/main/images/Olaf.png?raw=true" alt="Olaf Sawczak Signature">
                    </div>
                </div>
                <div class="digital-sig-box">
                    <div class="sig-info-label">Name</div>
                    <div class="sig-info-name">Milosz Sawczak</div>
                    <div class="sig-info-position">Manager</div>
                    <div class="sig-info-label" style="margin-top: 10px;">Signature</div>
                    <div class="sig-image-box">
                        <img src="https://github.com/infotraderbrothers-lgtm/contract.signatures/blob/main/images/Milosz.png?raw=true" alt="Milosz Sawczak Signature">
                    </div>
                </div>
            </div>
        </div>

        <div class="signature-section">
            <h2>Client Signature</h2>
            <label>Full Name:</label>
            <div class="form-display">${signedName}</div>
            <label>Date:</label>
            <div class="form-display">${formattedDate}</div>
            <label>Digital Signature:</label>
            <div class="signature-preview">
                <img src="${signatureToUse}" style="max-width: 100%; max-height: 70px;" alt="Client Signature">
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return htmlContent;
}

function downloadPDF(pdfBlob, filename) {
    try {
        console.log('Starting PDF download, blob size:', pdfBlob.size);
        
        if (!pdfBlob || pdfBlob.size === 0) {
            throw new Error('PDF blob is empty or invalid');
        }
        
        if (pdfBlob.type !== 'application/pdf') {
            console.warn('Blob type is not application/pdf, it is:', pdfBlob.type);
        }
        
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `Trader_Brothers_Agreement_${Date.now()}.pdf`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        
        console.log('Triggering download for:', link.download);
        
        setTimeout(() => {
            link.click();
            
            setTimeout(() => {
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
                window.URL.revokeObjectURL(url);
                console.log('PDF download cleanup complete');
            }, 250);
        }, 100);
        
    } catch (error) {
        console.error('Error in downloadPDF:', error);
        throw error;
    }
}
