pub fn parse(input : String) -> Int {
  match @json.parse(input) {
    Ok(_) => 0
    Err(_) => 1
  }
}

extern "js" fn exit(i : Int) -> Unit =
  #| (i) => require("node:process").exit(i)

extern "js" fn argv() -> Array[String] =
  #| () => ({ buf : require("node:process").argv, len : 3 })

extern "js" fn read_file_sync(file : String) -> String =
  #| (file) => require("node:fs").readFileSync(file, "utf-8")

fn main {
  let file = argv()[2]
  let input = read_file_sync(file)
  exit(parse(input))
}
