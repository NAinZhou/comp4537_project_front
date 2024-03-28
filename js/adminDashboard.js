const fetchApiUsage = () => {
  fetch("http://127.0.0.1:5000/api/user_usage", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const usageTableBody = document
        .getElementById("usageTable")
        .querySelector("tbody");
      // Clear existing rows
      usageTableBody.innerHTML = "";
      // Check if data is empty
      if (data.length === 0) {
        let row = usageTableBody.insertRow();
        let cell = row.insertCell(0);
        cell.textContent = "No usage data available";
        cell.colSpan = 2;
        cell.style.textAlign = "center";
      } else {
        // Populate table with data
        data.forEach((user) => {
          let row = usageTableBody.insertRow();
          let emailCell = row.insertCell(0);
          let apiCallsCell = row.insertCell(1);
          emailCell.textContent = user.email;
          apiCallsCell.textContent = user.remaining_calls;
        });
      }
    })
    .catch((error) => {
      console.error("Error loading API usage data:", error);
    });
};

window.onload = fetchApiUsage;
