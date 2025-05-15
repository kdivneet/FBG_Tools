# FBG-Simulator: Tools & Intelligent Assistant for Bragg Grating Applications

The **FBG-Simulator** is a unified, web-based platform built to simplify and accelerate the study and practical use of **Fiber Bragg Grating (FBG)** technology. This tool combines interactive calculators, data visualization modules, and an AI-powered domain-specific chatbot—offering a complete learning and development environment for students, researchers, and engineers.

---

## Key Features

* **FBG-Specific Chatbot**: Built using GPT-2 and fine-tuned with domain QA pairs, the chatbot responds exclusively to FBG-related queries.
* **Automated QA Generation**: QA pairs are generated from PDFs and websites using web scraping and language models (LLaMA, T5), then saved in JSON formats for training.
* **Interactive Visualizations**: Concepts are dynamically presented using modern frontend tools (React, Framer Motion) for enhanced understanding.

---

## Model Training

The chatbot model was trained and fine-tuned on Google Colab using GPT-2, with additional constraint filtering via **Logistic Regression** to ensure domain-specific relevance.

📌 **View the training notebook here**:
[🔗 Google Colab: Trained Chatbot Model](https://colab.research.google.com/drive/1_h_uBw8To51Tp-iat-m3LjBT1nk6WM0F?usp=sharing)

---

## 🔧 Tech Stack

* **Frontend**: HTML5, CSS3, JavaScript (ReactJS), Framer Motion
* **Backend**: Flask / Node.js (for APIs)
* **ML/NLP Models**: GPT-2, Falcon, T5, LLaMA
* **Data Handling**: BeautifulSoup, JSON/JSONL formats, TF-IDF
* **Visualization**: Charts, animations, and dynamic UI for real-time interaction

---


## 📈 Future Enhancements

* Add support for additional sensor types beyond FBG
* Real-time simulation features for advanced research use
* Expand chatbot’s knowledge base with continual learning
* Integration with hardware devices for live data analysis



