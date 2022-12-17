/** 五捨五超入の処理 */
export const upRound = (v: number) => {
    const v_cut = Math.floor(v)
    if (v - v_cut === 0.5) return v_cut
    else return Math.round(v)
}

/** 与えられた配列の値を順繰り乗算する(funcがあれば、計算後に処理をする) */
export const calcPipeline = (values: number[], func?: (v: number) => number) => {
    if (values.length === 0) return 0
    if (values.length === 1) return values[0]

    return values.reduce((prev, v) => {
        const base = prev * v
        if (func) return func(base)
        else return base
    }, 1)
}

/** どれくらいで倒せるかの指標を取得する */
export const getDefeatIndicate = (minPercentage: number, maxPercentage: number) => {
    if (minPercentage >= 100) return '確定1発'
    if (minPercentage < 100 && 100 < maxPercentage) return '乱数1発'
    if (minPercentage >= 50) return '確定2発'
    if (minPercentage < 50 && 50 <= maxPercentage) return '乱数2発'
    if (minPercentage >= 33.4) return '確定3発'
    if (minPercentage < 33.4 && 33.4 <= maxPercentage) return '乱数3発'
    if (minPercentage >= 25) return '確定4発'
    return '(´･ω･`) ?'
}
