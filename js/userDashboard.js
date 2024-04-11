// Check if the user is authorized before making the API call
function checkAuthorization() {
  const token = localStorage.getItem("token"); // Retrieve the stored token
  if (!token) {
  window.location.href = "https://mycleintapiconsumer.netlify.app/"; // Redirect to index.html if token is not available
  }
  }
  
  // Call the checkAuthorization function when the page loads
  window.onload = function () {
  checkAuthorization();
  };
  
  // Add an event listener to the form submission
  document.getElementById("text-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  const textInput = document.getElementById("text-input").value;
  const token = localStorage.getItem("token"); // Retrieve the stored token
  
  // Check authorization before making the API call
  checkAuthorization();
  
  fetch("https://4537a01326006groupproject.online/api_call", {
  // Use HTTPS
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: "Bearer " + token, // Include the token in the Authorization header
  },
  body: JSON.stringify({ text: textInput }),
  })
  .then((response) => {
  if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json(); // Parse the response as JSON
  })
  .then((data) => {
  // Display the generated text and remaining API calls
  document.getElementById("response-container").textContent =
  data.generated_text || "No response text";
  document.getElementById(
  "remaining-calls"
  ).textContent = `Remaining API calls: ${data.remaining_calls}`;
  })
  .catch((error) => {
  console.error("Fetch error:", error);
  });
  });
  
  // Add an event listener to the documentation button
  document.getElementById("documentationButton").addEventListener("click", function () {
  window.location.href = "swaggerDocs.html";
  });