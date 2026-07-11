const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const totalBalance = document.getElementById("totalBalance");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

renderTransactions();
updateChart();

addBtn.addEventListener("click", function () {

    const itemName =
    document.getElementById("itemName").value;

    const amount =
    document.getElementById("amount").value;

    const category =
    document.getElementById("category").value;

    if (!itemName || !amount || !category) {
        alert("Please fill all fields");
        return;
    }

    const transaction = {
        id: Date.now(),
        itemName,
        amount: Number(amount),
        category
    };

    transactions.push(transaction);

    saveToLocalStorage();

    renderTransactions();

    updateChart();

    document.getElementById("itemName").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

});

function renderTransactions() {

    transactionList.innerHTML = "";

    let total = 0;

    transactions.forEach(function(transaction){

        total += transaction.amount;

        const div =
        document.createElement("div");

        div.classList.add("transaction");

        div.innerHTML = `
            <p><strong>${transaction.itemName}</strong></p>
            <p>Rp${transaction.amount}</p>
            <p>${transaction.category}</p>
            <button
            class="deleteBtn"
            onclick="deleteTransaction(${transaction.id})">
            Delete
            </button>
        `;

        transactionList.appendChild(div);

    });

    totalBalance.textContent =
    `Total Spending: Rp${total}`;

}

function deleteTransaction(id){

    transactions =
    transactions.filter(function(transaction){

        return transaction.id !== id;

    });

    saveToLocalStorage();

    renderTransactions();

    updateChart();

}

function saveToLocalStorage(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

function updateChart(){

    const food =
    transactions
    .filter(t => t.category === "Food")
    .reduce((sum,t)=>sum+t.amount,0);

    const transport =
    transactions
    .filter(t => t.category === "Transport")
    .reduce((sum,t)=>sum+t.amount,0);

    const fun =
    transactions
    .filter(t => t.category === "Fun")
    .reduce((sum,t)=>sum+t.amount,0);

    const ctx =
    document
    .getElementById("expenseChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[
                "Food",
                "Transport",
                "Fun"
            ],

            datasets:[{

                data:[
                    food,
                    transport,
                    fun
                ]

            }]

        }

    });

}