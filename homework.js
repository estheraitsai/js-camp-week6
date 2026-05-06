// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
  	const data = await response.json();
  	return data.products;
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
	const data = await response.json();
	const { carts, total, finalTotal } = data;
	return { carts, total, finalTotal };
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	try {
		const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || "取得產品列表失敗",
			};
		}

		return {
			success: true,
			data: data.products,
		};
	} catch (error) {
		return {
			success: false,
			error: error.message,
		};
	}
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	const response = await fetch (`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,{
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(
			{
			data: {
				productId,
				quantity, 
			},
			}),
	},
); 
const data = await response.json();
return data ;
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	const response = await fetch (`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,{
		method: 'PATCH',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			data: {
			id: cartId,
			quantity,
			},
		}),
	},
);
const data = await response.json();
return data;
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	const response = await fetch (`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`,{
		method: 'DELETE',
	},
); 
const data = await response.json();
return data; 
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	const response = await fetch (`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,{
		method: 'DELETE',
	},
); 
const data = await response.json();
return data; 
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
   HTTP 狀態碼是前端發出請求時，伺服器回應，用來表示「請求處理結果」的代碼。

   1xx：資訊回應
   代表請求已收到，伺服器正在繼續處理中。
	
   2xx：成功
   代表請求成功，伺服器已正確處理。

   3xx：重新導向
   代表請求的資源位置有變動，需要到其他位置取得。

   4xx：用戶端錯誤
   代表前端送出的請求有問題，例如網址錯、權限不足、資料格式錯誤。

   5xx：伺服器錯誤
   代表請求本身可能沒問題，但伺服器處理時發生錯誤。

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   GET：用來取得資料，不會修改伺服器資料。
   例如：取得商品列表、取得購物車內容。

   POST：用來新增資料，通常會建立一筆新的資源。
   例如：新增商品到購物車、建立訂單。

   PATCH：用來「部分更新」資料，只修改指定欄位。
   例如：只修改購物車商品的數量。

   PUT：用來「完整更新」資料，通常會用新的資料取代原本整筆資源。
   例如：更新整筆會員資料或整筆商品資料。

   DELETE：用來刪除資料。
   例如：刪除購物車某一項商品、清空購物車。

3. 什麼是 RESTful API？
   答：
   把後端資料視為一個一個「資源」，再透過 HTTP 方法來操作這些資源。

   如：
   - 用網址表示資源
     /products 代表商品列表
     /carts 代表購物車
     /orders 代表訂單

   - 用 HTTP 方法表示要做的動作
     GET 取得資料
     POST 新增資料
     PATCH / PUT 更新資料
     DELETE 刪除資料

   - 前後端透過統一格式交換資料
     常見格式是 JSON。

*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		let products = [];
		let testProductId = "";
		let testCartId = "";

		// ========================================
		// 任務一測試：基礎 fetch
		// ========================================
		console.log("--- 任務一：基礎 fetch ---");

		try {
			products = await getProducts();

			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);

			if (products && products.length > 0) {
				testProductId = products[0].id;
				console.log("測試用產品 ID:", testProductId);
			} else {
				console.log("目前沒有產品資料，後續購物車新增測試會略過");
			}
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();

			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();

			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		// ========================================
		// 任務二測試：POST / PATCH / DELETE
		// ========================================
		console.log("\n--- 任務二：購物車操作 ---");

		// 1. 加入商品到購物車
		try {
			if (!testProductId) {
				console.log("addToCart: 略過，因為沒有可測試的產品 ID");
			} else {
				const addResult = await addToCart(testProductId, 1);

				console.log(
					"addToCart:",
					addResult?.carts
						? `成功加入購物車，目前 ${addResult.carts.length} 筆商品`
						: "已送出請求，但回傳格式需確認",
				);

				if (addResult?.carts && addResult.carts.length > 0) {
					testCartId = addResult.carts[0].id;
					console.log("測試用購物車項目 ID:", testCartId);
				}
			}
		} catch (error) {
			console.log("addToCart 錯誤:", error.message);
		}

		// 2. 編輯購物車商品數量
		try {
			if (!testCartId) {
				console.log("updateCartItem: 略過，因為沒有可測試的購物車項目 ID");
			} else {
				const updateResult = await updateCartItem(testCartId, 2);

				console.log(
					"updateCartItem:",
					updateResult?.carts
						? `成功更新數量，目前 ${updateResult.carts.length} 筆商品`
						: "已送出請求，但回傳格式需確認",
				);
			}
		} catch (error) {
			console.log("updateCartItem 錯誤:", error.message);
		}

		// 3. 刪除購物車特定商品
		try {
			if (!testCartId) {
				console.log("removeCartItem: 略過，因為沒有可測試的購物車項目 ID");
			} else {
				const removeResult = await removeCartItem(testCartId);

				console.log(
					"removeCartItem:",
					removeResult?.carts
						? `成功刪除商品，目前 ${removeResult.carts.length} 筆商品`
						: "已送出請求，但回傳格式需確認",
				);
			}
		} catch (error) {
			console.log("removeCartItem 錯誤:", error.message);
		}

		// 4. 清空購物車
		try {
			// 為了確保 clearCart 有東西可以清，先再加入一筆商品
			if (!testProductId) {
				console.log("clearCart: 略過，因為沒有可測試的產品 ID");
			} else {
				await addToCart(testProductId, 1);

				const clearResult = await clearCart();

				console.log(
					"clearCart:",
					clearResult?.carts
						? `成功清空購物車，目前 ${clearResult.carts.length} 筆商品`
						: "已送出請求，但回傳格式需確認",
				);
			}
		} catch (error) {
			console.log("clearCart 錯誤:", error.message);
		}

		// ========================================
		// 最後確認購物車狀態
		// ========================================
		console.log("\n--- 最後確認購物車狀態 ---");

		try {
			const finalCart = await getCart();

			console.log(
				"最後購物車狀態:",
				finalCart
					? `購物車有 ${finalCart.carts?.length || 0} 筆商品，總金額 ${finalCart.total || 0}，折扣後金額 ${finalCart.finalTotal || 0}`
					: "回傳 undefined",
			);
		} catch (error) {
			console.log("最後購物車狀態錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}