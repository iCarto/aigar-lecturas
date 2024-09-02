#!/bin/bash

LECTURAS_HECHAS="/storage/emulated/0/Android/data/es.icarto.aigarLecturas/files/lecturas_hechas.json"
LECTURAS="/storage/emulated/0/Android/data/es.icarto.aigarLecturas/files/lecturas.json"

rm lecturas_hechas.json
adb shell rm "${LECTURAS_HECHAS}"
adb shell rm "${LECTURAS}"


cordova build android

adb -s e5694295 install ./platforms/android/app/build/outputs/apk/debug/app-debug.apk
adb push samples/lecturas.json "${LECTURAS}"
