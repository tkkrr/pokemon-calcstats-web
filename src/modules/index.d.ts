type Stats_Ja = 'HP' | 'こうげき' | 'ぼうぎょ' | 'とくこう' | 'とくぼう' | 'すばやさ'
type Stats = 'H' | 'A' | 'B' | 'C' | 'D' | 'S'

type Stats_En_Ja = {
    [key in Stats]: Stats_Ja
}

type Types =
    | 'ノーマル'
    | 'ほのお'
    | 'くさ'
    | 'みず'
    | 'ひこう'
    | 'かくとう'
    | 'いわ'
    | 'じめん'
    | 'でんき'
    | 'こおり'
    | 'ゴースト'
    | 'エスパー'
    | 'はがね'
    | 'あく'
    | 'フェアリー'
    | 'ドラゴン'
    | 'どく'
    | 'むし'

type TypeOption = {
    readonly value: Types
    readonly label: Types
}

type Nature_Ja =
    | 'さみしがり'
    | 'いじっぱり'
    | 'やんちゃ'
    | 'ゆうかん'
    | 'ずぶとい'
    | 'わんぱく'
    | 'のうてんき'
    | 'のんき'
    | 'ひかえめ'
    | 'おっとり'
    | 'うっかりや'
    | 'れいせい'
    | 'おだやか'
    | 'おとなしい'
    | 'しんちょう'
    | 'なまいき'
    | 'おくびょう'
    | 'せっかち'
    | 'ようき'
    | 'むじゃき'
    | 'がんばりや'
    | 'すなお'
    | 'てれや'
    | 'きまぐれ'
    | 'まじめ'

type Nature =
    | 'AA'
    | 'AB'
    | 'AC'
    | 'AD'
    | 'AS'
    | 'BA'
    | 'BB'
    | 'BC'
    | 'BD'
    | 'BS'
    | 'CA'
    | 'CB'
    | 'CC'
    | 'CD'
    | 'CS'
    | 'DA'
    | 'DB'
    | 'DC'
    | 'DD'
    | 'DS'
    | 'SA'
    | 'SB'
    | 'SC'
    | 'SD'
    | 'SS'

type Nature_En_Ja = {
    [key in Nature]: Nature_Ja
}

type Coef = {
    upStat: Stats
    downStat: Stats
}

type CoefFromNature = {
    [key in Nature]: Coef
}
