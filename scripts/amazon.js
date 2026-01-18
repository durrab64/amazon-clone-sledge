import { products } from "../data/products.js";
import { addToCart, getCartQuantity } from "../data/cart.js";

let productHtml = '';

products.forEach((product) => {
  productHtml += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-function-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-product-grid').innerHTML = productHtml;

// Object to store timeout IDs so we can clear them if the user clicks quickly
const addedMessageTimeouts = {};

document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      // 1. Get the Product ID
      const { productId } = button.dataset;

      // 2. Get the specific quantity from the dropdown
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const quantityToAdd = Number(quantitySelector.value);

      // 3. Call the imported function to update the data
      addToCart(productId, quantityToAdd);

      // 4. Update the cart quantity in the top right corner
      updateCartQuantity();

      // 5. Show the "Added" message with the timeout logic
      showAddedMessage(productId);
    });
  });

// Helper function to update the cart count in the DOM
function updateCartQuantity() {
  const cartQuantity = getCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// Helper function to handle the "Added" message animation
function showAddedMessage(productId) {
  const addedMessage = document.querySelector(
    `.js-added-function-${productId}`
  );

  addedMessage.classList.add('added-function-visible');

  // Check if there is a previous timeout for this product and clear it
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  // Set a new timeout to hide the message after 2 seconds
  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove('added-function-visible');
  }, 2000);

  // Save this timeout ID
  addedMessageTimeouts[productId] = timeoutId;
}