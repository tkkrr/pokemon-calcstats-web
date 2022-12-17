import { Move } from '../../models/pokemonDb'
import { RootState } from '../store'

export type DefencePokemon = {
    name: string
    types: Types[]
    rankCoefAtk: number
    rankCoefDef: number
    actualValue: {
        H: number
        A: number
        B: number
        C: number
        D: number
        S: number
    }
    baseStats: {
        H: number
        A: number
        B: number
        C: number
        D: number
        S: number
        total: number
    }
    individualValue: {
        H: number
        A: number
        B: number
        C: number
        D: number
        S: number
    }
    effectValue: {
        H: number
        A: number
        B: number
        C: number
        D: number
        S: number
        total: number
    }
}

export const defaultDefencePokemon = {
    name: 'ヒマナッツ',
    types: ['くさ'] as Types[],
    rankCoefAtk: 0,
    rankCoefDef: 0,
    actualValue: {
        H: 105,
        A: 50,
        B: 50,
        C: 50,
        D: 50,
        S: 50,
    },
    baseStats: {
        H: 30,
        A: 30,
        B: 30,
        C: 30,
        D: 30,
        S: 30,
        total: 180,
    },
    individualValue: {
        H: 31,
        A: 31,
        B: 31,
        C: 31,
        D: 31,
        S: 31,
    },
    effectValue: {
        H: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        S: 0,
        total: 0,
    },
}

export const defaultDefenceMove: Move = {
    name: 'リーフストーム',
    type: 'くさ',
    kind: 'special',
    power: 130,
}

export type DamageRange = {
    natureCoef: number
    min: number
    max: number
    minPercentage: number
    maxPercentage: number
}

export const defaultDamageRanges: DamageRange[] = [
    {
        natureCoef: 0.9,
        min: 41,
        max: 48,
        minPercentage: 39.1,
        maxPercentage: 45.8,
    },
    {
        natureCoef: 1.0,
        min: 37,
        max: 44,
        minPercentage: 35.3,
        maxPercentage: 42.0,
    },
    {
        natureCoef: 1.1,
        min: 33,
        max: 40,
        minPercentage: 31.5,
        maxPercentage: 38.1,
    },
]

// state
export type DefencePokemonsState = {
    id: string
    pokemon: DefencePokemon
    move: Move
    isTerastal: boolean
    damegeRanges: DamageRange[]
}[]

export const initialState: DefencePokemonsState = [
    {
        id: 'defence-00000',
        pokemon: Object.assign({}, { ...defaultDefencePokemon }),
        move: Object.assign({}, { ...defaultDefenceMove }),
        isTerastal: false,
        damegeRanges: new Array<DamageRange>().concat(defaultDamageRanges),
    },
]

// selector
export const selector = (stote: RootState) => stote.defencePokemon
export const idSelector = (id: string) => (stote: RootState) => stote.defencePokemon.find(item => item.id === id)
