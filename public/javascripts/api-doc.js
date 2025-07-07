document.addEventListener('DOMContentLoaded', () => {
    const ui = SwaggerUIBundle({
      url: '/api-doc.yaml',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
      ],
      layout: "BaseLayout"
    });
});