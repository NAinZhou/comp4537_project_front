document
  .getElementById("text-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const textInput = document.getElementById("text-input").value;
    const token = localStorage.getItem("token"); // Retrieve the stored token

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

  document.getElementById("documentationButton").addEventListener("click", function () {
    window.location.href = "swaggerDocs.html";
  });