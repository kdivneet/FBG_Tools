import joblib
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

# Load fine-tuned GPT-2 model and tokenizer
model_path = "fbg_finetuned_model"  # Adjust path if necessary
model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer = GPT2Tokenizer.from_pretrained(model_path)
tokenizer.pad_token = tokenizer.eos_token

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load classifier and vectorizer
clf = joblib.load("fbg_classifier.pkl")  # Adjust path if necessary
vectorizer = joblib.load("fbg_vectorizer.pkl")  # Adjust path if necessary

# Define filter + generation function
def is_fbg_related(prompt):
    vec = vectorizer.transform([prompt])
    return clf.predict(vec)[0] == 1

def generate_response(prompt):
    if not is_fbg_related(prompt):
        return "Sorry, this is out of context."

    # Get the model's response
    inputs = tokenizer(prompt, return_tensors="pt", padding=True).to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        pad_token_id=tokenizer.eos_token_id
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Remove the question part of the response
    if response.startswith(prompt):
        response = response[len(prompt):].strip()

    return response.strip()

# ========================
# 🔍 Run Some Test Queries
# ========================
# test_prompts = [
#     "How does Fiber Bragg Grating sense temperature?",
#     "What is the capital of Australia?",
#     "Explain the Bragg wavelength shift in an FBG sensor.",
#     "Tell me a joke about cats.",
#     "What is full form of FBG?",
#     "How to pass in class 12"
# ]

# for prompt in test_prompts:
#     print(f"\n📝 Prompt: {prompt}")
#     print("🤖 Response:", generate_response(prompt))
prompt = input("Enter your question: ")
print("🤖 Response:", generate_response(prompt))
