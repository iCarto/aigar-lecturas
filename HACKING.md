# aigar-lecturas

## Configurar equipo

[Instalar Android Studio](https://developer.android.com/studio/install)

[Instalar Requisitos de Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements)

Activar el modo depuración en el teléfono.

Copiar .env.example a .env y ajustar.

Ejecutar

```
source .env
npm install
cordova platform add android
```

## Desarrollar en el dispositivo

```
source .env
cordova run android

# Obtener el id del teléfono conectado por USB
adb devices

# Instalar la app en el tlf
adb -s <device> install ./platforms/android/app/build/outputs/apk/debug/app-debug.apk

# Enviar el fichero de lecturas de ejemplo
REMOTE_PATH="/storage/emulated/0/Android/data/es.icarto.aigarLecturas/files/"

# Comprobar ficheros del dispositivo
adb shell ls $(dirname ${REMOTE_PATH})

adb push samples/lecturas.json "${REMOTE_PATH}"

# Abrir aplicación en el teléfono

# Activar depuración remota en Chrome
# https://developer.chrome.com/docs/devtools/remote-debugging
# En Chrome navegar a: chrome://inspect#devices
```

## Desarrollo en local

Comentar la importación de `cordova.js` en `www/public.html`

Lanzar con: `./node_modules/.bin/webpack serve`
