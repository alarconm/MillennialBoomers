document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("theme-toggle-button");
  const loadingElement = document.getElementById("loading");  // Get the loading element

  // Handle theme toggle button click
  themeToggleButton.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("matrix");
    } else if (document.body.classList.contains("matrix")) {
      document.body.classList.remove("matrix");
    } else {
      document.body.classList.add("dark");
    }
  });

  // Show loading spinner/text
  loadingElement.style.display = "block";

  // Fetch data from API
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      // Hide loading spinner/text
      loadingElement.style.display = "none";

      // Process and display data
      const walletData = data.wallet_data;
      const tokenData = data.token_data;
      const algoTokens = data.algo_tokens;

      const walletContainer = document.getElementById("wallet-container");

      walletData.forEach((wallet) => {
        const walletDiv = document.createElement("div");
        walletDiv.classList.add("wallet");

        const walletHeader = document.createElement("h2");
        walletHeader.textContent = `${wallet.network.toUpperCase()} Wallet`;
        walletDiv.appendChild(walletHeader);

        const walletTable = document.createElement("table");

        const walletBalanceRow = document.createElement("tr");
        const walletBalanceLabel = document.createElement("td");
        walletBalanceLabel.textContent = "Balance:";
        const walletBalanceValue = document.createElement("td");
        walletBalanceValue.textContent = `${wallet.balance.toFixed(4)} (${wallet.value.toFixed(2)} USD)`;
        walletBalanceRow.appendChild(walletBalanceLabel);
        walletBalanceRow.appendChild(walletBalanceValue);
        walletTable.appendChild(walletBalanceRow);

        if (wallet.network === "algorand") {
          Object.entries(tokenData).forEach(([symbol, token]) => {
            if (algoTokens.indexOf(symbol) !== -1) {
              const tokenRow = document.createElement("tr");
              const tokenLabel = document.createElement("td");
              tokenLabel.textContent = `${symbol.toUpperCase()}:`;
              const tokenValue = document.createElement("td");
              tokenValue.textContent = `${token.balance.toFixed(4)} (${token.value.toFixed(2)} USD)`;
              tokenRow.appendChild(tokenLabel);
              tokenRow.appendChild(tokenValue);
              walletTable.appendChild(tokenRow);
            }
          });
        }

        if (wallet.network === "ethereum") {
          Object.entries(tokenData).forEach(([symbol, token]) => {
            if (symbol !== "eth") {
              const tokenRow = document.createElement("tr");
              const tokenLabel = document.createElement("td");
              tokenLabel.textContent = `${symbol.toUpperCase()}:`;
              const tokenValue = document.createElement("td");
              tokenValue.textContent = `${token.balance.toFixed(4)} (${token.value.toFixed(2)} USD)`;
              tokenRow.appendChild(tokenLabel);
              tokenRow.appendChild(tokenValue);
              walletTable.appendChild(tokenRow);
            }
          });
        }

        walletDiv.appendChild(walletTable);
        walletContainer.appendChild(walletDiv);
      });
    })
    .catch((error) => {
      // Hide loading spinner/text even if there is an error
      loadingElement.style.display = "none";
      console.error("There was a problem with the fetch operation:", error);
    });
});
