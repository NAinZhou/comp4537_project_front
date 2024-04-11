
// Call the checkAuthorization function when the page loads
window.onload = function () {
  checkAuthorization();
};

function checkAuthorization() {
  const token = localStorage.getItem("token"); // Retrieve the stored token
  if (!token) {
    window.location.href = "https://mycleintapiconsumer.netlify.app/"; // Redirect to index.html if token is not available
  }
}

checkAuthorization();

// Function to handle form submission for updating user information
const updateUser = (userId, updatedUser) => {
  const token = localStorage.getItem("token"); // Retrieve the stored token

  fetch(`https://4537a01326006groupproject.online/api/update_user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, // Include the token in the Authorization header
    },
    body: JSON.stringify(updatedUser),
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
      const usageTable = document.getElementById("usageTable").querySelector("tbody");

      // Clear existing rows
      usageTable.innerHTML = "";

      // Check if data is empty
      if (data.length === 0) {
        let row = usageTable.insertRow();
        let cell = row.insertCell(0);
        cell.textContent = "No usage data available";
        cell.colSpan = 7; // Update colspan to accommodate additional columns
        cell.style.textAlign = "center";
      } else {
        // Populate table with data
        const keys = Object.keys(data[0]); // Extract keys from the first user object

        // Add user data
        data.forEach((user) => {
          let row = usageTable.insertRow();
          keys.forEach((key, index) => {
            // Check if the key is 'ID' to decide whether to create an input field or just display the value
            if (key !== 'ID') {
              let cell = row.insertCell(index);
              // Create input fields for 'Email', 'Api Calls', and dropdown for 'Role'
              if (key === 'Email') {
                cell.innerHTML = `<input type="email" value="${user[key]}" data-key="${key}" />`;
              } else if (key === 'Api Calls') {
                cell.innerHTML = `<input type="number" min="0" value="${user[key]}" data-key="${key}" />`;
              } else if (key === 'Role') {
                let select = document.createElement("select");
                select.setAttribute('data-key', key);
                let option1 = document.createElement("option");
                option1.value = "regular";
                option1.textContent = "Regular";
                let option2 = document.createElement("option");
                option2.value = "admin";
                option2.textContent = "Admin";
                select.appendChild(option1);
                select.appendChild(option2);
                select.value = user[key];
                cell.appendChild(select);
              } else {
                cell.textContent = user[key];
              }
            } else {
              // Display user ID without allowing editing
              let cell = row.insertCell(index);
              cell.textContent = user[key];
            }
          });

          // Add edit button
          let editCell = row.insertCell();
          let editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            // Replace text content with input fields for editing
            keys.forEach((key, index) => {
              // Allow editing only for 'Email', 'Api Calls', and 'Role' fields
              if (key !== 'ID') {
                if (key === 'Role') {
                  row.cells[index].innerHTML = `<select data-key="${key}">
                                                    <option value="regular">Regular</option>
                                                    <option value="admin">Admin</option>
                                                </select>`;
                  row.cells[index].querySelector('select').value = user[key];
                } else {
                  row.cells[index].innerHTML = `<input type="${key === 'Api Calls' ? 'number' : 'text'}" value="${user[key]}" data-key="${key}" />`;
                }
              }
            });

                                    // Add delete button
            let deleteCell = row.insertCell();
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.backgroundColor = "red";
            deleteButton.style.color = "white";
            deleteButton.addEventListener("click", () => {
                if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
                    fetch(`https://4537a01326006groupproject.online/api/delete_user/${user.ID}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert(data.message);
                        fetchApiUsage(); // Refresh the list to reflect the deletion
                    })
                    .catch(error => {
                        console.error("Fetch error:", error);
                    });
                }
            });
            deleteCell.appendChild(deleteButton);
            
            // Add save button for updating the user information
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", () => {
              const updatedUser = {};
              keys.forEach((key, index) => {
                // Allow updating only for 'Email', 'Api Calls', and 'Role' fields
                if (key !== 'ID') {
                  // Validate and parse 'Api Calls' to ensure it's a positive integer
                  if (key === 'Api Calls') {
                    const apiCallsInput = row.cells[index].querySelector("input");
                    const apiCallsValue = parseInt(apiCallsInput.value);
                    if (!isNaN(apiCallsValue) && apiCallsValue >= 0) {
                      updatedUser[key] = apiCallsValue;
                    } else {
                      alert("API Calls must be a positive integer.");
                      return;
                    }
                  } else if (key === 'Role') {
                    updatedUser[key] = row.cells[index].querySelector("select").value;
                  } else {
                    updatedUser[key] = row.cells[index].querySelector("input").value;
                  }
                }
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

document.getElementById("documentationButton").addEventListener("click", function () {
  window.location.href = "swaggerDocs.html";
});

window.onload = fetchApiUsage;