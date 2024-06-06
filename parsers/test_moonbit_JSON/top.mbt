pub fn parse(input : String) -> Int {
  // match @json5.parse(input) {
  //   Ok(value) => 0
  //   Err(err) => 1
  // }
  println(input.length())
  for i = 0; i < input.length(); i = i + 1 {
    println(input[i].to_int())
  }
  match
    (@json.parser() : @parsec.Parser[Char, @json.JValue]).parse(
      @parsec.Seq::from_string(input),
    ) {
    Some((_, rest)) => if rest.is_empty().not() { 1 } else { 0 }
    None => 1
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
