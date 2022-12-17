import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { Pokemon } from '../../models/pokemonDb'
import { getStatsCoefFromNature } from '../utils/nature'
import { MainPokemonState } from './state'

export const setMainPokemon: CaseReducer<MainPokemonState, PayloadAction<{ pokemon: Pokemon; name?: string }>> = (
    state,
    action,
) => {
    const { pokemon, name } = action.payload
    state.name = name || pokemon.name
    state.baseStats = {
        H: pokemon.H,
        A: pokemon.A,
        B: pokemon.B,
        C: pokemon.C,
        D: pokemon.D,
        S: pokemon.S,
        total: pokemon.total,
    }
    state.types = pokemon.types
    state.terastalType = pokemon.types[0]
}

export const setTerastalType: CaseReducer<MainPokemonState, PayloadAction<Types>> = (state, action) => {
    state.terastalType = action.payload
}

export const setIndividualValue: CaseReducer<MainPokemonState, PayloadAction<{ stat: Stats; value: number }>> = (
    state,
    action,
) => {
    const { stat, value } = action.payload

    // 変更後の個体値が 0以上31以下 のときだけ更新する
    if (0 <= value && value <= 31) {
        state.individualValue[stat] = value
    }
}

export const setEffectValue: CaseReducer<MainPokemonState, PayloadAction<{ stat: Stats; value: number }>> = (
    state,
    action,
) => {
    const { stat, value } = action.payload

    // 変更後の努力値が 0以上252以下 && 合計が510以下 のときだけ更新する
    const diffValue = value - state.effectValue[stat]
    if (0 <= value && value <= 252 && state.effectValue.total + diffValue <= 510) {
        state.effectValue[stat] = value
        state.effectValue.total = state.effectValue.total + diffValue
    }
}

export const setMainPokemonNature: CaseReducer<MainPokemonState, PayloadAction<Nature>> = (state, action) => {
    state.nature = action.payload
    state.statsCoef = getStatsCoefFromNature(action.payload)
}

export const calcActualValue: CaseReducer<MainPokemonState, PayloadAction<{ stat: Stats }>> = (state, action) => {
    const { stat } = action.payload

    const base = state.baseStats[stat]
    const EV = state.effectValue[stat]
    const IV = state.individualValue[stat]

    const LV = 50

    const baseAV =
        stat === 'H'
            ? Math.floor(((base * 2 + IV + EV / 4) * LV) / 100) + LV + 10
            : Math.floor(((base * 2 + IV + EV / 4) * LV) / 100) + 5

    const { upStat, downStat } = state.statsCoef

    state.actualValue[stat] =
        upStat === downStat
            ? baseAV
            : stat === upStat
            ? Math.floor(baseAV * 1.1)
            : stat === downStat
            ? Math.floor(baseAV * 0.9)
            : baseAV
}
