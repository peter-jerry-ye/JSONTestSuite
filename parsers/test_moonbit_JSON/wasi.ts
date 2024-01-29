import {
  ConsoleStdout,
  File,
  OpenFile,
  WASI,
} from "npm:@bjorn3/browser_wasi_shim@0.2.19";

let file_path = Deno.args[0];
let file = await Deno.readFile(file_path);

let fds = [
  new OpenFile(new File(file)),
  ConsoleStdout.lineBuffered((msg) => console.log(`[WASI stdout] ${msg}`)),
  ConsoleStdout.lineBuffered((msg) => console.log(`[WASI stderr] ${msg}`)),
];
let wasi = new WASI([], [], fds, { debug: false });

let { instance } = await WebAssembly.instantiateStreaming(
  fetch(
    new URL("./target/wasm-gc/release/build/test-json.wasm", import.meta.url),
  ),
  {
    "wasi_snapshot_preview1": wasi.wasiImport,
  },
);
try {
  Deno.exit(wasi.start(instance as any));
} catch {
  Deno.exit(2); // crashed
}
