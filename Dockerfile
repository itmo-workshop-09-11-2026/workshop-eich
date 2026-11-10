FROM python:3.12-slim
WORKDIR /app
COPY main.py .
COPY index.html styles.css app.js .nojekyll ./
COPY assets ./assets
ENV HOST=0.0.0.0 PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000
USER 65532:65532
ENTRYPOINT ["python", "main.py"]
