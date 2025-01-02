document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const insightsResults = document.getElementById('insights-results');
    const futherInsight = document.getElementById('further-insight');
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
            console.log(row)
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

            const totalCostPerUnitGreaterThanProfitPerUnit = `
        <h3>Total Cost Per Unit Greater Than Profit Per Unit</h3>
        <h4>Implication:</h4>
        <p>The business is losing money on each unit sold. This is unsustainable.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Reduce Costs:</li>
            <ul>
                <li>Negotiate better deals with suppliers.</li>
                <li>Improve operational efficiency to reduce waste and labor costs.</li>
                <li>Explore alternative, cheaper materials or production methods.</li>
            </ul>
            <li>Increase Prices:</li>
            <ul>
                <li>Carefully analyze market conditions and competitor pricing.</li>
                <li>Justify price increases by highlighting value and unique selling propositions.</li>
                <li>Consider offering premium versions of the product at higher prices.</li>
            </ul>
            <li>Re-evaluate Product Viability:</li>
            <ul>
                <li>Determine if the product can be salvaged or if it should be discontinued.</li>
            </ul>
        </ul>

        <button "button" class="product__management"><a href="totalCostPerUnitGreaterThanProfitPerUnit.html">Proceed to Product Management</a></button>

        `;
        const totalCostPerUnitLessThanProfitPerUnit = `
        <h3>Total Cost Per Unit Less Than Profit Per Unit</h3>
        <h4>Implication:</h4>
        <p>The business is making a profit on each unit.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Monitor Closely:</li>
            <ul>
                <li>Keep a close eye on costs to ensure profitability is maintained.</li>
            </ul>
            <li>Explore Growth Opportunities:</li>
            <ul>
                <li>Consider increasing production or expanding into new markets.</li>
            </ul>
            <li>Optimize Pricing:</li>
            <ul>
                <li>Can you increase prices strategically without hurting demand?</li>
            </ul>
        </ul>
        `
        const highVariableCostLowContributionMargin = `
        <h3>High Variable Cost, Low Contribution Margin</h3>
        <h4>Implication:</h4>
        <p>A large portion of the selling price is going towards covering variable costs, leaving little to contribute to fixed costs and profit.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Focus on Reducing Variable Costs:</li>
            <ul>
                <li>Streamline production processes.</li>
                <li>Find more efficient suppliers.</li>
                <li>Reduce material waste.</li>
            </ul>
            <li>Increase Sales Volume:</li>
            <ul>
                <li>If fixed costs are high, increasing sales volume can help leverage economies of scale and improve profitability even with a low contribution margin per unit.</li>
            </ul>
        </ul>
        `
        const highRevenueLowProfit = `
        <h3>High Revenue, Low Profit</h3>
        <h4>Implication:</h4>
        <p>While the business is generating significant sales, a small portion of the revenue is going towards covering fixed costs and profit.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Conduct a Thorough Cost Analysis:</li>
            <ul>
                <li>Identify areas where costs can be reduced (both fixed and variable).</li>
                <li>Optimize pricing.</li>
                <li>Improve operational efficiency.</li>
            </ul>
            <li>Promote and Cross-Sell:</li>
            <ul>
                <li>Train your sales team to upsell (sell more expensive versions of products) or cross-sell (sell related products) to increase the average order value.</li>
            </ul>
        </ul>
        `
        const lowProfitMargin = `
        <h3>Low Profit Margin</h3>
        <h4>Implication:</h4>
        <p>The business is not generating much profit for every dollar of revenue.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Increase Prices (if feasible):</li>
            <ul>
                <li>Analyze the production process to identify areas where you can improve efficiency and reduce labor hours.</li>
                <li>Investigate automation options if applicable to your production process.</li>
                <li>Consider outsourcing some tasks if it's more cost-effective.</li>
            </ul>
            <li>Reduce Costs (both fixed and variable):</li>
            <ul>
                <li>This is crucial for improving profit margins.</li>
            </ul>
            <li>Focus on High-Margin Products/Services:</li>
            <ul>
                <li>If the business offers multiple products, prioritize those with higher profit margins.</li>
            </ul>
        </ul>
        `
        const highBreakEvenPoint = `
        <h3>High Break-Even Point</h3>
        <h4>Implication:</h4>
        <p>The break-even point (the number of units that need to be sold to cover all costs) is very high, meaning the business needs to sell a large volume of products just to avoid losses.</p>
        <h4>Actionable Advice:</h4>
        <ul>
            <li>Reduce Fixed Costs:</li>
            <ul>
                <li>Renegotiate rent or other fixed expenses.</li>
                <li>Explore ways to make some fixed costs variable (e.g., outsourcing).</li>
            </ul>
            <li>Increase Contribution Margin:</li>
            <ul>
                <li>Reduce variable costs (as discussed above).</li>
                <li>Increase selling prices (if the market allows).</li>
            </ul>
        </ul>
        `
        
        if (totalCost > totalProfit){
            futherInsight.innerHTML += totalCostPerUnitGreaterThanProfitPerUnit;
        }else if (totalCost < totalProfit){
            futherInsight.innerHTML += totalCostPerUnitLessThanProfitPerUnit;
        }else if (totalCost < totalProfit && totalVariableCost > contributionMargin){
            futherInsight.innerHTML += highVariableCostLowContributionMargin;
        }else if (totalRevenue < totalProfit){
            futherInsight.innerHTML += highRevenueLowProfit;
        }else if(profitMargin < totalCost){
            futherInsight.innerHTML += lowProfitMargin;
        }else if(breakEvenPoint > unitsSold){
            futherInsight.innerHTML += highBreakEvenPoint;
        }
        }

        insightsResults.innerHTML = insightsHTML;
    }
});