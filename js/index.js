document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const insightsResults = document.getElementById('insights-results');
    const productForm = document.getElementById('product-form');

    calculateButton.addEventListener('click', function() {
        const productName = document.getElementById('product-name').value;
        const rawMaterialCost = parseFloat(document.getElementById('raw-material-cost').value);
        const laborCost = parseFloat(document.getElementById('labor-cost').value);
        const otherCosts = parseFloat(document.getElementById('other-costs').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('selling-price').value);
        const unitsSold = parseInt(document.getElementById('units-sold').value);

        
        const totalCost = rawMaterialCost + laborCost + otherCosts;
        const vari = sellingPrice - totalCost;
        const variableCostPerUnit = rawMaterialCost / unitsSold;
        const profitPerUnit = sellingPrice - totalCost;
        const totalRevenue = sellingPrice * unitsSold;
        const totalProfit = profitPerUnit * unitsSold;
        const profitMargin = (totalProfit / totalRevenue) * 100;
        const breakEvenPoint = totalCost / (sellingPrice - (rawMaterialCost + laborCost));
        const contributionMargin = (sellingPrice - vari) * 100;

        const insights = `
            <h3>Insights for ${productName}</h3>
            <p>Total Cost per Unit: $${totalCost.toFixed(2)}</p>
            <p>Contribution Margin: ${contributionMargin.toFixed(2)}%</p>
            <p>Variable Cost per Unit: $${variableCostPerUnit.toFixed(2)}</p>
            <p>Profit per Unit: $${profitPerUnit.toFixed(2)}</p>
            <p>Total Revenue: $${totalRevenue.toFixed(2)}</p>
            <p>Total Profit: $${totalProfit.toFixed(2)}</p>
            <p>Profit Margin: ${profitMargin.toFixed(2)}%</p>
            <p>Break-Even Point (Units): ${breakEvenPoint.toFixed(0)}</p>
        `;

        insightsResults.innerHTML = insights;
    });
});