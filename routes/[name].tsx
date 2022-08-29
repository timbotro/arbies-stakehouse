/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  return <div>Sorry, I'm afraid there is no /{props.params.name} page</div>;
}
