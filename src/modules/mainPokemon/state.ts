import { RootState } from '../store'

// state
export type MainPokemonState = {
    name: string
    types: Types[]
    terastalType: Types
    nature: Nature
    statsCoef: {
        upStat: Stats
        downStat: Stats
    }
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

export const initialState: MainPokemonState = {
    name: 'ヒマナッツ',
    types: ['くさ'],
    terastalType: 'くさ',
    nature: 'AA',
    statsCoef: {
        upStat: 'A',
        downStat: 'A',
    },
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

// selector
export const selector = (stote: RootState) => stote.mainPokemon
