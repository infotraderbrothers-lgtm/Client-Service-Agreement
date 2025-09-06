// Global variables
window.agreementPDF = null;
window.agreementData = null;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page
function initializePage() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('agreement-date').value = today;
    
    // Add event listeners for form validation
    const nameField = document.getElementById('client-name');
    if (nameField) {
        nameField.addEventListener('input', checkFormCompletion);
    }
}

// Check if form is complete and enable/disable review button
function checkFormCompletion() {
    const nameField = document.getElementById('client-name');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!nameField || !reviewBtn) return;
    
    const name = nameField.value.trim();
    
    // Check if we have a name and a signature
    if (name && hasSignature) {
        reviewBtn.disabled = false;
        reviewBtn.classList.add('glow');
    } else {
        reviewBtn.disabled = true;
        reviewBtn.classList.remove('glow');
    }
}

// Show specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Initialize signature pad if showing agreement section
    if (sectionId === 'agreement-section') {
        setTimeout(initializeSignaturePad, 100);
    }
}

// Show review section with populated data
function showReview() {
    // Get form values
    const name = document.getElementById('client-name')?.value || '';
    const date = document.getElementById('agreement-date')?.value || '';
    
    // Update review display
    const reviewNameEl = document.getElementById('review-name');
    const reviewDateEl = document.getElementById('review-date');
    
    if (reviewNameEl) {
        reviewNameEl.textContent = name || 'Not provided';
    }
    if (reviewDateEl) {
        reviewDateEl.textContent = date ? new Date(date).toLocaleDateString('en-GB') : 'Not provided';
    }
    
    // Display signature preview
    const signaturePreview = document.getElementById('signature-preview');
    if (signaturePreview) {
        if (signatureData) {
            signaturePreview.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 80px;" alt="Digital Signature">`;
        } else {
            signaturePreview.innerHTML = '<em>Signature will appear here</em>';
        }
    }
    
    showSection('review-section');
}

// Download agreement PDF
function downloadAgreement() {
    try {
        if (window.agreementPDF && window.agreementData) {
            const clientName = window.agreementData.signatureClientName || window.agreementData.clientName || 'Client';
            const filename = `TraderBrothers_Agreement_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            window.agreementPDF.save(filename);
        } else {
            // Generate a basic PDF if none exists
            const { jsPDF } = window.jsPDF;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Trader Brothers - Professional Services Agreement', 20, 20);
            doc.setFontSize(12);
            doc.text('Agreement successfully submitted', 20, 40);
            doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 50);
            doc.text('Please contact us for a complete copy of your agreement.', 20, 60);
            doc.save('TraderBrothers_Agreement.pdf');
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Unable to download PDF. Please contact us at [Business Email] for a copy of your agreement.');
    }
}

// Helper function for safe element retrieval
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// Initialize when page loads (fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
