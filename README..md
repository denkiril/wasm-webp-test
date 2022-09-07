# WASM WEBP TEST

From https://developer.mozilla.org/en-US/docs/WebAssembly/existing_C_to_wasm

## Requirements
* emsdk - https://emscripten.org/docs/getting_started/downloads.html
* libwebp - git clone https://github.com/webmproject/libwebp
* wsl (for Windows 10+)

```
/mnt/d/_Projects/Other_projects/emsdk/upstream/emscripten/emcc -O3 -sWASM=1 -sEXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -I ../libwebp \
  src/main.c \
  ../libwebp/src/{dec,dsp,demux,enc,mux,utils}/*.c \
  -o assets/main.js \
  -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1
```
