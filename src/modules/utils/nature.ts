export const nature: Nature[] = [
    'AA',
    'AB',
    'AC',
    'AD',
    'AS',
    'BB',
    'BA',
    'BC',
    'BD',
    'BS',
    'CC',
    'CA',
    'CB',
    'CD',
    'CS',
    'DD',
    'DA',
    'DB',
    'DC',
    'DS',
    'SS',
    'SA',
    'SB',
    'SC',
    'SD',
]

const natureEn2Ja: Nature_En_Ja = {
    AA: 'がんばりや',
    AB: 'さみしがり',
    AC: 'いじっぱり',
    AD: 'やんちゃ',
    AS: 'ゆうかん',

    BA: 'ずぶとい',
    BB: 'すなお',
    BC: 'わんぱく',
    BD: 'のうてんき',
    BS: 'のんき',

    CA: 'ひかえめ',
    CB: 'おっとり',
    CC: 'てれや',
    CD: 'うっかりや',
    CS: 'れいせい',

    DA: 'おだやか',
    DB: 'おとなしい',
    DC: 'しんちょう',
    DD: 'きまぐれ',
    DS: 'なまいき',

    SA: 'おくびょう',
    SB: 'せっかち',
    SC: 'ようき',
    SD: 'むじゃき',
    SS: 'まじめ',
}

export const convertNatureEn2Ja = (nature: Nature): Nature_Ja => {
    return natureEn2Ja[nature]
}

const Nature2CoefStats: CoefFromNature = {
    AA: { upStat: 'A', downStat: 'A' },
    AB: { upStat: 'A', downStat: 'B' },
    AC: { upStat: 'A', downStat: 'C' },
    AD: { upStat: 'A', downStat: 'D' },
    AS: { upStat: 'A', downStat: 'S' },

    BA: { upStat: 'B', downStat: 'A' },
    BB: { upStat: 'B', downStat: 'B' },
    BC: { upStat: 'B', downStat: 'C' },
    BD: { upStat: 'B', downStat: 'D' },
    BS: { upStat: 'B', downStat: 'S' },

    CA: { upStat: 'C', downStat: 'A' },
    CB: { upStat: 'C', downStat: 'B' },
    CC: { upStat: 'C', downStat: 'C' },
    CD: { upStat: 'C', downStat: 'D' },
    CS: { upStat: 'C', downStat: 'S' },

    DA: { upStat: 'D', downStat: 'A' },
    DB: { upStat: 'D', downStat: 'B' },
    DC: { upStat: 'D', downStat: 'C' },
    DD: { upStat: 'D', downStat: 'D' },
    DS: { upStat: 'D', downStat: 'S' },

    SA: { upStat: 'S', downStat: 'A' },
    SB: { upStat: 'S', downStat: 'B' },
    SC: { upStat: 'S', downStat: 'C' },
    SD: { upStat: 'S', downStat: 'D' },
    SS: { upStat: 'S', downStat: 'S' },
}

export const getStatsCoefFromNature = (nature: Nature): Coef => {
    return Nature2CoefStats[nature]
}
