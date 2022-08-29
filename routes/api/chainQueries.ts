import { ApiPromise } from "polkadot-api";
import { api } from "../../main.ts";


export const lksmRate = async (api: ApiPromise) => {
    const totalIssuance = Number(await api.query.tokens.totalIssuance({ Token: "LKSM" }));
    const totalBonded =  Number(await api.query.homa.totalStakingBonded())

    return totalIssuance / totalBonded
}

export const lksmDexRate = async (api: ApiPromise) => {
    const resp = (await api.query.dex.liquidityPool([{Token: "KSM"}, {Token: "LKSM"}]) as any).toJSON()
    return Number(resp![1])/Number(resp![0])
}

export const premiumUnstakeAPR = async (api: ApiPromise)=> {
    const diff = await lksmDexRate 
}