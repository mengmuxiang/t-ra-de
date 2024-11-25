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
      <title>海运装箱计算器</title>
    </head>
    <body>
      <h1>海运装箱计算器</h1>
      
      <label>货物总体积 (CBM)：</label>
      <input type="number" id="totalVolume" placeholder="输入货物总体积"><br>
      <label>货物总毛重 (KGS)：</label>
      <input type="number" id="totalWeight" placeholder="输入货物总毛重"><br>
      <label>单位体积运费 (USD/CBM)：</label>
      <input type="number" id="volumeRate" placeholder="输入单位体积运费"><br>
      <label>单位重量运费 (USD/Ton)：</label>
      <input type="number" id="weightRate" placeholder="输入单位重量运费"><br>
      
      <label>选择集装箱类型：</label><br>
      <input type="radio" id="normal" name="containerType" value="normal" checked> 普通集装箱
      <input type="radio" id="refrigerated" name="containerType" value="refrigerated"> 冷藏集装箱<br>
      
      <label>整箱运费 (20' 集装箱) (USD)：</label>
      <input type="number" id="container20Rate" placeholder="输入20'整箱运费"><br>
      <label>整箱运费 (40' 集装箱) (USD)：</label>
      <input type="number" id="container40Rate" placeholder="输入40'整箱运费"><br>
      <label>整箱运费 (40' 高柜) (USD)：</label>
      <input type="number" id="container40HighRate" placeholder="输入40'高柜运费"><br>
      
      <button id="calculate">计算最优方案</button>

      <h2>结果：</h2>
      <p id="result">最优方案：-</p>
      <p id="freight">总费用：-</p>

      <script>
        document.getElementById("calculate").addEventListener("click", function () {
          // 输入数据
          const totalVolume = parseFloat(document.getElementById("totalVolume").value);
          const totalWeight = parseFloat(document.getElementById("totalWeight").value);
          const volumeRate = parseFloat(document.getElementById("volumeRate").value);
          const weightRate = parseFloat(document.getElementById("weightRate").value);
          const container20Rate = parseFloat(document.getElementById("container20Rate").value);
          const container40Rate = parseFloat(document.getElementById("container40Rate").value);
          const container40HighRate = parseFloat(document.getElementById("container40HighRate").value);

          if (isNaN(totalVolume) || isNaN(totalWeight) || isNaN(volumeRate) || 
              isNaN(weightRate) || isNaN(container20Rate) || 
              isNaN(container40Rate) || isNaN(container40HighRate)) {
            alert("请确保所有字段已正确填写！");
            return;
          }

          // 获取所选的集装箱类型
          const containerType = document.querySelector('input[name="containerType"]:checked').value;

          let containerSpecs = [];
          if (containerType === "normal") {
            containerSpecs = [
              { type: "20' 普柜", maxVolume: 33, maxWeight: 25000, rate: container20Rate },
              { type: "40' 普柜", maxVolume: 67, maxWeight: 29000, rate: container40Rate },
              { type: "40' 高柜", maxVolume: 76, maxWeight: 29000, rate: container40HighRate },
            ];
          } else if (containerType === "refrigerated") {
            containerSpecs = [
              { type: "20' 冷藏", maxVolume: 27, maxWeight: 21000, rate: container20Rate },
              { type: "40' 冷藏", maxVolume: 58, maxWeight: 26000, rate: container40Rate },
              { type: "40' 高冷", maxVolume: 66, maxWeight: 26000, rate: container40HighRate },
            ];
          }

          // 拼箱运费计算
          const volumeFreight = totalVolume * volumeRate;
          const weightFreight = (totalWeight / 1000) * weightRate;  // 转换为吨
          const lclFreight = Math.max(volumeFreight, weightFreight);

          // 整箱运费计算
          let fclFreight = Infinity;
          let bestContainer = null;

          for (const container of containerSpecs) {
            const requiredContainers = Math.max(
              Math.ceil(totalVolume / container.maxVolume),
              Math.ceil(totalWeight / container.maxWeight)
            );
            const cost = requiredContainers * container.rate;

            if (cost < fclFreight) {
              fclFreight = cost;
              bestContainer = container.type + " × " + requiredContainers;
            }
          }

          // 比较拼箱与整箱运费
          const optimalSolution = (lclFreight < fclFreight) ? "拼箱" : "整箱 (" + bestContainer + ")";
          const optimalCost = Math.min(lclFreight, fclFreight);

          // 显示结果
          document.getElementById("result").innerText = "最优方案：" + optimalSolution;
          document.getElementById("freight").innerText = "总费用：" + optimalCost.toFixed(2) + " USD";
        });
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
