from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)   # Enable CORS for all routes

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'Suds2uds$uds'  # replace with your MySQL password
app.config['MYSQL_DB'] = 'sudsudbms'  # replace with your database name

mysql = MySQL(app)

@app.route('/', methods=['GET'])
def home():
    return 'Flask server is running!', 200

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if both email and password are provided
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    cur = mysql.connection.cursor()
    try:
        # Fetch the admin's hashed password from the database
        cur.execute("SELECT password FROM admin WHERE email = %s", (email,))
        admin = cur.fetchone()

        if admin:
            stored_hashed_password = admin[0]
            # Check if provided password matches the stored hashed password
            if check_password_hash(stored_hashed_password, password):
                return jsonify({'message': 'Admin login successful!'}), 200
            else:
                print("Password does not match.")
                return jsonify({'error': 'Invalid email or password'}), 401
        else:
            print("Admin with this email not found.")
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        print("Database error:", e)
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

# Add Product Route
@app.route('/api/admin/add-product', methods=['POST'])
def add_product():
    data = request.json
    name = data.get('name')
    image_link = data.get('image_link')
    category_id = data.get('category_id')
    price_per_week = data.get('price_per_week', 0.0)
    price_per_day = data.get('price_per_day', 0.0)
    quantity = data.get('quantity', 0)

    cur = mysql.connection.cursor()
    try:
        # Check if the product already exists
        cur.execute("SELECT product_id, is_active FROM product WHERE name = %s", (name,))
        existing_product = cur.fetchone()
        print(existing_product)

        if existing_product:
            product_id, is_active = existing_product
            if is_active == 0:
                # If product is inactive, update the product details
                cur.execute("""
                    UPDATE product
                    SET image_link = %s, category_id = %s, price_per_week = %s, price_per_day = %s, quantity = %s, is_active=%s
                    WHERE product_id = %s
                """, (image_link, category_id, price_per_week, price_per_day, quantity, 1, product_id))
                mysql.connection.commit()
                return jsonify({'message': 'Product updated successfully'}), 200
            else:
                return jsonify({'error': 'Product already exists and is active, cannot update.'}), 400
        else:
            # If the product does not exist, insert a new product
            print(name, image_link, category_id, price_per_week, price_per_day, quantity)
            cur.execute("""
                INSERT INTO product (name, image_link, category_id, price_per_week, price_per_day, quantity)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, image_link, category_id, price_per_week, price_per_day, quantity))
            mysql.connection.commit()
            return jsonify({'message': 'Product added successfully'}), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()



# Remove Product Route
@app.route('/api/admin/remove-product/<int:product_id>', methods=['DELETE'])
def remove_product(product_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("UPDATE product SET is_active = FALSE WHERE product_id = %s", (product_id,))
        mysql.connection.commit()
        if cur.rowcount == 0:
            return jsonify({'message': 'Product not found'}), 404
        return jsonify({'message': 'Product marked as inactive successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()







@app.route('/api/admin/most-rented-products', methods=['GET'])
def most_rented_products():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT product_id, name, rent_count FROM most_rented_products_view")
    results = cursor.fetchall()

    # Convert results to dictionaries
    result_list = []
    for row in results:
        result_list.append({
            'product_id': row[0],
            'name': row[1],
            'rent_count': row[2]
        })

    return jsonify(result_list), 200

@app.route('/api/admin/add-employee', methods=['POST'])
def add_employee():
    data = request.json
    name = data.get('name')
    salary = data.get('salary', 0.0)
    contact_number = data.get('contact_number')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO employee (name, salary, contact_number)
        VALUES (%s, %s, %s)
    """, (name, salary, contact_number))
    mysql.connection.commit()

    return jsonify({'message': 'Employee added successfully'}), 201



# Remove employee
@app.route('/api/admin/remove-employee/<int:employee_id>', methods=['DELETE'])
def remove_employee(employee_id):
    print(employee_id)
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("DELETE FROM employee WHERE id = %s", (employee_id,))
        mysql.connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': 'Employee not found'}), 404
        return jsonify({'message': 'Employee removed successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cursor.close()

@app.route('/api/signup', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    hashed_password = generate_password_hash(password)

    cur = mysql.connection.cursor()
    try:
        cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password))
        mysql.connection.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user and check_password_hash(user[0], password):
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

# New API to fetch products by category
# Get Products by Category with is_active check
@app.route('/api/products/<category_id>', methods=['GET'])
def get_products_by_category(category_id):
    cur = mysql.connection.cursor()
    try:
        # Include the 'quantity' field in the query
        cur.execute("""
            SELECT product_id, name, image_link, price_per_day, quantity
            FROM Product 
            WHERE category_id = %s AND is_active = 1
        """, (category_id,))
        products = cur.fetchall()

        # Add the quantity field to the response
        product_list = [{
            'id': product[0],
            'name': product[1],
            'image': product[2],
            'price_per_day': product[3],
            'quantity': product[4]  # Include quantity here
        } for product in products]
        
        return jsonify(product_list), 200
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()




# Stored Procedure: Create Transaction
@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    order_id = data.get('order_id')
    user_id = data.get('user_id')
    employee_id = data.get('employee_id')
    product_id = data.get('product_id')
    price = data.get('price')
    transaction_type = data.get('transaction_type')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    quantity = data.get('quantity')

    cur = mysql.connection.cursor()
    try:
        # Using stored procedure for transaction creation
        cur.callproc("CreateTransaction", (order_id, user_id, employee_id, product_id, price, transaction_type, start_date, end_date, quantity))
        mysql.connection.commit()
        return jsonify({'message': 'Transaction created successfully!'}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

# Stored Procedure: Validate Order
@app.route('/api/validate-order/<order_id>', methods=['GET'])
def validate_order(order_id):
    cur = mysql.connection.cursor()
    try:
        # Using stored procedure to validate order
        cur.callproc("ValidateOrder", (order_id,))
        result = cur.fetchone()

        if result:
            return jsonify({
                'product_id': result[0],
                'product_name': result[1],
                'image': result[2],
                'quantity': result[3]
            }), 200
        else:
            return jsonify({'error': 'Invalid Order ID or the last transaction is not a rental.'}), 400
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

# Stored Procedure: Increase Quantity
@app.route('/api/increase-quantity', methods=['POST'])
def increase_quantity():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)  # Default increase quantity

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    cur = mysql.connection.cursor()
    try:
        # Using stored procedure to increase quantity
        cur.callproc("IncreaseProductQuantity", (product_id, quantity))
        mysql.connection.commit()
        return jsonify({'message': 'Quantity increased successfully!'}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

@app.route('/api/user', methods=['GET'])
def get_user_by_email():
    email = request.args.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user:
            return jsonify({'user_id': user[0]}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()

@app.route('/api/random-employee', methods=['GET'])
def get_random_employee():
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT id, name FROM employee ORDER BY RAND() LIMIT 1")
        employee = cur.fetchone()

        if employee:
            return jsonify({'id': employee[0], 'name': employee[1]}), 200
        else:
            return jsonify({'error': 'No active employees found'}), 404
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()




@app.route('/api/employee', methods=['GET'])
def get_all_employees():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT id, name, salary, contact_number FROM employee")
        employees = cursor.fetchall()

        # Structure data in JSON format
        employee_list = [{'id': emp[0], 'name': emp[1], 'salary': emp[2], 'contact_number': emp[3]} for emp in employees]
        return jsonify(employee_list), 200
    except Exception as e:
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cursor.close()






@app.route('/api/decrease-quantity', methods=['POST'])
def decrease_quantity():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id or not quantity:
        return jsonify({'error': 'Product ID and quantity are required'}), 400

    cur = mysql.connection.cursor()
    try:
        # Check current quantity of the product
        cur.execute("SELECT quantity FROM product WHERE product_id = %s", (product_id,))
        result = cur.fetchone()

        if result:
            current_quantity = result[0]
            new_quantity = current_quantity - quantity
            print(new_quantity)

            if new_quantity < 0:
                return jsonify({'error': 'Insufficient quantity to decrease'}), 400

            # Update the product quantity in the database
            cur.execute("UPDATE product SET quantity = %s WHERE product_id = %s", (new_quantity, product_id))
            mysql.connection.commit()

            return jsonify({'message': f'Product quantity decreased by {quantity} successfully'}), 200
        else:
            return jsonify({'error': 'Product not found'}), 404

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()




# Product Return: Increase Quantity
@app.route('/api/return-product', methods=['POST'])
def return_product():
    data = request.get_json()
    order_id = data.get('order_id')
    product_id = data.get('product_id')
    quantity_returned = data.get('quantity_returned')
    user_id = data.get('user_id')
    employee_id = data.get('employee_id')

    if not order_id or not product_id or not quantity_returned:
        return jsonify({'error': 'Order ID, Product ID, and Quantity Returned are required'}), 400

    cur = mysql.connection.cursor()
    try:
        # Verify if the product is active before proceeding
        cur.execute("SELECT is_active FROM Product WHERE product_id = %s", (product_id,))
        is_active = cur.fetchone()

        if is_active and is_active[0] == 1:
            # Find the previous rental transaction for the product using order_id
            cur.execute("""
                SELECT transaction_id, quantity
                FROM transaction 
                WHERE order_id = %s AND product_id = %s AND transaction_type = 'rent'
                ORDER BY transaction_id DESC LIMIT 1
            """, (order_id, product_id))
            rent_transaction = cur.fetchone()

            if rent_transaction:
                # Update the quantity of the rental transaction
                rent_transaction_id, current_rent_quantity = rent_transaction
                new_rent_quantity = current_rent_quantity - quantity_returned

                if new_rent_quantity < 0:
                    return jsonify({'error': 'Quantity returned exceeds rented quantity'}), 400

                # Update the rent transaction quantity
                cur.execute("""
                    UPDATE transaction 
                    SET quantity = %s 
                    WHERE transaction_id = %s
                """, (new_rent_quantity, rent_transaction_id))

                # Increase the product quantity in the product table
                cur.callproc("IncreaseProductQuantity", (product_id, quantity_returned))
                
                mysql.connection.commit()

                return jsonify({'message': 'Product returned and rental quantity updated successfully!'}), 200
            else:
                return jsonify({'error': 'No rental transaction found for this order and product'}), 404
        else:
            return jsonify({'error': 'Product is inactive and cannot be returned'}), 400
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    finally:
        cur.close()


@app.route('/api/get_user_id', methods=['GET'])
def get_user_id():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    cursor.close()
    
    if result:
        return jsonify({"user_id": result[0]})
    return jsonify({"error": "User not found"}), 404

@app.route('/api/get_user_transactions', methods=['GET'])
def get_user_transactions():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Connect to the database using mysql.connection.cursor()
        cursor = mysql.connection.cursor()

        # Updated query to include employee_id
        query = """
            SELECT t.transaction_id, t.product_id, t.order_id, t.quantity, t.transaction_type, 
                   t.price, t.start_date, t.end_date, p.image_link, t.employee_id
            FROM transaction t
            LEFT JOIN product p ON t.product_id = p.product_id
            WHERE t.user_id = %s
        """
        
        cursor.execute(query, (user_id,))
        transactions = cursor.fetchall()
        print(transactions)
        
        if not transactions:
            return jsonify({'transactions': []}), 200
        
        # Prepare the transaction data to return
        transaction_data = [
            {
                'transaction_id': transaction[0],
                'product_id': transaction[1],
                'order_id': transaction[2],
                'quantity': transaction[3],
                'transaction_type': transaction[4],
                'price': transaction[5],
                'start_date': transaction[6],
                'end_date': transaction[7],
                'image_link': transaction[8],
                'employee_id': transaction[9]  # Now correctly referencing employee_id
            }
            for transaction in transactions
        ]
        
        cursor.close()
        
        return jsonify({'transactions': transaction_data}), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred while fetching transactions'}), 500



if __name__ == '__main__':
    app.run(debug=True)


	
