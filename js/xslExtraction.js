document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const insightsResults = document.getElementById('insights-results');
    const productForm = document.getElementById('product-form');
    const spreadsheetUpload = document.getElementById('spreadsheet-upload');

    calculateButton.addEventListener('click', function() {
        const file = spreadsheetUpload.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                processSpreadsheetData(jsonData);
            };

            reader.readAsBinaryString(file);
        } else {
            insightsResults.innerHTML = '<p>Please upload a spreadsheet file.</p>';
        }
    });

    function processSpreadsheetData(jsonData) {
        let insightsHTML = '';

        for (const row of jsonData) {
            const productName = row['Product Name'];
            const rawMaterialCost = parseFloat(row['Raw Material Cost']);
            const laborCost = parseFloat(row['Direct Labor Cost']);
            const otherVariableCosts = parseFloat(row['Other Variable Costs']) || 0;
            const fixedCosts = parseFloat(row['Fixed Costs']) || 0;
            const sellingPrice = parseFloat(row['Selling Price']);
            const unitsSold = parseInt(row['Units Sold']); // Make sure you have a 'Units Sold' column or similar

            const totalVariableCost = rawMaterialCost + laborCost + otherVariableCosts;
            const variableCostPerUnit = totalVariableCost / unitsSold;
            const totalCost = totalVariableCost + fixedCosts;
            const profitPerUnit = sellingPrice - totalCost/unitsSold;
            const totalRevenue = sellingPrice * unitsSold;
            const totalProfit = profitPerUnit * unitsSold;
            const profitMargin = (totalProfit / totalRevenue) * 100;
            const breakEvenPoint = fixedCosts / (sellingPrice - variableCostPerUnit);

            insightsHTML += `
                <h3>Insights for ${productName}</h3>
                <p>Total Variable Costs: $${totalVariableCost.toFixed(2)}</p>
                <p>Variable Cost per Unit: $${variableCostPerUnit.toFixed(2)}</p>
                <p>Total Fixed Costs: $${fixedCosts.toFixed(2)}</p>
                <p>Total Cost per Unit: $${totalCost.toFixed(2)}</p>
                <p>Profit per Unit: $${profitPerUnit.toFixed(2)}</p>
                <p>Total Revenue: $${totalRevenue.toFixed(2)}</p>
                <p>Total Profit: $${totalProfit.toFixed(2)}</p>
                <p>Profit Margin: ${profitMargin.toFixed(2)}%</p>
                <p>Break-Even Point (Units): ${breakEvenPoint.toFixed(0)}</p>
            `;
        }

        insightsResults.innerHTML = insightsHTML;
    }
});