class Registration {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (event) =>
      this.handleRegistration(event)
    );
  }

  handleRegistration(event) {
    event.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    fetch("	https://4537a01326006groupproject.online/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.message.includes("successfully")) {
          document.getElementById("registrationForm").reset();
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}

new Registration("registrationForm");
