from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import json
import os

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['blbasket']
products_collection = db['products']
users_collection = db['users']
orders_collection = db['orders']

# Sample data for products
sample_products = [
    {
        "id": 1,
        "name": "Handwoven Silk Saree",
        "country": "india",
        "price": 299.99,
        "image": "https://images.unsplash.com/photo-1583391733956-3750b5a1d5e2?w=500",
        "description": "Traditional handwoven silk saree with intricate designs"
    },
    {
        "id": 2,
        "name": "Traditional Kimono Set",
        "country": "japan",
        "price": 249.99,
        "image": "https://images.unsplash.com/photo-1583391733956-3750b5a1d5e2?w=500",
        "description": "Elegant traditional kimono with matching accessories"
    },
    {
        "id": 3,
        "name": "Talavera Pottery",
        "country": "mexico",
        "price": 79.99,
        "image": "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=500",
        "description": "Handcrafted Talavera pottery with vibrant Mexican designs"
    }
]

# Initialize database with sample products if empty
def init_db():
    if products_collection.count_documents({}) == 0:
        products_collection.insert_many(sample_products)
        print("Database initialized with sample products")

# Routes
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    country = request.args.get('country')
    if country and country != 'all':
        products = list(products_collection.find({"country": country}, {'_id': 0}))
    else:
        products = list(products_collection.find({}, {'_id': 0}))
    return jsonify(products)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = products_collection.find_one({"id": product_id}, {'_id': 0})
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.json
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 400
    
    user_id = users_collection.insert_one({
        "name": data['name'],
        "email": data['email'],
        "password": data['password']  # In a real app, hash the password
    }).inserted_id
    
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.json
    user = users_collection.find_one({"email": data['email'], "password": data['password']})
    if user:
        return jsonify({"message": "Login successful", "user_id": str(user['_id'])})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    order_id = orders_collection.insert_one({
        "user_id": data['user_id'],
        "items": data['items'],
        "total": data['total'],
        "status": "pending",
        "shipping_address": data['shipping_address']
    }).inserted_id
    
    return jsonify({"message": "Order created successfully", "order_id": str(order_id)}), 201

@app.route('/api/orders/<user_id>', methods=['GET'])
def get_user_orders(user_id):
    orders = list(orders_collection.find({"user_id": user_id}, {'_id': 0}))
    return jsonify(orders)

# Initialize database on startup
init_db()

if __name__ == '__main__':
    app.run(debug=True) 