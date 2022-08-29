export const calcDiff = (rate:number, dexRate:number, period = 7) =>{

    const diff = (dexRate - rate ) / rate
    console.log(diff)
    const apr = (diff > 0) ? (diff / period * 365) : 0

    return {diff, apr}
}