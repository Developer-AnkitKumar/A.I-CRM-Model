import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def clean_json(raw):
    raw = re.sub(r"```json|```", "", raw).strip()
    return raw

def detect_interest(notes):
    notes = notes.lower()
    if "interested" in notes:
        return "high"
    elif "unsure" in notes:
        return "medium"
    return "low"

def suggest_followup(level):
    if level == "high":
        return "Follow up in 2 days"
    elif level == "medium":
        return "Follow up in 5 days"
    return "Follow up next week"

def call_llm(user_input):
    prompt = f"""
You are an AI assistant for a pharma CRM system.

Extract structured interaction data AND give suggestion.

Text: {user_input}

Return ONLY JSON:
{{
  "hcp_name": "",
  "interaction_type": "",
  "products_discussed": [],
  "notes": "",
  "follow_up_date": "",
  "suggestion": ""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return clean_json(response.choices[0].message.content)

def parse_json(raw):
    try:
        data = json.loads(raw)

        interest = detect_interest(data.get("notes", ""))
        data["interest_level"] = interest
        data["smart_followup"] = suggest_followup(interest)

        return data

    except:
        return {"error": "Invalid JSON", "raw": raw}