from langgraph.graph import StateGraph
from utils import call_llm, parse_json

# ----------- NODE 1: Extract -----------
def extract_node(state):
    user_input = state["input"]

    raw = call_llm(user_input)

    return {"raw": raw}


# ----------- NODE 2: Parse JSON -----------
def parse_node(state):
    parsed = parse_json(state["raw"])

    return {"data": parsed}


# ----------- NODE 3: Validation (optional but good) -----------
def validate_node(state):
    data = state["data"]

    # simple validation
    if "hcp_name" not in data:
        data["hcp_name"] = "Unknown"

    return {"data": data}


# ----------- GRAPH BUILD -----------
graph = StateGraph(dict)

graph.add_node("extract", extract_node)
graph.add_node("parse", parse_node)
graph.add_node("validate", validate_node)

graph.set_entry_point("extract")

graph.add_edge("extract", "parse")
graph.add_edge("parse", "validate")

app = graph.compile()


# ----------- RUN -----------
if __name__ == "__main__":
    while True:
        text = input("\nEnter interaction (type 'exit' to quit): ")

        if text.lower() == "exit":
            break

        result = app.invoke({"input": text})

        print("\n✅ Final Output:\n")
        print(result["data"])
