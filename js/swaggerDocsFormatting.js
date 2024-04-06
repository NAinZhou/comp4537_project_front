        function displaySwaggerUI() {
            fetch('https://4537a01326006groupproject.online/API/v1/docs') // Make a GET request to the Flask endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the response as JSON
            })
            .then((data) => {
                const ui = SwaggerUIBundle({
                    spec: data, // Provide the documentation data to Swagger UI
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "BaseLayout"
                });
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
        }

        // Call the function to display Swagger UI when the page loads
        displaySwaggerUI();
