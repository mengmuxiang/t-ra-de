addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 返回 HTML 内容和嵌入的 JavaScript 代码
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>保险费用计算</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 50px auto;
                padding: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                text-align: center;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
            }
            input, select {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            button {
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
            }
            button:hover {
                background-color: #45a049;
            }
            .result {
                margin-top: 20px;
                font-size: 18px;
                text-align: center;
            }
        </style>
    </head>
    <body>

    <div class="container">
        <h2>保险费用计算器</h2>
        
        <div class="form-group">
            <label for="contractPrice">合同总价（USD）:</label>
            <input type="number" id="contractPrice" placeholder="请输入合同总价">
        </div>

        <div class="form-group">
            <label for="freight">运费（USD）:</label>
            <input type="number" id="freight" placeholder="请输入运费">
        </div>

        <div class="form-group">
            <label for="transportMode">运输方式:</label>
            <select id="transportMode">
                <option value="sea">海运</option>
                <option value="air">空运</option>
            </select>
        </div>

        <div class="form-group">
            <label for="insuranceAmount">投保金额加成比例:</label>
            <select id="insuranceAmount">
                <option value="1.1">110%</option>
                <option value="1.2">120%</option>
                <option value="1.3">130%</option>
            </select>
        </div>

        <div class="form-group">
            <label>选择保险类型:</label><br>
            <input type="checkbox" id="allRisk" value="allRisk"> 海运一切险 (0.008)<br>
            <input type="checkbox" id="waterDamage" value="waterDamage"> 水渍险 (0.006)<br>
            <input type="checkbox" id="peaceInsurance" value="peaceInsurance"> 平安险 (0.005)<br>
            <input type="checkbox" id="associationA" value="associationA"> 伦敦协会货物条款 (A) (0.008)<br>
            <input type="checkbox" id="associationB" value="associationB"> 伦敦协会货物条款 (B) (0.006)<br>
            <input type="checkbox" id="associationC" value="associationC"> 伦敦协会货物条款 (C) (0.005)<br>
            <input type="checkbox" id="airAllRisk" value="airAllRisk"> 空运一切险 (0.0035)<br>
            <input type="checkbox" id="airInsurance" value="airInsurance"> 空运险 (0.002)<br>
            <input type="checkbox" id="warRisk" value="warRisk"> 战争险 (0.0008)<br>
            <input type="checkbox" id="strikeRisk" value="strikeRisk"> 罢工险 (0.0008)<br>
        </div>

        <button onclick="calculateInsurance()">计算保险费用</button>

        <div class="result" id="result">
            <!-- 计算结果会显示在这里 -->
        </div>
    </div>

    <script>
    // JavaScript code here for calculating insurance

    function calculateInsurance() {
      const transportMode = document.getElementById('transportMode').value;
      const contractPrice = parseFloat(document.getElementById('contractPrice').value) || 0;
      const freight = parseFloat(document.getElementById('freight').value) || 0;
      const insuranceAmountFactor = parseFloat(document.getElementById('insuranceAmount').value) || 1.1;

      const insuranceRates = {
        sea: {
          allRisk: 0.008, // 海运一切险
          waterDamage: 0.006, // 水渍险
          peaceInsurance: 0.005, // 平安险
          associationA: 0.008, // 伦敦协会货物条款 (A)
          associationB: 0.006, // 伦敦协会货物条款 (B)
          associationC: 0.005, // 伦敦协会货物条款 (C)
        },
        air: {
          airAllRisk: 0.0035, // 空运一切险
          airInsurance: 0.002, // 空运险
        },
        common: {
          warRisk: 0.0008, // 战争险
          strikeRisk: 0.0008, // 罢工险
        },
      };

      let totalInsuranceFee = 0;

      const selectedInsuranceTypes = [
        { id: 'allRisk', rate: insuranceRates.sea.allRisk },
        { id: 'waterDamage', rate: insuranceRates.sea.waterDamage },
        { id: 'peaceInsurance', rate: insuranceRates.sea.peaceInsurance },
        { id: 'associationA', rate: insuranceRates.sea.associationA },
        { id: 'associationB', rate: insuranceRates.sea.associationB },
        { id: 'associationC', rate: insuranceRates.sea.associationC },
        { id: 'airAllRisk', rate: insuranceRates.air.airAllRisk },
        { id: 'airInsurance', rate: insuranceRates.air.airInsurance },
        { id: 'warRisk', rate: insuranceRates.common.warRisk },
        { id: 'strikeRisk', rate: insuranceRates.common.strikeRisk }
      ];

      // 计算选中的保险类型费用
      selectedInsuranceTypes.forEach(insurance => {
        if (document.getElementById(insurance.id).checked) {
          const insuranceAmount = (contractPrice + freight) * insuranceAmountFactor;
          const insuranceFee = insuranceAmount * insurance.rate;
          totalInsuranceFee += insuranceFee;
        }
      });

      document.getElementById('result').innerText = \`保险费用: USD \${totalInsuranceFee.toFixed(2)}\`;
    }
    </script>

    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
