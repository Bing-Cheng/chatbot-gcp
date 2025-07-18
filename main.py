from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from dotenv import load_dotenv
from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import uuid

# Load environment variables (for GOOGLE_API_KEY)
load_dotenv()

ai_model = "gemini-2.5-flash"
# --- ADK Chatbot Setup (from your previous code) ---
# Ensure GOOGLE_API_KEY is loaded
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError(
        "GOOGLE_API_KEY environment variable not set. "
        "Please set it in your .env file or environment."
    )

host_agent = LlmAgent(
    name="host_agent",
    model=ai_model,
    description="A friendly chatbot host.",
    instruction=(
        "You are the host agent responsible for chatting with the user. "
        "Keep your responses concise, friendly, and helpful."
    ),
)

session_service = InMemorySessionService()

USER_ID = "fastapi_user" # Changed for FastAPI context
SESSION_ID_PRE = "fastapi_session"



async def setup_session():
    """
    Sets up the session for the In-Memory Session Service.
    This will be called when the FastAPI app starts up.
    """
    try:
        app.state.SESSION_ID = SESSION_ID_PRE + str(uuid.uuid4())
        await session_service.create_session(
            app_name="host_app",
            user_id=USER_ID,
            session_id=app.state.SESSION_ID
        )
        print(f"Session '{app.state.SESSION_ID}' for user '{USER_ID}' created successfully.")
    except Exception as e:
        print(f"Could not create session: {e}")

async def get_chatbot_response(prompt: str) -> str:
    """
    Sends a prompt to the chatbot and returns its answer string.
    This is essentially your 'execute' function, simplified for direct use.
    """
    message = types.Content(role="user", parts=[types.Part(text=prompt)])

    try:
        llm_model = app.state.runner.agent.model
        print(f"Using LLM model: {llm_model}")
        async for event in app.state.runner.run_async(
            user_id=USER_ID, session_id=app.state.SESSION_ID, new_message=message
        ):
            if event.is_final_response():
                if event.content and event.content.parts:
                    return event.content.parts[0].text
                else:
                    return "I didn't get a clear response."
            # Debugging output (optional, good for understanding flow)
            # elif event.is_agent_output():
            #     print(f"DEBUG: Agent output: {event.agent_output.text}")
            # elif event.is_tool_code():
            #     print(f"DEBUG: Tool call: {event.tool_code.text}")
    except Exception as e:
        print(f"Error during chatbot interaction: {e}")
        raise HTTPException(status_code=500, detail=f"Chatbot internal error: {e}")

    return "The chatbot did not provide a final response."

app = FastAPI()
app.mount("/static", StaticFiles(directory="build/static"), name="static")
# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.runner = Runner(
    agent=host_agent,
    app_name="host_app",
    session_service=session_service,
)

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    index_path = os.path.join("build", "index.html")
    return FileResponse(index_path)

@app.on_event("startup")
async def startup_event():
    await setup_session()

@app.post("/chat")
async def chat1(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    print("User message:", user_message)
    if not user_message:
        return JSONResponse({"response": "Please enter a message."})
    agent_response = await get_chatbot_response(user_message)
    answer = agent_response
    return JSONResponse({"response": answer})

@app.post("/new_chat")
async def new_chat(request: Request):
    data = await request.json()
    await setup_session()
    print("Data:", data)
    return JSONResponse({"response": "New chat session started successfully."})

@app.post("/change_ai_model")
async def change_ai_model(request: Request):
    data = await request.json()
    ai_model = data.get("model", "")
    print("ai_model:", ai_model)
    host_agent = LlmAgent(
        name="host_agent",
        model=ai_model,
        description="A friendly chatbot host.",
        instruction=(
            "You are the host agent responsible for chatting with the user. "
            "Keep your responses concise, friendly, and helpful."
        ),
    )

    app.state.runner = Runner(
        agent=host_agent,
        app_name="host_app",
        session_service=session_service,
    )
    return JSONResponse({"response": "AI model changed successfully."})



