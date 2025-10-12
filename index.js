// -----------------------------
// Qarshala Project Management - Phase 1
// -----------------------------

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Basic variables
let capital = 0;         // Capital
let goods = 0;           // Number of Qarshala boxes in stock

// Purchase prices from bakery
const PRICE_CASH = 35;      // Cash price
const PRICE_APP = 40;       // App / Bank transfer price

const SELL_PRICE = 50;      // Selling price to customers (initial)

// -----------------------------------------------------
function showMenu() {
  console.log("\n=== Qarshala Project Management ===");
  console.log("1. Buy goods");
  console.log("2. Sell goods");
  console.log("3. Show current status");
  console.log("4. Exit program");
  rl.question("Choose an option: ", handleMenu);
}

// -----------------------------------------------------
function handleMenu(choice) {
  switch (choice) {
    case '1':
      buyGoods();
      break;
    case '2':
      sellGoods();
      break;
    case '3':
      showStatus();
      break;
    case '4':
      console.log("👋 Program ended. Goodbye!");
      rl.close();
      break;
    default:
      console.log("❌ Invalid option, please try again.");
      showMenu();
  }
}

// -----------------------------------------------------
function buyGoods() {
  console.log("\nChoose purchase method:");
  console.log("1. Cash (price 35)");
  console.log("2. App / Bank transfer (price 40)");
  rl.question("Select method: ", (type) => {
    const price = type === '1' ? PRICE_CASH : PRICE_APP;
    rl.question("How many boxes do you want to buy? ", (amountStr) => {
      const amount = parseInt(amountStr);
      const cost = price * amount;
      if (cost > capital) {
        console.log("❌ Not enough capital to complete the purchase!");
      } else {
        capital -= cost;
        goods += amount;
        console.log(`✅ Purchased ${amount} boxes. Total cost: ${cost} shekels (${type === '1' ? 'Cash' : 'Transfer'})`);
      }
      showMenu();
    });
  });
}

// -----------------------------------------------------
function sellGoods() {
  rl.question("\nHow many boxes do you want to sell? ", (amountStr) => {
    const amount = parseInt(amountStr);
    if (amount > goods) {
      console.log("❌ Not enough stock to sell!");
      showMenu();
      return;
    }
    const revenue = SELL_PRICE * amount;
    capital += revenue;
    goods -= amount;
    console.log(`💰 Sold ${amount} boxes for a total of ${revenue} shekels`);
    showMenu();
  });
}

// -----------------------------------------------------
function showStatus() {
  console.log("\n📊 Current Status:");
  console.log(`Current capital: ${capital} shekels`);
  console.log(`Number of boxes in stock: ${goods}`);
  console.log(`Total value of goods in stock: ${goods * SELL_PRICE} shekels (if sold)`);
  showMenu();
}

// -----------------------------------------------------
rl.question('💵 How much capital do you have? ', (answer) => {
  capital = parseFloat(answer);
  console.log(`✅ Capital registered: ${capital} shekels`);
  showMenu();
});
