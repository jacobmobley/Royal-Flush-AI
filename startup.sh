#!/bin/bash

cd ./py-backend


## setting up backend
pip install -r requirements.txt 1> /dev/null
# python poker_server.py 5001 1000 & 1> /dev/null
# python flask_app.py & 1> /dev/null 
###

cd ../react-frontend

## setting up frontend
npm install
npm run dev