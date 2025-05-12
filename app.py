from flask import Flask, request, jsonify
import os
import torch
from PIL import Image
import datetime
from werkzeug.utils import secure_filename
from preprocessing import get_transforms
from model import get_model

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model
MODEL_PATH = 'mobilenetv2_plantvillage20.pth'  # Ensure your trained model file is here
model = get_model(weights_path=MODEL_PATH)
transform = get_transforms()

# Class labels (modify if necessary)
CLASS_NAMES = [
    "Apple Scab Apple", "Bacterial Spot Bell Pepper", "Bacterial Spot Peach", 
    "Bacterial Spot Tomato", "Black Rot Apple", "Black Rot Grape",
    "Cedar Apple Rust Apple", "Cercospora Leaf Spot Corn", "Common Rust Corn",
    "Early Blight Potato", "Early Blight Tomato", "Esca (Black Measles) Grape",
    "Healthy Apple", "Healthy Bell Pepper", "Healthy Cherry", "Healthy Corn",
    "Healthy Grape", "Healthy Peach", "Healthy Potato", "Healthy Strawberry",
    "Healthy Tomato", "Late Blight Potato", "Late Blight Tomato",
    "Leaf Blight Grape", "Leaf Scorch Strawberry", "Northern Leaf Blight Corn",
    "Powdery Mildew Cherry", "Septoria Leaf Spot Tomato",
    "Yellow Leaf Curl Virus Tomato"
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print(f"\n\n{'='*50}")
        print(f"{datetime.datetime.now()} - New /predict request")
        print(f"{'='*50}")

        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Secure filename and save
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        # Load and preprocess image
        image = Image.open(save_path).convert('RGB')
        image = transform(image)
        image = image.unsqueeze(0)  # Add batch dimension

        # Perform inference
        with torch.no_grad():
            outputs = model(image)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)  # Convert to probabilities

        # Get predicted class and confidence
        predicted_idx = torch.argmax(probabilities).item()
        confidence = probabilities[predicted_idx].item()
        predicted_label = CLASS_NAMES[predicted_idx]

        # Response JSON
        response_data = {
            "disease": predicted_label,
            "confidence": round(confidence, 4)
        }
        
        print(f"🔹 Predicted Disease: {predicted_label}")
        print(f"🔹 Confidence: {confidence * 100:.2f}%")

        return jsonify(response_data)

    except Exception as e:
        print(f"\n🔥 Error: {str(e)}")
        return jsonify({"error": "Server processing failed"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
