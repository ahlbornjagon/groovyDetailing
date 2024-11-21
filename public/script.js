document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form
  emailjs.init({
    publicKey: "cY9rH6Rjv4Rwp5ey1",
  });  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Collect form data
      const name = document.querySelector("#name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const message = document.querySelector("#message").value.trim();

      if (!name || !email || !message) {
        alert("All fields are required.");
        return;
      }

      // Send email via EmailJS
      emailjs.send("service_8cgxrui", "template_oy4ipfq", {
        from_name: name,
        from_email: email,
        message: message,
      })
      .then(function(response) {
        alert("Message sent successfully!");
        form.reset(); // Reset the form after successful submission
      }, function(error) {
        alert("Failed to send message. Please try again.");
        console.error("EmailJS error:", error);
      });
    });
  } else {
    console.error("Form with class 'contact-form' not found in the DOM.");
  }

  const hamburger = document.getElementById("hamburger");
  const navContainer = document.getElementById("nav-container");

  // Ensure the elements exist before proceeding
  if (hamburger && navContainer) {
    hamburger.addEventListener("click", () => {
      // Toggle the 'active' class on the nav-container
      navContainer.classList.toggle("active");
    });
  } else {
    console.error("Hamburger or nav-container not found in the DOM.");
  }

});
