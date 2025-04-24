# Marcus's Bicycle Shop API

This project implements an e-commerce platform allowing customers to browse, customize, and purchase products, and empowers store managers to configure products, inventory, and pricing rules through an administrative dashboard.

---

## Table of Contents

#### Setup

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Running the Application](#running-the-application)
5. [Docker Setup](#docker-setup)
6. [Compile and run the project](#compile-and-run-the-project)
7. [Database Seeding](#database-seeding)
8. [Testing](#testing)
9. [Consume APIs](#consume-apis)

#### Project Documentation

1. [Task](#task)
2. [Main User Actions](#main-user-actions)
3. [Product Page](#product-page)
   * [UI Presentation](#ui-presentation)
   * [Option Availability](#option-availability)
   * [Price Calculation](#price-calculation)
4. [Shopping Cart](#shopping-cart)
   * [Adding Items to Cart](#adding-items-to-cart)
   * [Viewing and Managing Cart](#viewing-and-managing-cart)
5. [Administrator Workflows](#administrator-workflows)
   * [Store Management](#store-management)
   * [Creating New Products](#creating-new-products)
   * [Managing Product Options](#managing-product-options)
   * [Pricing Strategies](#pricing-strategies)
6. [Database Overview](#database-overview)
7. [API Endpoints](#api-endpoints)

---
# Setup

## Tech Stack

* **Runtime & Framework:** Node.js, NestJS, TypeScript
* **Database:** PostgreSQL
* **Containerization:** Docker, Docker Compose
* **Testing:** Jest (unit), Supertest (integration)


## Prerequisites

* **Docker** & **Docker Compose**
* **Node.js** v20 or higher [Suggested version is v22]
* **nvm**
* **npm**


## Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your configuration (DB credentials, ports, JWT secrets, etc.).


## Running the Application

### Docker Setup

Build and launch services in one command:

```bash
docker-compose up --build -d
```

To stop:

```bash
docker-compose down
```

### [Optional] Install and use Node using nvm

1. Switch the active Node.js version in `.nvmrc`:

   ```bash
   nvm use
   ```
2. Install Node:

   ```bash
   nvm install
   ```


### Compile and run the project

1. Install dependencies:

   ```bash
   npm install
   ```
2. Start in development mode:

   ```bash
   npm run dev
   ```

#### Production Mode

```bash
npm run build
npm run start
```

---

## Database Seeding

Seed the database with initial data:

```bash
npm run seed
```

---

## Testing

* **Unit Tests:**

  ```bash
  npm run test:unit
  ```
* **Integration Tests:**

  ```bash
  npm run test:integration
  ```
* **All Tests:**

  ```bash
  npm run test:all
  ```

## Consume APIs
clone [FE](https://github.com/m4s0/factorial-coding-challenge-fe) repo and follow README.md

```bash
git clone git@github.com:m4s0/factorial-coding-challenge-fe.git
```

---
# Project Documentation

# Task
You're tasked with building a website that allows Marcus, a bicycle shop owner, to sell his bicycles. Marcus owns a growing business and now wants to sell online. He also tells you that bicycles are his main product, but if the business continues to grow, he will surely start selling other sports-related items such as skis, surfboards, roller skates, etc. It would be a nice bonus if the same website allowed him to sell those things as well. What makes Marcus's business successful is that customers can fully customize their bicycles. They can select many different options for the various parts of the bicycle. Here is an incomplete list of all the parts and their possible choices, to give an example:

- Frame type: Full-suspension, diamond, step-through
- Frame finish: Matte, shiny
- Wheels: Road wheels, mountain wheels, fat bike wheels
- Rim color: Red, black, blue
- Chain: Single-speed chain, 8-speed chain


On top of that, Marcus points out that some combinations are prohibited because they are not possible in reality. For example:
- If you select "mountain wheels," then the only frame available is the full-suspension.
- If you select "fat bike wheels," then the red rim color is unavailable because the manufacturer doesn't provide it.


Additionally, Marcus sometimes doesn't have all possible variations of each part in stock, so he wants to be able to mark them as "temporarily out of stock" to avoid receiving orders he can't fulfill. Finally, Marcus explains how to calculate the price that you should present to the customer after customizing a bicycle. Normally, this price is calculated by adding up the individual prices of each selected part. For example:

- Full suspension = 130 EUR
- Shiny frame = 30 EUR
- Road wheels = 80 EUR
- Rim color blue = 20 EUR
- Chain: Single-speed chain = 43 EUR


- Total price: 130 + 30 + 80 + 20 + 43 = 303 EUR

However, the price of some options might depend on others. For instance, the frame finish is applied over the whole bicycle, so the more area to cover, the more expensive it gets. Because of that, the matte finish over a full-suspension frame costs 50 EUR, while applied over a diamond frame it costs 35 EUR. These kinds of variations can always happen, and they might depend on any of the other choices, so Marcus asks you to consider this, as otherwise, he would be losing money.


## Main User Actions

1. **Browse Products**
   Navigate product categories or search for specific items.
2. **View Product Details**
   Inspect detailed descriptions, available customization options, and current pricing.
3. **Customize Product**
   Select options (e.g., color, frame type) to tailor the product.
4. **Add to Cart**
   Add configured products to your shopping cart.
5. **View and Manage Cart**
   Review items in the cart, adjust quantities, or remove products.

---

## Product Page

### UI Presentation

* **Product Name & Description**: Clear title and descriptive summary.
* **Option Selectors**: Grouped by category (e.g., Frame Type, Rim Color).
* **Dynamic Pricing**: Base price displayed and updates live as options change.

### Option Availability

1. **Fetch Options**: Retrieve all `OptionGroups` and their `ProductOptions` for the product.
2. **Apply Business Rules**: Use `OptionRules` to enable or disable options based on current selections.

### Price Calculation

1. **Base Price**: Start with the product’s `basePrice`.
2. **Option Modifiers**: Add `additionalPrice` for each selected `ProductOption`.
3. **Special Rules**: Check `OptionPriceRules` to apply combination-based price adjustments.

---

## Shopping Cart

### Adding Items to Cart

When a user clicks **Add to Cart**:

1. **Cart Initialization**: Create a `Cart` record for the user if none exists.
2. **CartItem Creation**: Add a `CartItem` linked to the chosen product and calculate `itemPrice`.
3. **Option Selections**: Record each selected option in `CartItemOptions`.

#### Persistence

* **Carts**: Stores overall cart per user.
* **CartItems**: Tracks individual products, quantities, and prices.
* **CartItemOptions**: Maps items to their chosen customization options.

### Viewing & Managing Cart

* Update quantities or remove items in real time.
* Recalculate totals on any change.

---

## Administrator Workflows

Accessible via a secure dashboard for users with manager roles.

### Store Management

* **Product Management**: Create, edit, or delete products and categories.
* **Inventory Control**: Update stock levels at the option level.
* **Pricing Configuration**: Define base prices and option-based price rules.

### Creating New Products

**UI Workflow**:
1. **Create new Product** in the dashboard filling these values:

   * Name, description, base price, and category.

**Database Changes**:

* Add record in `Products`.
* Link to `ProductCategories`.
* Initialize inventory in `InventoryItems`.

### Managing Product Options

To add a new customization choice:

**UI Workflow**:

1. **Select Option Group** in the dashboard.
2. **Add New Option**:

   * Name, display name, additional price, and status.

**Database Changes**:

* Create `ProductOption` and corresponding `InventoryItem`.
* Optionally add entries in `OptionPriceRules` or `OptionRules` if needed.

### Pricing Strategies

#### Single-Option Updates

**UI Workflow**:

* Edit the `basePrice` of an existing `ProductOption` directly.

**Database Changes**:
**Update `ProductOption`**.

#### Combination-Based Rules

**UI Workflow**:

1. **Navigate to Price Rules**.
2. **Define Rule**:

   * Select target and dependent options.
   * Specify price modifier.

**Database Changes**:
**Save to `OptionPriceRules`**.

---

## Database Overview

| Table                    | Purpose                                                                |
|--------------------------|------------------------------------------------------------------------|
| `Products`               | Main products (bicycles, and in the future, other items).              |
| `ProductCategories`      | Grouping of products (mountain bikes, road bikes, etc.).               |
| `ProductOptionGroups`    | Groups of options for a product (frame types, wheels, etc.).           |
| `ProductOptions`         | Individual options within a group (diamond frame, matte finish, etc.). |
| `OptionRules`            | Rules governing option availability.                                   |
| `OptionPriceRules`       | Dynamic pricing rules for combinations of options.                     |
| `InventoryItems`         | Stock levels for each option.                                          |
| `Carts`                  | Active shopping carts per user.                                        |
| `CartItems`              | Items within a cart, with prices and quantities.                       |
| `CartItemOptions`        | Links cart items to selected options.                                  |

## Database Schema
[public.png](public.png) contains the db schema

## API Endpoints

### Auth

- `POST /auth/login` – User authentication
- `POST /auth/register` – User registration

### Cart

- `GET /cart` – Get user cart
- `POST /cart/items` – Add item to cart
- `DELETE /cart/items/:itemId` – Delete item from cart
- `PATCH /cart/items/:itemId` – Update item quantity

### Inventory

- `GET /inventory/product/:productId` – Get product inventory
- `PATCH /inventory/option/:optionId` – Update option inventory

### Product Categories

- `GET /product-categories/:categoryId` – Get specific category
- `GET /product-categories` – Get all categories
- `POST /product-categories` – Create category
- `PATCH /product-categories/:categoryId` – Update category
- `DELETE /product-categories/:categoryId` – Delete category

### Product Options

- `GET /product-options/:optionId` – Get specific ProductOption
- `GET /product-options` – Get all ProductOptions
- `POST /product-options` – Create ProductOption
- `PATCH /product-options/:optionId` – Update ProductOption
- `DELETE /product-options/:optionId` – Delete ProductOption

### Product Option Groups

- `GET /product-option-groups/:optionId` – Get specific ProductOptionGroup
- `GET /product-option-groups` – Get all ProductOptionGroups
- `GET /product-option-groups/product/:productId` – Get ProductOptionGroups by product
- `POST /product-option-groups` – Create ProductOptionGroup
- `PATCH /product-option-groups/:optionId` – Update ProductOptionGroup
- `DELETE /product-option-groups/:optionId` – Delete ProductOptionGroup

### Products

- `GET /products` – Get all products
- `GET /products/:productId` – Get specific product
- `GET /products/:productId/with-options` – Get product with options
- `GET /products/:productId/configure` – Get product configuration
- `GET /products/:productId/validate` – Validate product configuration
- `GET /products/:productId/price` – Get product price
- `POST /products` – Create product
- `PATCH /products/:productId` – Update product
- `DELETE /products/:productId` – Delete product  
