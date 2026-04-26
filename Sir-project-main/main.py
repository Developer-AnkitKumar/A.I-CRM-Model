from fastapi import FastAPI
from pydantic import BaseModel
from ai_graph import app as ai_app
from db import save_interaction
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os

app_api = FastAPI()

app_api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODEL ----------------
class ChatRequest(BaseModel):
    message: str


# ---------------- CHAT API ----------------
@app_api.post("/chat")
def chat(data: ChatRequest):
    try:
        result = ai_app.invoke({"input": data.message})

        structured = result.get("data", {})

        # 🧠 HUMAN LIKE RESPONSE (YOUR UI MATCH)
        reply = f"""
📝 Today’s Interaction Summary:

You met with **{structured.get("hcp_name", "the doctor")}** and discussed **{structured.get("products_discussed", "products")}**.

The sentiment was **{structured.get("interest_level", "neutral")}**.

✅ Interaction logged successfully!
The details (HCP Name, Date, Sentiment, Materials) have been auto-filled.

Would you like me to suggest a follow-up action?
"""

        return {
            "success": True,
            "reply": reply.strip(),
            "data": structured
        }

    except Exception as e:
        return {
            "success": False,
            "reply": "❌ AI error aaya",
            "error": str(e)
        }


# ---------------- SAVE API ----------------
@app_api.post("/save")
def save_manual(data: dict):
    try:
        save_interaction(data)

        return {
            "status": "saved",
            "message": "Interaction saved successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ---------------- GET ALL ----------------
@app_api.get("/interactions")
def get_all():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM interactions ORDER BY id DESC")
        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return data

    except Exception as e:
        return {"error": str(e)}