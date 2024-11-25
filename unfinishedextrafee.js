addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    // 如果是 GET 请求，返回 HTML 页面
    return new Response(generateHtml(), {
      headers: { 'Content-Type': 'text/html' },
    })
  } else if (request.method === 'POST') {
    // 如果是 POST 请求，计算费用
    const formData = await request.formData()

    // 获取表单数据
    const portCharge = parseFloat(formData.get('portCharge'))
    const truckingCharge = parseFloat(formData.get('truckingCharge'))
    const containerQuantity = parseFloat(formData.get('containerQuantity'))
    const groundService = parseFloat(formData.get('groundService'))
    const dapCharge = parseFloat(formData.get('dapCharge'))
    const ddpCharge = parseFloat(formData.get('ddpCharge'))

    // 计算费用
    const portChargeTotal = portCharge * containerQuantity
    const truckingChargeTotal = truckingCharge * containerQuantity
    const groundServiceTotal = groundService
    const dapChargeTotal = dapCharge
    const ddpChargeTotal = ddpCharge
    const totalCost = portChargeTotal + truckingChargeTotal + groundServiceTotal + dapChargeTotal + ddpChargeTotal

    // 返回结果
    return new Response(generateResultHtml(portChargeTotal, truckingChargeTotal, groundServiceTotal, dapChargeTotal, ddpChargeTotal, totalCost), {
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

// 生成 HTML 页面
function generateHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>综合费用计算器</title>
    </head>
    <body>
        <h1>综合费用计算器</h1>

        <form id="costForm" method="POST">
            <!-- 码头作业费 -->
            <label for="portCharge">码头作业费 (每个集装箱)：</label>
            <input type="number" name="portCharge" value="100" step="0.01" min="0">
            <br><br>

            <!-- 拖车费 -->
            <label for="truckingCharge">拖车费 (每个集装箱)：</label>
            <input type="number" name="truckingCharge" value="50" step="0.01" min="0">
            <br><br>

            <!-- 集装箱数量 -->
            <label for="containerQuantity">集装箱数量：</label>
            <input type="number" name="containerQuantity" value="1" min="1">
            <br><br>

            <!-- 地面服务费 -->
            <label for="groundService">地面服务费：</label>
            <input type="number" name="groundService" value="200" step="0.01" min="0">
            <br><br>

            <!-- DAP国外费用 -->
            <label for="dapCharge">DAP国外费用：</label>
            <input type="number" name="dapCharge" value="500" step="0.01" min="0">
            <br><br>

            <!-- DDP国外费用 -->
            <label for="ddpCharge">DDP国外费用：</label>
            <input type="number" name="ddpCharge" value="600" step="0.01" min="0">
            <br><br>

            <!-- 计算按钮 -->
            <button type="submit">计算</button>
        </form>

    </body>
    </html>
  `
}

// 生成计算结果的 HTML 页面
function generateResultHtml(portChargeTotal, truckingChargeTotal, groundServiceTotal, dapChargeTotal, ddpChargeTotal, totalCost) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>计算结果</title>
    </head>
    <body>
        <h1>计算结果</h1>
        <p>码头作业费：$${portChargeTotal.toFixed(2)}</p>
        <p>拖车费：$${truckingChargeTotal.toFixed(2)}</p>
        <p>地面服务费：$${groundServiceTotal.toFixed(2)}</p>
        <p>DAP国外费用：$${dapChargeTotal.toFixed(2)}</p>
        <p>DDP国外费用：$${ddpChargeTotal.toFixed(2)}</p>
        <h2>总费用：$${totalCost.toFixed(2)}</h2>
        <br>
        <a href="/">返回</a>
    </body>
    </html>
  `
}
