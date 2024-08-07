// script.js
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
    const quoteSection = document.getElementById('quoteSection');
    html2pdf().from(quoteSection).save('quote.pdf');
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
    pricePerUnitCell.textContent = `$${pricePerUnit.toFixed(2)}`;
    unitNameCell.textContent = unitName;
    numberOfUnitsCell.textContent = numberOfUnits;
    totalCell.textContent = `$${total.toFixed(2)}`;
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
}

function updateSubTotal() {
    const rows = document.getElementById('quoteTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let subTotal = 0;
    
    for (const row of rows) {
        const totalCell = row.cells[5];
        const total = parseFloat(totalCell.textContent.replace('$', ''));
        subTotal += total;
    }
    
    document.getElementById('subTotal').textContent = `$${subTotal.toFixed(2)}`;
}
