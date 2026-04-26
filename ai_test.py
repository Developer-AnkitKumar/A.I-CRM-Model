from utils import call_llm, parse_json

if __name__ == "__main__":
    while True:
        user_input = input("\nEnter interaction (type 'exit' to quit): ")

        if user_input.lower() == "exit":
            break

        raw = call_llm(user_input)
        data = parse_json(raw)

        print("\n🔹 Extracted Data:\n")
        print(data)