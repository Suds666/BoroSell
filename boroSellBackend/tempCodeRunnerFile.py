import mysql.connector
from mysql.connector import Error

try:
    # Establishing the connection to the MySQL database
    db = mysql.connector.connect(
        host='localhost',  # MySQL server address
        user='root',  # MySQL username
        password='Suds2uds$uds',  # MySQL password
        database='sudsudbms'  # Name of the database you want to connect to
    )

    if db.is_connected():
        print("Database connected successfully")
        # You can perform database operations here

except Error as e:
    print("Error while connecting to MySQL", e)

finally:
    # Closing the connection
    if db.is_connected():
        db.close()
        print("Database connection closed")

