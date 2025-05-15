import matplotlib
matplotlib.use('Agg')  # Set the backend to 'Agg' for non-interactive plotting

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.signal import find_peaks, peak_widths
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load model and tokenizer
model_path = "fbg_finetuned_model"
model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer = GPT2Tokenizer.from_pretrained(model_path)
tokenizer.pad_token = tokenizer.eos_token

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load classifier and vectorizer
clf = joblib.load("fbg_classifier.pkl")
vectorizer = joblib.load("fbg_vectorizer.pkl")

UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Constants for silica fiber (you can adjust based on material)
alpha = 0.55e-6  # Thermal expansion coefficient (°C^-1) for silica
xi = -1.2e-5     # Thermo-optic coefficient (°C^-1) for silica

# Central Bragg wavelength (1550 nm for typical FBG)
lambda_0 = 1550  # nm

# Helper function to clear old files before processing
def clear_old_files():
    """Delete old CSV files and analysis results before processing new files."""
    for folder in [UPLOAD_FOLDER, RESULT_FOLDER]:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")

def is_fbg_related(prompt):
    vec = vectorizer.transform([prompt])
    return int(clf.predict(vec)[0]) == 1  # Convert np.int64 to native int

def generate_response(prompt):
    if not is_fbg_related(prompt):
        return "Sorry, this is out of context."

    inputs = tokenizer(prompt, return_tensors="pt", padding=True).to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        pad_token_id=tokenizer.eos_token_id
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    if response.startswith(prompt):
        response = response[len(prompt):].strip()

    return response.strip()

# Route 1: Simulate FBG Spectrum
@app.route('/simulate-fbg', methods=['GET'])
def simulate_fbg():
    n_eff = 1.45
    Lambda = 0.532e-6
    L = 10e-3
    kappa = 50
    lambda_B = 2 * n_eff * Lambda

    wavelengths = np.linspace(lambda_B - 5e-9, lambda_B + 5e-9, 500)
    reflectivities = []

    for lam in wavelengths:
        delta = 2 * np.pi * n_eff * (1 / lam - 1 / lambda_B)
        q = np.sqrt(kappa**2 - delta**2 + 0j)
        numerator = -kappa * np.sinh(q * L)
        denominator = delta * np.sinh(q * L) + 1j * q * np.cosh(q * L)
        rho = numerator / denominator
        r = np.abs(rho)**2  # Power reflectivity
        reflectivities.append(r)

    data = [{'wavelength_nm': w * 1e9, 'reflectivity': r} for w, r in zip(wavelengths, reflectivities)]
    return jsonify(data)

# Route 2: Upload CSV, Analyze & Reset Old Files

@app.route('/analyze', methods=['POST'])
def analyze_spectrum():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        # Clear previous files before proceeding
        clear_old_files()

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        df = pd.read_csv(file_path)
        wavelengths = df.iloc[:, 0].values  # Wavelength in nm
        reflectivity = df.iloc[:, 1].values

        if len(wavelengths) == 0 or len(reflectivity) == 0:
            return jsonify({'error': 'Invalid CSV data'}), 400

        plt.figure()
        plt.plot(wavelengths, reflectivity, label="FBG Reflection Spectrum", color='blue')
        plt.xlabel("Wavelength (nm)")
        plt.ylabel("Reflectivity (Normalized)")
        plt.title("FBG Spectrum with FWHM Calculation")
        plt.grid(True)

        peaks, _ = find_peaks(reflectivity, height=0.1, distance=10)
        if len(peaks) == 0:
            return jsonify({'resultText': 'No peaks detected. Try another file.', 'imagePath': '', 'coherenceLength': None})

        widths, _, left_ips, right_ips = peak_widths(reflectivity, peaks, rel_height=0.5)
        fwhm_results = []
        coherence_lengths = []

        for i in range(len(peaks)):
            peak_wl = wavelengths[peaks[i]]  # Wavelength in nm
            left_wl = np.interp(left_ips[i], np.arange(len(wavelengths)), wavelengths)
            right_wl = np.interp(right_ips[i], np.arange(len(wavelengths)), wavelengths)
            fwhm = right_wl - left_wl

            # Convert to meters
            peak_wl_m = peak_wl * 1e-9  # Convert nm to meters
            fwhm_m = fwhm * 1e-9  # Convert nm to meters

            # Debugging: Check values
            print(f"Peak Wavelength (nm): {peak_wl}, Peak Wavelength (m): {peak_wl_m}")
            print(f"FWHM (nm): {fwhm}, FWHM (m): {fwhm_m}")

            # Debugging: Check intermediate values
            numerator = peak_wl_m ** 2
            denominator = fwhm_m

# Print intermediate values to verify the calculation
            print(f"Numerator (λ^2): {numerator}")
            print(f"Denominator (Δλ): {denominator}")

            coherence_length = numerator / denominator

# Final result
            print(f"Coherence Length: {coherence_length} meters")


            # Coherence Length calculation (in meters)
            # coherence_length = (peak_wl_m ** 2) / fwhm_m
            # print(f"Coherence Length: {coherence_length} meters")

            coherence_lengths.append(coherence_length)

            fwhm_results.append(
                f"Peak at {peak_wl:.4f} nm: FWHM = {fwhm:.4f} nm, Coherence Length = {coherence_length:.4f} m"
            )

            plt.axvline(left_wl, color='green', linestyle='--')
            plt.axvline(right_wl, color='purple', linestyle='--')
            plt.axhline(reflectivity[peaks[i]] / 2, color='red', linestyle='--')
            plt.plot(peak_wl, reflectivity[peaks[i]], "ro")

        image_path = os.path.join(RESULT_FOLDER, 'fbg_spectrum.png')
        plt.legend()
        plt.savefig(image_path)
        plt.close()

        return jsonify({
            'resultText': '\n'.join(fwhm_results),
            'imagePath': 'results/fbg_spectrum.png',
            'coherenceLength': coherence_lengths[0] if coherence_lengths else None
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500




# Route 3: Fetch Graph Image
@app.route('/results/<filename>', methods=['GET'])
def get_image(filename):
    return send_file(os.path.join(RESULT_FOLDER, filename), mimetype='image/png')

# Route 4: Reset (Manually Clear All Files)
@app.route('/reset', methods=['POST'])
def reset_files():
    clear_old_files()
    return jsonify({'message': 'All uploaded files and results have been cleared.'})

# Route 5: Chatbot Text Handler
@app.route('/predict', methods=['POST'])
def chatbot_response():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"response": "Please ask me something!"})

    try:
        response = generate_response(prompt)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

lambda_0 = 1550  # nm
alpha = 0.55e-6  # Thermal expansion coefficient (1/°C)
xi = 6.7e-6      # Thermo-optic coefficient (1/°C)
rho_e = 0.22     # Strain-optic coefficient

@app.route('/temp-bragg-shift', methods=['POST'])
def temp_bragg_shift():
    data = request.get_json()
    old_temp = float(data.get("old_temp", 0))
    new_temp = float(data.get("new_temp", 0))
    delta_T = new_temp - old_temp

    delta_lambda_temp = lambda_0 * (alpha + xi) * delta_T
    new_lambda = lambda_0 + delta_lambda_temp

    temps = np.linspace(old_temp, new_temp, 100)
    shifts = lambda_0 + (alpha + xi) * (temps - old_temp) * lambda_0

    plt.figure(figsize=(8, 4))
    plt.plot(temps, shifts, label="Shifted Bragg Wavelength", color="blue")
    plt.axhline(y=lambda_0, color='green', linestyle='--', label='Initial Wavelength')
    plt.xlabel("Temperature (°C)")
    plt.ylabel("Bragg Wavelength (nm)")
    plt.title("Bragg Wavelength Shift due to Temperature")
    plt.legend()
    plt.grid(True)

    image_path = os.path.join(RESULT_FOLDER, 'temp_bragg_shift.png')
    plt.savefig(image_path)
    plt.close()

    return jsonify({'imagePath': 'results/temp_bragg_shift.png'})


@app.route('/strain-bragg-shift', methods=['POST'])
def strain_bragg_shift():
    data = request.get_json()
    strain = float(data.get("strain", 0))  # ε

    delta_lambda_strain = lambda_0 * (1 - rho_e) * strain
    new_lambda = lambda_0 + delta_lambda_strain

    strains = np.linspace(0, strain, 100)
    shifts = lambda_0 + (1 - rho_e) * strains * lambda_0

    plt.figure(figsize=(8, 4))
    plt.plot(strains, shifts, label="Shifted Bragg Wavelength", color="orange")
    plt.axhline(y=lambda_0, color='green', linestyle='--', label='Initial Wavelength')
    plt.xlabel("Strain (ε)")
    plt.ylabel("Bragg Wavelength (nm)")
    plt.title("Bragg Wavelength Shift due to Strain")
    plt.legend()
    plt.grid(True)

    image_path = os.path.join(RESULT_FOLDER, 'strain_bragg_shift.png')
    plt.savefig(image_path)
    plt.close()

    return jsonify({'imagePath': 'results/strain_bragg_shift.png'})



if __name__ == '__main__':
    app.run(debug=True)
