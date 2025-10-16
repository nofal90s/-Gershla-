// -----------------------------
// Qarshala Project Management - Phase 1 (Enhanced Version)
// -----------------------------

const fs = require('fs');
const readline = require('readline');

// -----------------------------
// Configuration
// -----------------------------
const DATA_FILE = 'qarshala_data.json';
const PRICE_CASH = 35;   // Cash purchase price
const PRICE_APP = 40;    // App/bank transfer purchase price
const SELL_PRICE = 50;   // Default selling price

let capital = 0; // Current money
let goods = 0;   // Stock boxes count

// -----------------------------
// Setup input/output interface
// -----------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// -----------------------------
// Data persistence functions
// -----------------------------
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    capital = data.capital || 0;
    goods = data.goods || 0;
    console.log("📂 Previous data loaded successfully!");
  } else {
    console.log("🆕 No previous data found, starting fresh.");
  }
}

function saveData() {
  const data = { capital, goods };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// -----------------------------
// Menu system
// -----------------------------
function showMenu() {
  console.log("\n=== Qarshala Project Management ===");
  console.log("1. Buy goods");
  console.log("2. Sell goods");
  console.log("3. Show current status");
  console.log("4. Exit program");
  console.log("5. 🔄 Reset all data");
  rl.question("Choose an option: ", handleMenu);
}


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
    case '5':
      resetData();
      break;
    default:
      console.log("❌ Invalid option, please try again.");
      showMenu();
  }
}

// -----------------------------
// Buying function
// -----------------------------
function buyGoods(attempt = 1) {
  console.log("\nSelect purchase method:");
  console.log("1. Cash (35)");
  console.log("2. App/Bank Transfer (40)");
  rl.question("Choose method: ", (type) => {
    const price = type === '1' ? PRICE_CASH : PRICE_APP;
    rl.question("How many boxes do you want to buy? ", (amountStr) => {
      const amount = parseInt(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log("❌ Please enter a valid number!");
        if (attempt < 3) {
          console.log(`🔁 Try again (${3 - attempt} attempts left)`);
          buyGoods(attempt + 1);
        } else {
          console.log("⚠️ Returning to main menu...");
          showMenu();
        }
        return;
      }

      const cost = price * amount;
      if (cost > capital) {
        console.log("❌ Not enough capital!");
        if (attempt < 3) {
          console.log(`🔁 Try again (${3 - attempt} attempts left)`);
          buyGoods(attempt + 1);
        } else {
          console.log("⚠️ Returning to main menu...");
          showMenu();
        }
      } else {
        capital -= cost;
        goods += amount;
        saveData();
        console.log(`✅ Bought ${amount} boxes for ${cost} shekels (${type === '1' ? 'Cash' : 'Transfer'})`);
        showMenu();
      }
    });
  });
}

// -----------------------------
// Selling function (with retry logic)
// -----------------------------
function sellGoods(attempt = 1) {
  rl.question("\nHow many boxes do you want to sell? ", (amountStr) => {
    const amount = parseInt(amountStr);

    if (isNaN(amount) || amount <= 0) {
      console.log("❌ Please enter a valid number!");
      if (attempt < 3) {
        console.log(`🔁 Try again (${3 - attempt} attempts left)`);
        sellGoods(attempt + 1);
      } else {
        console.log("⚠️ Returning to main menu...");
        showMenu();
      }
      return;
    }

    if (amount > goods) {
      console.log("❌ Not enough stock to sell!");
      if (attempt < 3) {
        console.log(`🔁 Try again (${3 - attempt} attempts left)`);
        sellGoods(attempt + 1);
      } else {
        console.log("⚠️ Returning to main menu...");
        showMenu();
      }
      return;
    }

    const revenue = SELL_PRICE * amount;
    capital += revenue;
    goods -= amount;
    saveData();
    console.log(`💰 Sold ${amount} boxes for a total of ${revenue} shekels`);
    showMenu();
  });
}

// -----------------------------
// Show status
// -----------------------------
function showStatus() {
  console.log("\n📊 Current Status:");
  console.log(`Capital: ${capital} shekels`);
  console.log(`Boxes in stock: ${goods}`);
  console.log(`Potential stock value: ${goods * SELL_PRICE} shekels (if sold)`);
  showMenu();
}


// -----------------------------
// reset program
// -----------------------------

function resetData() {
  console.log("\n⚠️ Are you sure you want to reset all data? This cannot be undone.");
  rl.question("Type YES to confirm: ", (answer) => {
    if (answer.trim().toUpperCase() === "YES") {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE); // delete data file
      }
      capital = 0;
      goods = 0;
      console.log("✅ All data has been reset successfully!");
      console.log("🔄 Please restart the program to begin fresh.");
      rl.close();
    } else {
      console.log("❌ Reset cancelled.");
      showMenu();
    }
  });
}


// -----------------------------
// Start program
// -----------------------------
if (fs.existsSync(DATA_FILE)) {
  loadData();
  showMenu();
} else {
  rl.question('💵 How much money do you have (capital)? ', (answer) => {
    capital = parseFloat(answer);
    saveData();
    console.log(`✅ Capital set: ${capital} shekels`);
    showMenu();
  });
}
