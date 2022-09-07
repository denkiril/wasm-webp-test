function logApiError() {
  console.error('No api function!');
}

let api = {
  version: logApiError,
  create_buffer: logApiError,
  destroy_buffer: logApiError,
  encode: logApiError,
  free_result: logApiError,
  get_result_pointer: logApiError,
  get_result_size: logApiError,
};

function initApi() {
  api = {
    version: Module.cwrap('version', 'number', []),
    create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
    destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
    encode: Module.cwrap('encode', '', ['number','number','number','number',]),
    free_result: Module.cwrap('free_result', '', ['number']),
    get_result_pointer: Module.cwrap('get_result_pointer', 'number', []),
    get_result_size: Module.cwrap('get_result_size', 'number', []),
  };
}

async function getImageData(file) {
  const img = await createImageBitmap(file);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(0, 0, img.width, img.height);
}

function showResult(result) {
  console.log('showResult');
  const blob = new Blob([result], {type: 'image/webp'});
  const blobURL = URL.createObjectURL(blob);
  const imgEl = document.createElement('img');
  imgEl.src = blobURL;
  imgEl.className = 'image'
  document.getElementById('main-container').appendChild(imgEl);
}

async function onImageLoad(e) {
  const file = e.target.files[0];
  console.log('onImageLoad file:', file);

  const image = await getImageData(file);
  const p = api.create_buffer(image.width, image.height);
  Module.HEAP8.set(image.data, p);

  api.encode(p, image.width, image.height, 100);
  const resultPointer = api.get_result_pointer();
  const resultSize = api.get_result_size();
  const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
  const result = new Uint8Array(resultView);
  api.free_result(resultPointer);
  api.destroy_buffer(p);

  showResult(result);
}

function init() {
  Module.onRuntimeInitialized = async () => {
    initApi();
    console.log('INIT! WebPGetEncoderVersion:', api.version());
    document.getElementById('imgInput').addEventListener('change', onImageLoad);
  };
}

window.addEventListener('load', init);
