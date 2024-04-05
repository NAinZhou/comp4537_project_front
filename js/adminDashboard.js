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
        cell.colSpan = 4; // Update colspan to accommodate additional columns
        cell.style.textAlign = "center";
      } else {
        // Populate table with data
        data.forEach((user) => {
          let row = usageTableBody.insertRow();
          let idCell = row.insertCell(0); 
          let emailCell = row.insertCell(1);
          let roleCell = row.insertCell(2); 
          let apiCallsCell = row.insertCell(3);
          idCell.textContent = user.ID; 
          emailCell.textContent = user.email;
          roleCell.textContent = user.role; 
          apiCallsCell.textContent = user.remaining_calls;
        });
      }
    })
    .catch((error) => {
      console.error("Error loading API usage data:", error);
    });
};

window.onload = fetchApiUsage;
