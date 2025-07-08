document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseName = document.getElementById("expense-name");
  const expenseAmount = document.getElementById("expense-amount");
  const expenseHeadingTag = document.getElementById("expense-heading");
  const displayExpenseList = document.getElementById("expense-list");
  const displayExpenseTotalDiv = document.getElementById("total");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expense")) || [];
  let totalAmount = calculateTotal();
  renderExpense();

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value.trim());

    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name,
        amount,
      };
      expenses.push(newExpense);
      saveTotalToLocal();
      renderExpense();
      updateTotal();
    }

    expenseName.value = "";
    expenseAmount.value = "";
  });

  function renderExpense() {
    displayExpenseList.innerHTML = "";
    if (expenses.length > 0) {
      expenseHeadingTag.classList.remove("hidden");
      displayExpenseTotalDiv.classList.remove("hidden");
      expenses.forEach((expense) => {
        const li = document.createElement("li");
        li.classList.add(
          "m-1",
          "bg-green-900",
          "rounded-md",
          "p-3",
          "w-full",
          "flex",
          "justify-between",
          "items-center"
        );
        li.innerHTML = `<span class="text-white">${
          expense.name
        } - $${expense.amount.toFixed(2)}</span>
                      <button data-id="${
                        expense.id
                      }" class="bg-white hover:bg-gray-300 text-green-900 p-2 rounded-md">Delete</button>`;
        displayExpenseList.appendChild(li);
      });
    } else {
      expenseHeadingTag.classList.add("hidden");
      displayExpenseTotalDiv.classList.add("hidden");
    }

    // ✅ Add this to always show updated total
    updateTotal();
  }

  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  function saveTotalToLocal() {
    localStorage.setItem("expense", JSON.stringify(expenses));
  }

  displayExpenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      expenses = expenses.filter((expense) => expense.id !== expenseId);
      saveTotalToLocal();
      renderExpense();
      updateTotal();
    }
  });
});
