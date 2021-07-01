:: Important stuff
@echo off && cls
title Wrapper Duked

::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Terminate existing node.js apps
TASKKILL /IM node.exe /F 2>nul
cls

:::::::::::::::::::::::::
:: Start Wrapper Duked ::
:::::::::::::::::::::::::

:: Check for installation
if exist notinstalled (
	echo GoAnimate Wrapper is not installed! Installing...
	call npm install
	ren "notinstalled" "installed"
	cls
	goto start
) else (
	goto start
)

:: Run npm start
:start
echo Wrapper Duked is now starting...
echo Please navigate to http://localhost or https://localhost:80 on your browser.
npm start
