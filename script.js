document.getElementById('quoteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    addQuoteRow();
});

document.getElementById('addRow').addEventListener('click', addQuoteRow);

document.getElementById('printButton').addEventListener('click', function () {
    const quoteSection = document.getElementById('quoteSection').innerHTML;
    const newWindow = window.open('', '', 'height=700,width=700');
    newWindow.document.write('<html><head><title>Print Quote</title>');
    newWindow.document.write('</head><body>');
    newWindow.document.write(quoteSection);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
});

document.getElementById('savePdfButton').addEventListener('click', function () {
    const tableBody = document.getElementById('quoteTable').getElementsByTagName('tbody')[0];
    const customerName = document.getElementById('customerNameDisplay').textContent;
    const currentDate = document.getElementById('currentDateDisplay').textContent;
    const thankYouMessage = document.getElementById('thankYouMessage').value;

    const pdfContent = `
        <div style="text-align: center; padding: 20px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <img src="logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Ranjanas Facilities Management</h1>
                <p style="margin: 5px 0;">No149/1, Suwasewa Mawatta, MahaHeenatiyangala, Kalutara South</p>
                <p style="margin: 5px 0;">Con: 034 314 41 22 / 076 4964 90 90</p>
                <p style="margin: 5px 0;">0718670992 / 077 807 90 90</p>
            </div>
        </div>
        <div style="text-align: left; padding: 20px;">
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Quotation for:</strong> ${customerName}</p>
        </div>
        <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Premises</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Service Type</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Price per Unit</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Unit Name</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Number of Units</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Total</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Other Information</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(tableBody.rows).map(row => `
                        <tr>
                            ${Array.from(row.cells).slice(0, -1).map(cell => `
                                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${cell.textContent}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="5" style="border: 1px solid #ddd; padding: 10px; text-align: right;">Sub Total</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${document.getElementById('subTotal').textContent}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div style="padding: 20px;">
            <p>${thankYouMessage}</p>
        </div>
        <div style="padding: 20px;">
            <img src="sign.png" alt="Signature" style="max-width: 200px; display: block; margin: auto;">
            <p>Your Faithfully</p>
            <p>(MDUP Gunawardana)</p>
            <p>Squadron Leader (Retd)</p>
        </div>
    `;

    const pdfSection = document.createElement('div');
    pdfSection.innerHTML = pdfContent;

    html2pdf().from(pdfSection).set({
        margin: [10, 10, 20, 10], // Adjust margins as needed
        filename: 'quote.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
});



function addQuoteRow() {
    const premises = document.getElementById('premises').value;
    const serviceType = document.getElementById('serviceType').value;
    const pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value);
    const unitName = document.getElementById('unitName').value;
    const numberOfUnits = parseFloat(document.getElementById('numberOfUnits').value);
    const otherInfo = document.getElementById('otherInfo').value;

    const total = pricePerUnit * numberOfUnits;
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${premises}</td>
        <td>${serviceType}</td>
        <td>Rs. ${pricePerUnit.toFixed(2)}</td>
        <td>${unitName}</td>
        <td>${numberOfUnits}</td>
        <td>Rs. ${total.toFixed(2)}</td>
        <td>${otherInfo}</td>
        <td><button type="button" class="deleteButton">Delete</button></td>
    `;
    document.getElementById('quoteTable').getElementsByTagName('tbody')[0].appendChild(newRow);

    updateSubTotal();

    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('tr').remove();
            updateSubTotal();
        });
    });
}

function updateSubTotal() {
    const tableBody = document.getElementById('quoteTable').getElementsByTagName('tbody')[0];
    let subTotal = 0;

    Array.from(tableBody.rows).forEach(row => {
        const totalCell = row.cells[5];
        const totalValue = parseFloat(totalCell.textContent.replace('Rs.', '').replace(',', ''));
        subTotal += totalValue;
    });

    document.getElementById('subTotal').textContent = `Rs. ${subTotal.toFixed(2)}`;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

document.getElementById('customerName').addEventListener('input', function () {
    const currentDate = new Date();
    document.getElementById('currentDateDisplay').textContent = formatDate(currentDate);
    document.getElementById('customerNameDisplay').textContent = this.value;
});
