from dotenv import load_dotenv
load_dotenv(dotenv_path='.env', override=True)

import uvicorn
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(BASE_DIR, "..", "certs", "localhost.key")
cert_path = os.path.join(BASE_DIR, "..", "certs", "localhost.crt")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ssl_keyfile=key_path,
        ssl_certfile=cert_path
    )
