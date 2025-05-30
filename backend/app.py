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
from scipy.linalg import expm

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



@app.route('/grating', methods=['POST'])
def grating_simulation():
    data = request.get_json()
    grating_type = data.get("gratingType", "uniform")
    parameters = data.get("parameters", {})

    # Default physical parameters
    L = float(parameters.get("length", 10))  # Grating length in mm
    n_eff = float(parameters.get("refractiveIndex", 1.45))  # Effective refractive index
    delta_n = float(parameters.get("deltaN", 0.0005))  # Index modulation amplitude
    period = float(parameters.get("period", 0.53))  # Grating period in microns (um)

    # Convert length to meters for calculation convenience (assuming input is mm)
    L_m = L * 1e-3  
    period_m = period * 1e-6  # microns to meters

    # Bragg wavelength lambda_B = 2 * n_eff * period
    lambda_B = 2 * n_eff * period_m * 1e9  # Convert to nm for output scale

    # Wavelength range (in nm)
    wavelengths = np.linspace(lambda_B - 20, lambda_B + 20, 300)

    # Initialize arrays for reflectivity
    reflected = np.zeros_like(wavelengths, dtype=float)

    # Calculate coupling coefficient kappa
    # kappa = pi * delta_n / lambda_B (converted to meters)
    kappa = np.pi * delta_n / (lambda_B * 1e-9)  # in inverse meters

    for i, wl_nm in enumerate(wavelengths):
        # Calculate detuning parameter sigma
        wl_m = wl_nm * 1e-9
        sigma = (np.pi * n_eff / (lambda_B * 1e-9)**2) * (wl_m - lambda_B * 1e-9)

        gamma = np.sqrt(kappa**2 - sigma**2 + 0j)  # add 0j to allow complex sqrt

        if np.abs(gamma) == 0:
            R = 0
        else:
            # Reflectivity formula from coupled mode theory
            numerator = np.sinh(gamma * L_m) ** 2
            denominator = np.cosh(gamma * L_m) ** 2 - (sigma ** 2) / (kappa ** 2)
            R = np.abs(numerator / denominator)

        # Modify reflectivity for different grating types
        if grating_type == "chirped":
            # Chirped gratings have varying period -> broadened peak
            chirp_factor = 1 + 0.1 * (wl_nm - lambda_B) / 20
            R *= np.exp(-((wl_nm - lambda_B) ** 2) / (2 * (5 * chirp_factor) ** 2))
        elif grating_type == "apodized":
            # Apodization reduces sidelobes: apply smooth envelope
            apod = np.sin(np.pi * (i / len(wavelengths))) ** 2
            R *= apod
        elif grating_type == "sampled":
            # Sampled gratings create periodic modulation
            sampled_mod = (np.sin(5 * np.pi * (wl_nm - lambda_B) / 20)) ** 2
            R *= sampled_mod
        elif grating_type == "strain_tuned":
            # Strain shifts lambda_B by some factor (simulate strain)
            strain_shift = 0.5  # nm strain shift (example)
            if abs(wl_nm - (lambda_B + strain_shift)) > 10:
                R *= 0.1  # reduce reflectivity away from shifted peak

        # Clamp reflectivity between 0 and 1
        reflected[i] = np.clip(R.real, 0, 1)

    transmitted = 1 - reflected

    # Prepare response JSON
    reflected_data = [{"wavelength": float(w), "intensity": float(r)} for w, r in zip(wavelengths, reflected)]
    transmitted_data = [{"wavelength": float(w), "intensity": float(t)} for w, t in zip(wavelengths, transmitted)]

    return jsonify({
        "reflected": reflected_data,
        "transmitted": transmitted_data,
        "centerWavelength": lambda_B
    })
@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        # Validate required fields
        required_fields = ["lambda_start", "lambda_end", "num_points", "delta_n", "grating_period", "fbg_length", "n_eff"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing parameter: {field}"}), 400

        lambda_start = float(data["lambda_start"])
        lambda_end = float(data["lambda_end"])
        num_points = int(data["num_points"])
        delta_n = float(data["delta_n"])
        grating_period = float(data["grating_period"])
        fbg_length = float(data["fbg_length"])
        n_eff = float(data["n_eff"])

        wavelengths = np.linspace(lambda_start, lambda_end, num_points)
        reflection = []

        for lam in wavelengths:
            kappa = np.pi * delta_n / lam
            delta_beta = 2 * np.pi * n_eff / lam - np.pi / grating_period
            M = np.array([
                [1j * delta_beta, kappa],
                [-kappa, -1j * delta_beta]
            ])
            M_L = expm(M * fbg_length)
            r = -M_L[1, 0] / M_L[0, 0]
            reflection.append(np.abs(r) ** 2)

        return jsonify({
            "wavelengths": wavelengths.tolist(),
            "reflection": reflection
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)