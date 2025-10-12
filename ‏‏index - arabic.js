// -----------------------------
// برنامج إدارة مشروع القرشلة - المرحلة الأولى
// -----------------------------

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// المتغيرات الأساسية
let capital = 0;         // رأس المال
let goods = 0;           // عدد صناديق القرشلة في المخزون
// أسعار الشراء من المخبز
const PRICE_CASH = 35;      // السعر النقدي (كاش)
const PRICE_APP = 40;       // السعر عبر التطبيق أو التحويل البنكي

const SELL_PRICE = 50;      // سعر البيع للزبون (مبدئي)

// -----------------------------------------------------
function showMenu() {
  console.log("\n=== إدارة مشروع القرشلة ===");
  console.log("1. شراء بضاعة");
  console.log("2. بيع بضاعة");
  console.log("3. عرض الحالة الحالية");
  console.log("4. إنهاء البرنامج");
  rl.question("اختر رقم العملية: ", handleMenu);
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
      console.log("👋 تم إنهاء البرنامج. إلى اللقاء!");
      rl.close();
      break;
    default:
      console.log("❌ خيار غير صحيح، حاول مرة أخرى.");
      showMenu();
  }
}

// -----------------------------------------------------
function buyGoods() {
  console.log("\nاختر طريقة الشراء:");
  console.log("1. نقدي (بسعر 35)");
  console.log("2. تحويل / تطبيق (بسعر 40)");
  rl.question("اختر الطريقة: ", (type) => {
    const price = type === '1' ? PRICE_CASH : PRICE_APP;
    rl.question("كم عدد الصناديق التي تريد شراءها؟ ", (amountStr) => {
      const amount = parseInt(amountStr);
      const cost = price * amount;
      if (cost > capital) {
        console.log("❌ لا يوجد رأس مال كافٍ لإتمام العملية!");
      } else {
        capital -= cost;
        goods += amount;
        console.log(`✅ تم شراء ${amount} صندوق. التكلفة: ${cost} شيكل (${type === '1' ? 'كاش' : 'تحويل'})`);
      }
      showMenu();
    });
  });
}

// -----------------------------------------------------
function sellGoods() {
  rl.question("\nكم صندوق تريد بيعه؟ ", (amountStr) => {
    const amount = parseInt(amountStr);
    if (amount > goods) {
      console.log("❌ لا يوجد بضاعة كافية في المخزون!");
      showMenu();
      return;
    }
    const revenue = SELL_PRICE * amount;
    capital += revenue;
    goods -= amount;
    console.log(`💰 تم بيع ${amount} صندوق بإجمالي ${revenue} شيكل`);
    showMenu();
  });
}

// -----------------------------------------------------
function showStatus() {
  console.log("\n📊 الحالة الحالية:");
  console.log(`رأس المال الحالي: ${capital} شيكل`);
  console.log(`عدد الصناديق في المخزون: ${goods}`);
  console.log(`إجمالي قيمة البضاعة بالمخزون: ${goods * SELL_PRICE} شيكل (في حال البيع)`);
  showMenu();
}

// -----------------------------------------------------
rl.question('💵 كم تملك من النقود (رأس المال)؟ ', (answer) => {
  capital = parseFloat(answer);
  console.log(`✅ تم تسجيل رأس المال: ${capital} شيكل`);
  showMenu();
});
