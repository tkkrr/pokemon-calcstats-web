// 全タイプ
export const allTypes: Types[] = [
    'ノーマル',
    'ほのお',
    'くさ',
    'みず',
    'ひこう',
    'かくとう',
    'いわ',
    'じめん',
    'でんき',
    'こおり',
    'ゴースト',
    'エスパー',
    'はがね',
    'あく',
    'フェアリー',
    'ドラゴン',
    'どく',
    'むし',
]

// タイプ相性表
const typeAtkCompTable: {
    [key in Types]: {
        super: Types[]
        less: Types[]
        noEffect: Types[]
    }
} = {
    あく: {
        super: ['エスパー', 'ゴースト'],
        less: ['あく', 'かくとう', 'フェアリー'],
        noEffect: [],
    },
    いわ: {
        super: ['こおり', 'ひこう', 'ほのお', 'むし'],
        less: ['かくとう', 'じめん', 'はがね'],
        noEffect: [],
    },
    かくとう: {
        super: ['あく', 'いわ', 'こおり', 'はがね', 'ノーマル'],
        less: ['どく', 'ひこう', 'むし', 'エスパー', 'フェアリー'],
        noEffect: ['ゴースト'],
    },
    くさ: {
        super: ['いわ', 'じめん', 'みず'],
        less: ['くさ', 'どく', 'はがね', 'ひこう', 'ほのお', 'むし', 'ドラゴン'],
        noEffect: [],
    },
    こおり: {
        super: ['いわ', 'じめん', 'ひこう', 'ドラゴン'],
        less: ['ほのお', 'みず', 'こおり', 'はがね'],
        noEffect: [],
    },
    じめん: {
        super: ['いわ', 'でんき', 'どく', 'はがね', 'ほのお'],
        less: ['くさ', 'むし'],
        noEffect: ['ひこう'],
    },
    でんき: {
        super: ['ひこう', 'みず'],
        less: ['くさ', 'でんき', 'ドラゴン'],
        noEffect: ['じめん'],
    },
    どく: {
        super: ['くさ', 'フェアリー'],
        less: ['いわ', 'じめん', 'どく', 'ゴースト'],
        noEffect: ['はがね'],
    },
    はがね: {
        super: ['いわ', 'こおり', 'フェアリー'],
        less: ['でんき', 'はがね', 'ほのお', 'みず'],
        noEffect: [],
    },
    ひこう: {
        super: ['かくとう', 'くさ', 'むし'],
        less: ['いわ', 'でんき', 'はがね'],
        noEffect: [],
    },
    ほのお: {
        super: ['くさ', 'こおり', 'はがね', 'むし'],
        less: ['いわ', 'ほのお', 'みず', 'ドラゴン'],
        noEffect: [],
    },
    みず: {
        super: ['いわ', 'じめん', 'ほのお'],
        less: ['くさ', 'みず', 'ドラゴン'],
        noEffect: [],
    },
    むし: {
        super: ['あく', 'くさ', 'エスパー'],
        less: ['かくとう', 'どく', 'はがね', 'ひこう', 'ほのお', 'ゴースト', 'フェアリー'],
        noEffect: [],
    },
    エスパー: {
        super: ['かくとう', 'どく'],
        less: ['はがね', 'エスパー'],
        noEffect: ['あく'],
    },
    ゴースト: {
        super: ['エスパー', 'ゴースト'],
        less: ['あく'],
        noEffect: ['ノーマル'],
    },
    ドラゴン: {
        super: ['ドラゴン'],
        less: ['はがね'],
        noEffect: ['フェアリー'],
    },
    ノーマル: {
        super: [],
        less: ['いわ', 'はがね'],
        noEffect: ['ゴースト'],
    },
    フェアリー: {
        super: ['あく', 'かくとう', 'ドラゴン'],
        less: ['どく', 'はがね', 'ほのお'],
        noEffect: [],
    },
}

// 技に対する相性倍率を返す
export const getTypeCoef = (atkType: Types, defTypes: Types[]) => {
    const typeComp = typeAtkCompTable[atkType]

    return defTypes.reduce((v, defType) => {
        if (typeComp.super.includes(defType)) v *= 2
        else if (typeComp.less.includes(defType)) v *= 0.5
        else if (typeComp.noEffect.includes(defType)) v *= 0
        return v
    }, 1)
}

// For React-Select
export const typeOptions: readonly TypeOption[] = allTypes.map(type => {
    return { value: type, label: type }
})
