"""Install compatible packages for Python 3.14"""
import subprocess
import sys

packages = [
    "sqlalchemy>=2.0.36",
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "pydantic>=2.10",
    "pydantic-settings>=2.5",
    "python-jose[cryptography]",
    "passlib[bcrypt]",
    "python-multipart",
    "aiofiles",
    "python-dotenv",
    "httpx",
    "alembic",
]

for pkg in packages:
    print(f"Installing {pkg}...")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "--upgrade", "--only-binary", ":all:", "--pre", pkg, "-q"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        # Try without --only-binary for pure Python packages
        result2 = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "--pre", pkg, "-q"],
            capture_output=True, text=True
        )
        if result2.returncode != 0:
            print(f"  FAILED: {result2.stderr[:200]}")
        else:
            print(f"  OK (source)")
    else:
        print(f"  OK")

print("\nDone! Checking versions:")
subprocess.run([sys.executable, "-m", "pip", "list", "--format=columns"], check=False)
