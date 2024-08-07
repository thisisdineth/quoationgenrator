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
    const customerName = document.getElementById('customerNameDisplay').textContent;
    const pdfDetails = document.getElementById('pdfDetails').value;
    const tableBody = document.getElementById('quoteTable').getElementsByTagName('tbody')[0];

    // Create a new HTML structure for the PDF
    const pdfContent = `
        <div style="text-align: center; padding: 20px;">
            <img src="logo.png" alt="Logo" style="max-width: 100px;">
            <h1>Ranjanas Facilities Managemnt</h1>
            <p>Ranjanas Facilities Management<br>
                    No149/1,Suwasewa Mawatta,<br>
                    MahaHeenatiyangala,Kalutara South<br>
                    Con: 034 312 41 22 / 076 4964 90 90<br>
                    0718670992 / 077 807 90 90</p>
        </div>
        <div style="text-align: left; padding: 20px;">
            <p>Quotation for: ${customerName}</p>
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
            <p>${pdfDetails}</p>
        </div>
        <div style="text-align: left; padding: 20px;">
            <img src="sign.png" alt="Signature" style="max-width: 200px;"><br>
            Your Faithfully<br>
(MDUP Gunawardana)<br>
Squadron Leader (Retd)<br>
        </div>
    `;

    html2pdf().from(pdfContent).save('quote.pdf');
});

function addQuoteRow() {
    // Get form values
    const premises = document.getElementById('premises').value;
    const serviceType = document.getElementById('serviceType').value;
    const pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value);
    const unitName = document.getElementById('unitName').value;
    const numberOfUnits = parseFloat(document.getElementById('numberOfUnits').value);
    const otherInfo = document.getElementById('otherInfo').value;
    const customerName = document.getElementById('customerName').value;

    // Calculate total
    const total = pricePerUnit * numberOfUnits;

    // Create a new row in the table
    const tableBody = document.getElementById('quoteTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    // Insert cells in the new row
    const premisesCell = newRow.insertCell(0);
    const serviceTypeCell = newRow.insertCell(1);
    const pricePerUnitCell = newRow.insertCell(2);
    const unitNameCell = newRow.insertCell(3);
    const numberOfUnitsCell = newRow.insertCell(4);
    const totalCell = newRow.insertCell(5);
    const otherInfoCell = newRow.insertCell(6);
    const actionCell = newRow.insertCell(7);

    // Add values to cells
    premisesCell.textContent = premises;
    serviceTypeCell.textContent = serviceType;
    pricePerUnitCell.textContent = `Rs. ${pricePerUnit.toFixed(2)}`;
    unitNameCell.textContent = unitName;
    numberOfUnitsCell.textContent = numberOfUnits;
    totalCell.textContent = `Rs. ${total.toFixed(2)}`;
    otherInfoCell.textContent = otherInfo;

    // Add delete button to the last cell
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function () {
        tableBody.removeChild(newRow);
        updateSubTotal();
    });
    actionCell.appendChild(deleteButton);

    // Update customer name
    document.getElementById('customerNameDisplay').textContent = customerName;

    // Clear form
    document.getElementById('quoteForm').reset();

    // Update subtotal
    updateSubTotal();

    // Show the quote section
    document.getElementById('quoteSection').style.display = 'block';
}

function updateSubTotal() {
    const rows = document.getElementById('quoteTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let subTotal = 0;
    
    for (const row of rows) {
        const totalCell = row.cells[5];
        const total = parseFloat(totalCell.textContent.replace('Rs. ', ''));
        subTotal += total;
    }
    
    document.getElementById('subTotal').textContent = `Rs. ${subTotal.toFixed(2)}`;
}
