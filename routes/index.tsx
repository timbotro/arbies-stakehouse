/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { api } from "../main.ts";
import { lksmDexRate, lksmRate } from "./api/chainQueries.ts";
import { calcDiff } from "./api/chainCalcs.ts";

// const url = `https://api.polkawallet.io/price-server/?token=KSM&from=market`;
const url = "https://api.polkawallet.io/height-time-avg/apr?network=karura"

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any> = {
  async GET(_req, ctx) {
    const resp = await fetch(url);
    if (resp.status === 200) {
      const res = await resp.json();
      // const ksmPrice = price.data.price[0];
      const chain = await api.rpc.system.chain();

      const head = await api.rpc.chain.getFinalizedHead();
      const block = await api.rpc.chain.getBlock(head);
      const height = block.block.header.number;

      const rate = await lksmRate(api);
      // const lksmPrice = ksmPrice / rate;
      const dexRate = await lksmDexRate(api);

      const { diff, apr } = calcDiff(rate, dexRate);

      const blob = { res, chain, height, rate, dexRate, diff, apr };
      console.log(blob);
      return ctx.render(blob);
    }
    return ctx.render(null);
  },
};

// deno-lint-ignore no-explicit-any
export default function Home({ data }: PageProps<any>) {
  if (!data) {
    return <h1>No data available</h1>;
  }

  return (
    <div class={tw`mx-auto max-w-screen-xl bg-indigo-50 px-4`}>
      <div class={tw`p-5 text-2xl`}>Welcome to Surf 🌊 'n Turf 🐄</div>

      <div class={tw`text-lg`}>You are connected to {data.chain.toString()} chain</div>
      <div class={tw`text-lg`}>Current blockheight is {data.height.toString()}</div>

      <div class={tw`flex h-screen items-center justify-center py-4 px-4 grid grid-cols-2 gap-4 bg-slate-50`}>
        <div
          class={tw`max-w-md overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl`}
        >
          <img src="/KaruraWord.svg" height="250px" alt="firebird" class={tw`h-auto w-full`} />
          <div class={tw`p-5`}>
            <div class={tw`text-2xl font-bold py-1`}>LKSM</div>
            <div class={tw`text-medium text-gray-700 py-2`}>Staking Rate: 1 KSM : {data.rate.toFixed(5)} LKSM</div>
            <div class={tw`text-medium text-gray-700 py-2`}>Exchange Rate: 1 KSM : {data.dexRate.toFixed(5)} LKSM</div>
            <div class={tw`text-medium text-gray-700 py-2`}>Difference is: {(data.diff * 100).toFixed(2) }%</div>
            <div class={tw`text-medium text-gray-700 py-2`}>Indicative APR: ~{(data.apr * 100).toFixed(2) }%</div>
            <div class={tw`text-medium text-gray-700 py-2`}>Liquid Stake APR: ~{(data.res * 100).toFixed(2) }%</div>
{/* //print the liquid staking rate
//add logic to determine which route todo
// populate button text to have a star on whether what todo */}

            <div class={tw`grid grid-cols-2 gap-2`}>
              <div>
                <a href="https://apps.karura.network/lksm">
                  <button
                    class={tw`w-full rounded-md bg-indigo-600  py-2 text-indigo-100 hover:bg-indigo-500 hover:shadow-md duration-75`}
                  >
                    🥩 on Karura
                  </button>
                </a>
              </div>
              <div>
                <a href="https://apps.karura.network/swap">
                  <button
                    class={tw`w-full rounded-md bg-indigo-600  py-2 text-indigo-100 hover:bg-indigo-500 hover:shadow-md duration-75`}
                  >
                    ⇆ on Karura
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          class={tw`max-w-md overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl`}
        >
          <img src="https://i.imgur.com/5dmBrx6.jpg" alt="plant" class={tw`h-auto w-full`} />
          <div class={tw`p-5`}>
            <p class={tw`text-medium mb-5 text-gray-700`}>
              Well, aren't you going up to the lake tonight, you've been planning it for two weeks.
            </p>
            <button
              class={tw`w-full rounded-md bg-indigo-600  py-2 text-indigo-100 hover:bg-indigo-500 hover:shadow-md duration-75`}
            >
              ⇆ on Karura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
