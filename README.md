# AI Chatbot with React and FastAPI

A modern chatbot application built with React for the frontend and FastAPI for the backend. The application features a beautiful UI, file upload capabilities, and integration with Gemini AI models.

## Features

- 🤖 Multiple AI model support (can select model from a list)
- 🎨 Customizable themes
- 💬 Real-time chat interface
- 🔄 Typing indicators
- 📱 Responsive design
- 🔒 User authentication
- ⚙️ Customizable settings

## Tech Stack

- Frontend:
  - React.js
  - CSS3 with modern features
  - SVG animations
  - Responsive design

- Backend:
  - FastAPI
  - Python
  - Gemini AI integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn
- AWS Bedrock access (for Claude AI)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bing-Cheng/chatbot-gcp.git
cd chatbot-gcp
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with:
```
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your_secret_key
```

### Running the Application(Frontend and backend separately)

1. Start the backend server:
```bash
uvicorn app:app --reload
```

2. Start the frontend development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Running the Application(Frontend and backend together as one app)

1. Build the frontend into folder build:
```bash
npm run build
```

2. Start the backend server:
```bash
uvicorn app:app --reload
```
3. Open your browser and navigate to `http://localhost:8000`

### Running the Application from Docker

1. Pull and run from Docker Hub:
```bash
docker run -d -p 8000:8080 --name my-server3 -e GOOGLE_API_KEY=<Your Gemini Key> bcheng33/gcp-chatbot-image:latest
```

### Running the Application from GCP Cloud Run

1. Pull and run from Docker Hub:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud run deploy chat-service \
  --image docker.io/bcheng33/gcp-chatbot-image:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```
Then setup environment variables in Cloud Run:
GOOGLE_API_KEY=<Your Gemini Key>
REACT_APP_BACKEND_BASE_URL=<Cloud Run App Url>

## Usage

1. Log in with any username and password (demo mode)
2. Start chatting with the AI
3. Switch to a new chatting session
4. Customize your experience through the settings panel
5. Choose different AI models and themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Gemini AI by Google
- React.js community
- FastAPI framework # chatbot-gcp
