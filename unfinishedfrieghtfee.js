addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const language = url.searchParams.get('lang') || 'en'; // 默认为英文

  // 返回 HTML 内容
  return new Response(`
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${language === 'zh' ? '空运费计算器' : 'Air Freight Calculator'}</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .night-mode { background-color: #2c2c2c; color: white; }
        button { margin-top: 20px; }
        label, input { display: block; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>${language === 'zh' ? '空运费计算器' : 'Air Freight Calculator'}</h1>

      <label for="languageSwitcher">${language === 'zh' ? '选择语言' : 'Select Language'}:</label>
      <button id="languageSwitcher">${language === 'zh' ? 'English' : '中文'}</button>

      <label for="modeSwitcher">${language === 'zh' ? '切换模式' : 'Toggle Mode'}:</label>
      <button id="modeSwitcher">${language === 'zh' ? '白天模式' : 'Day Mode'}</button>

      <div id="calculatorForm">
        <label>${language === 'zh' ? '货物数量' : 'Quantity'}:</label>
        <input type="number" id="quantity" placeholder="${language === 'zh' ? '输入货物数量' : 'Enter quantity'}"><br>

        <label>${language === 'zh' ? '单位净重 (KG)' : 'Unit Weight (KG)'}:</label>
        <input type="number" id="unitWeight" placeholder="${language === 'zh' ? '输入单位净重' : 'Enter unit weight'}"><br>

        <label>${language === 'zh' ? '每包装体积 (CBM)' : 'Package Volume (CBM)'}:</label>
        <input type="number" id="packageVolume" placeholder="${language === 'zh' ? '输入单位体积' : 'Enter package volume'}"><br>

        <label>${language === 'zh' ? '每包装毛重 (KG)' : 'Package Weight (KG)'}:</label>
        <input type="number" id="packageWeight" placeholder="${language === 'zh' ? '输入单位毛重' : 'Enter package weight'}"><br><br>

        <label>${language === 'zh' ? '燃油费率 (USD/KG)' : 'Fuel Rate (USD/KG)'}:</label>
        <input type="number" id="fuelRate" placeholder="${language === 'zh' ? '输入燃油费率' : 'Enter fuel rate'}"><br>

        <label>${language === 'zh' ? '安全费率 (USD/KG)' : 'Security Rate (USD/KG)'}:</label>
        <input type="number" id="securityRate" placeholder="${language === 'zh' ? '输入安全费率' : 'Enter security rate'}"><br>

        <label>${language === 'zh' ? '最低收费 (USD)' : 'Minimum Charge (USD)'}:</label>
        <input type="number" id="minCharge" placeholder="${language === 'zh' ? '输入最低收费' : 'Enter minimum charge'}"><br>

        <label>${language === 'zh' ? '操作费 (AWC) (USD)' : 'AWC Charge (USD)'}:</label>
        <input type="number" id="awc" placeholder="${language === 'zh' ? '输入操作费' : 'Enter AWC charge'}"><br><br>

        <label>${language === 'zh' ? '梯度报价：' : 'Pricing Gradient (USD/KG)'}:</label><br>
        <label>${language === 'zh' ? '0-45 KG' : '0-45 KG'}:</label><input type="number" id="rate1" value="10"><br>
        <label>${language === 'zh' ? '45-100 KG' : '45-100 KG'}:</label><input type="number" id="rate2" value="8"><br>
        <label>${language === 'zh' ? '100-300 KG' : '100-300 KG'}:</label><input type="number" id="rate3" value="6"><br>
        <label>${language === 'zh' ? '300-500 KG' : '300-500 KG'}:</label><input type="number" id="rate4" value="5"><br>
        <label>${language === 'zh' ? '500-1000 KG' : '500-1000 KG'}:</label><input type="number" id="rate5" value="4"><br>
        <label>${language === 'zh' ? '>1000 KG' : '>1000 KG'}:</label><input type="number" id="rate6" value="3"><br>

        <button id="calculate">${language === 'zh' ? '计算空运费' : 'Calculate Air Freight'}</button>
      </div>

      <h2>${language === 'zh' ? '结果' : 'Results'}:</h2>
      <p id="result">${language === 'zh' ? '计费重量：-' : 'Chargeable Weight: -'}</p>
      <p id="freight">${language === 'zh' ? '空运费：-' : 'Air Freight: -'}</p>
      
      <script>
        // 语言切换
        document.getElementById('languageSwitcher').addEventListener('click', () => {
          const currentLang = document.documentElement.lang;
          const newLang = currentLang === 'zh' ? 'en' : 'zh';
          window.location.search = 'lang=' + newLang;
        });

        // 模式切换
        document.getElementById('modeSwitcher').addEventListener('click', () => {
          document.body.classList.toggle('night-mode');
        });

        // 计算空运费
        document.getElementById('calculate').addEventListener('click', () => {
          const quantity = parseFloat(document.getElementById('quantity').value);
          const unitWeight = parseFloat(document.getElementById('unitWeight').value);
          const packageVolume = parseFloat(document.getElementById('packageVolume').value);
          const packageWeight = parseFloat(document.getElementById('packageWeight').value);
          const fuelRate = parseFloat(document.getElementById('fuelRate').value);
          const securityRate = parseFloat(document.getElementById('securityRate').value);
          const minCharge = parseFloat(document.getElementById('minCharge').value);
          const awc = parseFloat(document.getElementById('awc').value);

          // 获取梯度报价
          const rate1 = parseFloat(document.getElementById('rate1').value);
          const rate2 = parseFloat(document.getElementById('rate2').value);
          const rate3 = parseFloat(document.getElementById('rate3').value);
          const rate4 = parseFloat(document.getElementById('rate4').value);
          const rate5 = parseFloat(document.getElementById('rate5').value);
          const rate6 = parseFloat(document.getElementById('rate6').value);

          if (isNaN(quantity) || isNaN(unitWeight) || isNaN(packageVolume) || isNaN(packageWeight) || 
              isNaN(fuelRate) || isNaN(securityRate) || isNaN(minCharge) || isNaN(awc) ||
              isNaN(rate1) || isNaN(rate2) || isNaN(rate3) || isNaN(rate4) || isNaN(rate5) || isNaN(rate6)) {
            alert("${language === 'zh' ? '请确保所有字段已正确填写！' : 'Please ensure all fields are correctly filled!'}");
            return;
          }

          // 计算体积重量
          const volumeWeight = packageVolume * 167;  // 假设每立方米167公斤

          // 计算计费重量
          const chargeableWeight = Math.max(volumeWeight, packageWeight, unitWeight);

          let freightRate = rate1;
          if (chargeableWeight > 45 && chargeableWeight <= 100) freightRate = rate2;
          else if (chargeableWeight > 100 && chargeableWeight <= 300) freightRate = rate3;
          else if (chargeableWeight > 300 && chargeableWeight <= 500) freightRate = rate4;
          else if (chargeableWeight > 500 && chargeableWeight <= 1000) freightRate = rate5;
          else if (chargeableWeight > 1000) freightRate = rate6;

          // 计算空运费
          const freightCharge = Math.min(chargeableWeight * freightRate, chargeableWeight * (freightRate + 1));  // 当前梯度与下一个梯度最小值

          // 计算燃油费
          const fuelCharge = chargeableWeight * fuelRate;

          // 计算安全费
          const securityCharge = Math.max(chargeableWeight * securityRate, minCharge);

          // 总空运费
          const totalFreight = freightCharge + fuelCharge + securityCharge + awc;

          // 显示结果
          document.getElementById('result').innerText = '${language === 'zh' ? '计费重量：' : 'Chargeable Weight: '} ' + chargeableWeight.toFixed(2) + ' KG';
          document.getElementById('freight').innerText = '${language === 'zh' ? '空运费：' : 'Air Freight: '} ' + totalFreight.toFixed(2) + ' USD';
        });
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
