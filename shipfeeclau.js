addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 获取查询参数（如果需要处理动态输入，可以通过URL参数传递）
  const url = new URL(request.url);
  
  // 这里只做静态返回HTML，作为界面和计算脚本
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>海运费计算器</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        label, input, select, button {
          margin-bottom: 10px;
          display: block;
        }
        .form-group {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>海运费计算器</h1>
      
      <label>选择装载方式：</label>
      <select id="loadingType">
        <option value="FCL">整箱装</option>
        <option value="LCL">拼箱装</option>
      </select><br><br>

      <div id="fclInputs">
        <label>单位每箱运费 (USD)：</label>
        <input type="number" id="fclRate" placeholder="输入运费"><br>
        <label>整箱数量：</label>
        <input type="number" id="fclCount" placeholder="输入整箱数量"><br>
      </div>

      <div id="lclInputs" style="display: none;">
        <label>单位体积运费 (USD/CBM)：</label>
        <input type="number" id="lclVolumeRate" placeholder="输入单位体积运费"><br>
        <label>单位重量运费 (USD/TNE)：</label>
        <input type="number" id="lclWeightRate" placeholder="输入单位重量运费"><br>
        <label>货物总体积 (CBM)：</label>
        <input type="number" id="lclVolume" placeholder="输入总体积"><br>
        <label>货物总毛重 (TNE)：</label>
        <input type="number" id="lclWeight" placeholder="输入总毛重"><br>
      </div>

      <button id="calculate">计算海运费</button>

      <h2>结果：</h2>
      <p id="result">海运费：-</p>

      <script>
        document.getElementById("loadingType").addEventListener("change", function () {
          const loadingType = this.value;
          if (loadingType === "FCL") {
            document.getElementById("fclInputs").style.display = "block";
            document.getElementById("lclInputs").style.display = "none";
          } else {
            document.getElementById("fclInputs").style.display = "none";
            document.getElementById("lclInputs").style.display = "block";
          }
        });

        document.getElementById("calculate").addEventListener("click", function () {
          const loadingType = document.getElementById("loadingType").value;

          let result = 0;
          if (loadingType === "FCL") {
            const fclRate = parseFloat(document.getElementById("fclRate").value);
            const fclCount = parseInt(document.getElementById("fclCount").value, 10);
            if (!isNaN(fclRate) && !isNaN(fclCount)) {
              result = fclRate * fclCount;
            }
          } else if (loadingType === "LCL") {
            const lclVolumeRate = parseFloat(document.getElementById("lclVolumeRate").value);
            const lclWeightRate = parseFloat(document.getElementById("lclWeightRate").value);
            const lclVolume = parseFloat(document.getElementById("lclVolume").value);
            const lclWeight = parseFloat(document.getElementById("lclWeight").value);

            if (!isNaN(lclVolumeRate) && !isNaN(lclWeightRate) && !isNaN(lclVolume) && !isNaN(lclWeight)) {
              const x1 = lclVolumeRate * lclVolume;
              const x2 = lclWeightRate * lclWeight;
              result = Math.max(x1, x2);
            }
          }

          document.getElementById("result").innerText = \`海运费：\${result.toFixed(2)} USD\`;
        });
      </script>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" },
  });
}
