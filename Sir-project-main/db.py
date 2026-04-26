import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )


def save_interaction(data):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO interactions 
    (hcp_name, interaction_type, products, notes, follow_up_date)
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        data.get("hcp_name"),
        data.get("interaction_type"),
        ", ".join(data.get("products_discussed", [])),
        data.get("notes"),
        data.get("follow_up_date")
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()