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
        cell.colSpan = 5; // Update colspan to accommodate additional columns
        cell.style.textAlign = "center";
      } else {
        // Populate table with data
        data.forEach((user) => {
          let row = usageTableBody.insertRow();
          let idCell = row.insertCell(0); 
          let emailCell = row.insertCell(1);
          let roleCell = row.insertCell(2); 
          let apiCallsCell = row.insertCell(3);
          let editCell = row.insertCell(4); // Cell for edit button
          idCell.textContent = user.ID; 
          emailCell.textContent = user.email;
          roleCell.textContent = user.role; 
          apiCallsCell.textContent = user.remaining_calls;
          // Add edit button
          let editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            // Replace text content with input fields for editing
            emailCell.innerHTML = `<input type="text" value="${user.email}" />`;
            roleCell.innerHTML = `<input type="text" value="${user.role}" />`;
            apiCallsCell.innerHTML = `<input type="number" value="${user.remaining_calls}" />`;
            // Add save button for updating the user information
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", () => {
              updateUser(user.ID, emailCell.firstChild, roleCell.firstChild, apiCallsCell.firstChild);
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
