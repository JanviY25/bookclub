fetch("books.json")
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById("book-grid");

    data.books.forEach(book => {
      const card = document.createElement("div");
      card.classList.add("card");

      // Star rating logic
      const stars = "⭐".repeat(book.rating) + "☆".repeat(5 - book.rating);

      // Image with optional link
      const imageHTML = book.link
        ? `<a href="${book.link}"><img class="img" src="${book.image}" /></a>`
        : `<img class="img" src="${book.image}" />`;

      card.innerHTML = `
        <div class="image">${imageHTML}</div>
        <div class="copy-2">
          <div class="text-wrapper-6">${book.title}</div>
          <div class="text-wrapper-7">by ${book.author}</div>
          <div class="text-wrapper-8">${stars}</div>
        </div>
      `;

      grid.appendChild(card);
    });
  })
  .catch(error => console.error("Error loading JSON:", error));
