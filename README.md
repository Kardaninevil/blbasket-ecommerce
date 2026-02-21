# BLbasket E-commerce Backend

A simple Python backend with MongoDB for the BLbasket e-commerce website.

## Prerequisites

- Python 3.7 or higher
- MongoDB 4.4 or higher
- pip (Python package manager)

## Setup Instructions

1. **Install MongoDB**:
   - Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Start the MongoDB service

2. **Set up Python environment**:
   ```bash
   # Create a virtual environment (optional but recommended)
   python -m venv venv
   
   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the API**:
   - The API will be available at http://localhost:5000
   - API endpoints:
     - GET /api/products - Get all products
     - GET /api/products?country=india - Get products by country
     - GET /api/products/1 - Get product by ID
     - POST /api/users/register - Register a new user
     - POST /api/users/login - Login a user
     - POST /api/orders - Create a new order
     - GET /api/orders/{user_id} - Get orders for a user

## Frontend Integration

To integrate this backend with the existing frontend:

1. Move all HTML, CSS, and JavaScript files to a `static` folder
2. Update the JavaScript code to fetch data from the API endpoints instead of using hardcoded data
3. Example API call:
   ```javascript
   fetch('http://localhost:5000/api/products')
     .then(response => response.json())
     .then(data => {
       // Process the data
       console.log(data);
     });
   ```

## Notes

- This is a simple implementation for a semester assignment
- In a production environment, you would need to add proper security measures, error handling, and data validation
- Passwords are stored in plain text for simplicity; in a real application, they should be hashed 