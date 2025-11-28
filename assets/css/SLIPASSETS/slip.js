// --- 1. Helper function to convert amount to words (Filipino currency context) ---
function numberToWords(n) {
    if (n === 0) return "Zero Pesos Only";

    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convertChunk(num) {
        if (num === 0) return '';
        if (num < 20) return a[num] + ' ';
        if (num < 100) return b[Math.floor(num / 10)] + ' ' + a[num % 10] + ' ';
        return a[Math.floor(num / 100)] + ' Hundred ' + convertChunk(num % 100);
    }

    let wholePart = Math.floor(n);
    let decimalPart = Math.round((n - wholePart) * 100);

    let words = convertChunk(wholePart).trim();
    
    let result = words + ' Pesos';

    if (decimalPart > 0) {
        let centavosWords = convertChunk(decimalPart).trim();
        result += ' and ' + centavosWords + ' Centavos';
    } else {
        result += ' Only';
    }

    return result.toUpperCase();
}


// --- 2. Function to toggle fields based on slip type ---
function toggleFields() {
    const slipType = document.getElementById('slipType').value;
    const depositFields = document.getElementById('depositFields');
    const withdrawalFields = document.getElementById('withdrawalFields');
    const slipTitle = document.getElementById('slipTypeTitle');

    if (slipType === 'deposit') {
        depositFields.style.display = 'block';
        withdrawalFields.style.display = 'none';
        slipTitle.textContent = 'DEPOSIT SLIP';
    } else {
        depositFields.style.display = 'none';
        withdrawalFields.style.display = 'block';
        slipTitle.textContent = 'WITHDRAWAL SLIP';
    }
}


// --- 3. Main function to capture data and generate PDF ---
function generateSlip() {
    const slipType = document.getElementById('slipType').value;
    const accountName = document.getElementById('accountName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const amountInput = document.getElementById('amount').value;

    if (!accountName || !accountNumber || !amountInput) {
        alert("Please fill in all required fields (Account Name, Account Number, and Amount).");
        return;
    }

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // --- A. Update Template Data ---
    const cashBreakdown = document.getElementById('cashBreakdown').value || 'Cash/Cheque attached';
    const signature = document.getElementById('signature').value || 'MEMBER SIGNATURE REQUIRED';
    const idPresented = document.getElementById('idPresented').value || 'ID NOT RECORDED';
    const date = new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });

    document.getElementById('slipDate').textContent = date;
    document.getElementById('slipAccountName').textContent = accountName.toUpperCase();
    document.getElementById('slipAccountNumber').textContent = accountNumber;
    document.getElementById('slipAmount').textContent = 'PHP ' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('slipAmountWords').textContent = numberToWords(amount);
    
    document.getElementById('slipCashBreakdown').textContent = cashBreakdown;
    document.getElementById('slipSignature').textContent = signature;
    document.getElementById('slipIDPresented').textContent = idPresented;

    // Toggle specific fields on the slip
    document.getElementById('slipDepositSpecifics').style.display = (slipType === 'deposit' ? 'block' : 'none');
    document.getElementById('slipWithdrawSpecifics').style.display = (slipType === 'withdraw' ? 'block' : 'none');


    // --- B. Generate PDF ---
    const element = document.getElementById('slipContent');
    const filename = (slipType === 'deposit' ? 'Deposit_Slip_' : 'Withdrawal_Slip_') + date.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';

    const opt = {
        margin: [5, 10, 5, 10], 
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, logging: true, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' } 
    };

    try {
        // 💥 FIX 1: Temporarily show the element for rendering 💥
        element.style.display = 'block'; 

        // Generate the PDF
        html2pdf().set(opt).from(element).save().finally(function() {
            // 💥 FIX 2: Hide the element again after the process is complete 💥
            element.style.display = 'none';
        });

    } catch (error) {
        // Log error and alert user if PDF generation fails
        console.error("PDF Generation Failed: - slip.js:115", error);
        alert("Error generating the slip. Please check your browser's console for details. (Ensure the html2pdf.js library is correctly linked!)");
        
        // Re-hide the element if the process failed mid-execution
        element.style.display = 'none';
    }
}

// Initialize field visibility on page load
document.addEventListener('DOMContentLoaded', toggleFields);