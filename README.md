 
# AI Driven Plant Disease Detection Mobile Application

---

## 📝 Brief Description  
A mobile app that helps farmers and gardening enthusiasts detect plant diseases early using image classification. Users can upload/capture a photo of a plant leaf, and the app classifies it as healthy or diseased using a CNN model (MobileNetV2). It also provides weather data for the user's location.  

**Tech Stack**:  
- **Frontend**: React Native (Android/iOS)  
- **Backend**: Flask API  
- **ML Model**: CNN (MobileNetV2 architecture)  
- **Weather API**: WeatherAPI  

---

## ⚙️ System Requirements  
- **OS**:  
  - Development: Windows 10/11, Linux (Ubuntu 20.04+), macOS 12  
  - Usage: Android 8+, iOS 12+  
- **Prerequisites**:  
  - Node.js (>=18.x), npm, Python 3.8+, pip, Git  
  - Mobile device with **Expo Go** installed  

---

## 🛠️ Installation  

### Backend Setup  
1. **Download Backend Files**: Extract the ZIP from [https://bit.ly/3Z2XayP](https://bit.ly/3Z2XayP).  
2. **Open Folder**: Navigate to `btp_backend` in VS Code.  
3. **Create Virtual Environment**:  
   ```bash
   python -m venv venv
   source venv/bin/activate #(For MacOS)
   venv\Scripts\activate #(For Windows)
   ```  
4. **Install Dependencies**:  
   Create `requirements.txt` with:  
   ```
   flask==2.3.2
   torch==2.1.0
   torchvision==0.16.0
   Pillow==10.0.0
   werkzeug==2.3.6
   ```  
   Run:  
   ```bash
   pip install -r requirements.txt
   ```  
5. **Add Model File**: Place `mobilenetv2_plantvillage20.pth` in the root directory.  
6. **Start Server**:  
   ```bash
   python app.py  # Runs on http://0.0.0.0:5001
   ```  

### Frontend Setup  
1. **Install Expo CLI**:  
   ```bash
   npm install -g expo-cli
   ```  
2. **Open Frontend Folder**: Navigate to `btp_react` in VS Code.  
3. **Install Dependencies**:  
   ```bash
   npm install
   ```  
4. **Update Backend IP**: In `screens/LandingScreen.js`, replace `172.20.10.4` in:  
   ```javascript
   const response = await fetch('http://172.20.10.4:5001/predict')
   ```  
   with your local IP.  
5. **Start Expo**:  
   ```bash
   npx expo start
   ```  
6. **Run on Device**:  
   - Open **Expo Go** on your phone.  
   - Scan the QR code from the terminal.  

---

## 📂 Directory Structure  
**Frontend (`BTP_REACT/`)**  
```
├── app/
│   ├── assets/           # Images (BTPLogo.png, Leaf@meta.jpeg)
│   ├── screens/          # App screens (LandingScreen.js, ResultScreen.js)
│   └── components/       # Reusable components (AppButton.js)
├── node_modules/
├── App.js                # Root component
└── package.json
```  

**Backend (`BTP_BACKEND/`)**  
```
├── venv/                 # Virtual environment
├── app.py                # Flask server
├── mobilenetv2_plantvillage20.pth  # Trained model
└── requirements.txt      # Dependencies
```  

---

## 🧪 Test Flow  
1. Start backend: `python app.py`.  
2. Start frontend: `npx expo start`.  
3. Scan QR code with Expo Go.  
4. Upload/capture a leaf image → View prediction + weather.  

---

## ⚠️ Limitations  
- Model trained on **9 crops** only; may misclassify others.  
- Requires internet for predictions.  
- Remedies not integrated (lack of verified data).  

---

## 🔮 Future Scope  
- Add Punjab-specific crops (wheat, sugarcane).  
- Integrate verified remedies.  
- Support regional languages.  
- Add "Ask Expert" feature.  

---

## 📬 Contact Us  
For questions, contact:  
- **Jatin Goyal**: [jatingoyal1009@gmail.com](mailto:jatingoyal1009@gmail.com)  
- **Ranjeet Singh**: [sohanpalranjeet@gmail.com](mailto:sohanpalranjeet@gmail.com)  
- **Samarth Malhotra**: [samarthmalhotra2003@gmail.com](mailto:samarthmalhotra2003@gmail.com)  
