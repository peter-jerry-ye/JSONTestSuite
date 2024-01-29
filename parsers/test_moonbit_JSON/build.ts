import binaryen from "npm:binaryen@116.0.0";
// install dependency
await new Deno.Command("moon", {
  args: ["install"],
  env: Deno.env.toObject(),
  cwd: new URL(".", import.meta.url),
}).spawn().status;
// build wat
await new Deno.Command("moon", {
  args: ["build", "--target", "wasm-gc"],
  env: Deno.env.toObject(),
  cwd: new URL(".", import.meta.url),
}).spawn().status;
// make wasm wasi-preview-1-compatible
const wasm = await Deno.readFile(
  new URL("target/wasm-gc/release/build/test-json.wasm", import.meta.url),
)
  .then(
    (buffer) => new Uint8Array(buffer),
  );

const module = binaryen.readBinary(wasm);
module.setFeatures(binaryen.Features.All);

const funcs = module.getNumFunctions();
const printc = Array.from(Array(funcs).keys()).find((i) => {
  const info = binaryen.getFunctionInfo(module.getFunctionByIndex(i));
  return info.module === "spectest" && info.base === "print_char";
});

if (printc) {
  const name = binaryen.getFunctionInfo(module.getFunctionByIndex(printc)).name;
  module.removeFunction(name);
  module.addFunction(name, binaryen.i32, binaryen.none, [], module.nop());
}

module.removeExport("moonbit.memory");
module.addMemoryExport("0", "memory");

module.optimize();

await Deno.writeFile(
  new URL("target/wasm-gc/release/build/test-json.wasm", import.meta.url),
  module.emitBinary(),
);
await Deno.writeFile(
  new URL("target/wasm-gc/release/build/test-json.wat", import.meta.url),
  new TextEncoder().encode(module.emitText()),
);
