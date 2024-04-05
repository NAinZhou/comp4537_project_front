// frontend JavaScript code (adminDashboard.js)

// Function to handle form submission for updating user information
const updateUser = (userId, emailCell, roleCell, apiCallsCell) => {
  const newEmail = prompt("Enter new email:", emailCell.textContent);
  const newRole = prompt("Enter new role (admin/regular):", roleCell.textContent);
  const newApiCalls = parseInt(prompt("Enter new API calls:", apiCallsCell.textContent));

  const token = localStorage.getItem("token"); // Retrieve the stored token

  fetch(`https://4537a01326006groupproject.online/api/update_user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, // Include the token in the Authorization header
    },
    body: JSON.stringify({ email: newEmail, role: newRole, api_calls: newApiCalls }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      alert(data.message); // Display success or error message
      fetchApiUsage(); // Reload the user usage data
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
};

const fetchApiUsage = () => {
  fetch("https://4537a01326006groupproject.online/api/user_usage", {
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
      const usageTable = document.getElementById("usageTable");

      // Clear existing rows and headers
      usageTable.innerHTML = "";

      // Check if data is empty
      if (data.length === 0) {
        let row = usageTable.insertRow();
        let cell = row.insertCell(0);
        cell.textContent = "No usage data available";
        cell.colSpan = 5; // Update colspan to accommodate additional columns
        cell.style.textAlign = "center";
      } else {
        // Populate table with data
        const keys = Object.keys(data[0]); // Extract keys from the first user object

        // Add column headers if not already added
        if (!usageTable.querySelector("thead")) {
          const thead = usageTable.createTHead();
          const headerRow = thead.insertRow();
          keys.forEach((key) => {
            let headerCell = document.createElement("th");
            headerCell.textContent = key.toUpperCase(); // Convert to uppercase for consistency
            headerRow.appendChild(headerCell);
          });
        }

        const tbody = usageTable.createTBody();

        // Add user data
        data.forEach((user) => {
          let row = tbody.insertRow();
          keys.forEach((key) => {
            let cell = row.insertCell();
            cell.textContent = user[key];
          });

          // Add edit button
          let editCell = row.insertCell();
          let editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            // Replace text content with input fields for editing
            keys.forEach((key) => {
              row.querySelector(`td[data-key="${key}"]`).innerHTML = `<input type="text" value="${user[key]}" />`;
            });

            // Add save button for updating the user information
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", () => {
              const updatedUser = {};
              keys.forEach((key) => {
                updatedUser[key] = row.querySelector(`input[data-key="${key}"]`).value;
              });
              updateUser(user.ID, updatedUser);
            });
            editCell.appendChild(saveButton);
          });
          editCell.appendChild(editButton);
        });
      }
    })
    .catch((error) => {
      console.error("Error loading API usage data:", error);
    });
};

window.onload = fetchApiUsage;
