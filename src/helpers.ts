// deno-lint-ignore-file no-explicit-any
import { tick } from "svelte";
import { pipe } from "@esfx/fn";
pipe();
interface Transformer<
  I,
  O,
  Options extends CommonOptions<I, O> = CommonOptions<I, O>,
> {
  (input: I, options?: Options): O;
}

type Decoder<T> = Transformer<string, T, DecodeOptions<T>>;

type Encoder<T> = Transformer<T, string, EncodeOptions<T>>;

interface CommonOptions<I, O> {
  transform?();
  catch?(error: Error, input: I): O;
  finally?(input: I, output: O): void;
}

interface DecodeOptions<T> extends CommonOptions<string, T> {
  decoder?: Decoder<T>;
  params?: RestParams<this["decoder"]>;
}

interface EncodeOptions<T> extends CommonOptions<T, string> {
  encoder?: Encoder<T>;
  params?: RestParams<this["encoder"]>;
}

type RestParams<T, Fallback = never> = T extends
  (first: any, ...rest: infer A) => any ? A : Fallback;

interface Codec<T, ID extends string = string> {
  readonly id: ID;

  encode: Encoder<T>;
  decode: Decoder<T>;
}
