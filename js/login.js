class Login {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (event) => this.handleLogin(event));
  }

  handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Change to HTTPS if your local setup supports it, or keep HTTP for local testing but ensure to use HTTPS in production.
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Login failed");
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          // Check if the role is received correctly and redirect based on the role
          if (email === "admin@admin.com") {
            window.location.href = "adminDashboard.html";
          } else {
            window.location.href = "userDashboard.html";
          }
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}

new Login("loginForm");
