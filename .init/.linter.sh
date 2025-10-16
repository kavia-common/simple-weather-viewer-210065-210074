#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-weather-viewer-210065-210074/weather_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

