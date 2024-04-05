class ForgotPassword {
  constructor(forgotPasswordLinkId) {
    this.forgotPasswordLink = document.getElementById(forgotPasswordLinkId);
    this.init();
  }

  init() {
    if (this.forgotPasswordLink) {
      this.forgotPasswordLink.addEventListener("click", (event) =>
        this.promptForEmail(event)
      );
    }
  }

  promptForEmail(event) {
    event.preventDefault(); // Prevent the default link behavior
    const userEmail = prompt(
      "Please enter your email address to receive password reset instructions:"
    );
    if (userEmail) {
      this.sendResetRequest(userEmail);
    }
  }

  sendResetRequest(email) {
    fetch("http://127.0.0.1:5000/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send reset request");
        }
        return response.json();
      })
      .then((data) => {
        alert(
          "If the email is registered, you will receive password reset instructions shortly."
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was a problem with your request. Please try again.");
      });
  }
}

// Initialize the ForgotPassword class when the document is ready
// Make sure to replace 'forgotPassword' with the actual ID of your "Forgot Password?" link.
document.addEventListener("DOMContentLoaded", (event) => {
  new ForgotPassword("forgotPassword");
});
