"""
Single-command launcher for ATS Resume Analyzer
Runs BOTH Frontend (React / Vite) and Backend (FastAPI Python API) at the same time.
"""

import subprocess
import sys
import os
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "ats-resume-analyzer")

    print("=========================================================")
    print("Starting ATS Resume Analyzer (Frontend + Backend)")
    print("=========================================================")

    # 1. Start Python FastAPI Backend on http://localhost:8000
    print("\n[1/2] Starting Python FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [sys.executable, "main.py"]
    backend_process = subprocess.Popen(backend_cmd, cwd=backend_dir)

    # Give backend a moment to bind to port
    time.sleep(2)

    # 2. Start React + Vite Frontend on http://localhost:5173
    print("\n[2/2] Starting React + Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = "npm run dev"
    frontend_process = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)

    print("\n[+] BOTH SERVERS ARE NOW RUNNING AT THE SAME TIME!")
    print("---------------------------------------------------------")
    print("Frontend App:  http://localhost:5173")
    print("Backend API:   http://localhost:8000")
    print("API Docs:      http://localhost:8000/docs")
    print("---------------------------------------------------------")
    print("Press Ctrl+C to stop both servers.\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down both servers...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
