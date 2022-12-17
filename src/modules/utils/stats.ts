const statsEn2Ja: Stats_En_Ja = {
    H: 'HP',
    A: 'こうげき',
    B: 'ぼうぎょ',
    C: 'とくこう',
    D: 'とくぼう',
    S: 'すばやさ',
}

export const convertStatsEn2Ja = (stat: Stats): Stats_Ja => {
    return statsEn2Ja[stat]
}
