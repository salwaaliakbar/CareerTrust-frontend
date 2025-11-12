# backend-ai

This folder contains a minimal AI microservice helper for face recognition, image utilities, and other related functionality, used by the CareerTrust platform.

---

## Quickstart (Windows PowerShell)

Follow these steps to quickly set up and run the AI microservice locally on a Windows machine.

### 1. Navigate to this folder

cd backend-ai


### 2. Run the setup script to create and activate a Python virtual environment, and install required packages from `requirements.txt`:

.\setup-venv.ps1


- If you do not have a `requirements.txt` or want to specify packages manually, run:
  
.\setup-venv.ps1 -Packages fastapi,uvicorn[standard],pillow,numpy,python-multipart,insightface


### 3. Activate the virtual environment manually if not already activated:

..venv\Scripts\Activate.ps1


### 4. Run the microservice using Uvicorn:

..venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000


- Replace `app.main:app` with your actual FastAPI app import path if different.

---

## Notes and Troubleshooting

- The setup script will create a `.venv` folder in this directory and install dependencies.
- It also writes a `requirements.txt` file when installing packages through the `-Packages` parameter.
- If you encounter package build failures on Windows (especially with scientific libraries), ensure you have the Visual C++ Build Tools installed:
  [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- For GPU support with PyTorch or other libraries, please refer to the official installation selector:
  [PyTorch Get Started](https://pytorch.org/get-started/locally/)

---

This microservice provides face detection and embedding extraction functionality, optimized for integration with the CareerTrust system architecture using InsightFace models and FastAPI.
