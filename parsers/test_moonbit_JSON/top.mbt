fn init {
  let bytes = @wasi.fd_read(@wasi.stdin, (1).lsl(16)).unwrap()
  match ((@json.parser() : @parsec.Parser[Char, @json.JValue]).parse(@parsec.Seq::from_string(bytes.to_string()))) {
    Some(_, rest) => if rest.is_empty().not() { 
      @wasi.process_exit(1)
    } else {
      @wasi.process_exit(0)
    }
    None => @wasi.process_exit(1)
  }
}
