@echo off


echo Starting React Development...
cd front-end
REM Adding the embedded node/npm to the system path
set PATH=%CD%\node;%PATH%

REM Starting node development on port 3000
npm start
