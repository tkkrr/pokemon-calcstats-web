import { createSlice, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { actions as defActions } from '../defencePokemon'
import { RootState } from '../store'
import {
    setMainPokemon,
    setTerastalType,
    setIndividualValue,
    setEffectValue,
    setMainPokemonNature,
    calcActualValue,
} from './reducers'
import { initialState, selector } from './state'

export const mainPokemonSlice = createSlice({
    name: 'mainPokemon',
    initialState,
    reducers: {
        setMainPokemon,
        setTerastalType,
        setIndividualValue,
        setEffectValue,
        setMainPokemonNature,
        calcActualValue,
    },
})

// selector
export const mainPokemonSelector = selector

// actions
export const actions = mainPokemonSlice.actions

// reducer
export const reducer = mainPokemonSlice.reducer

// middleware
export const mainPokemonMiddleware = createListenerMiddleware()

// 個体値や努力値が変わった時，その実数値を再計算する
mainPokemonMiddleware.startListening({
    matcher: isAnyOf(actions.setIndividualValue, actions.setEffectValue),
    effect: async (action, listenerApi) => {
        listenerApi.dispatch(actions.calcActualValue({ stat: action.payload.stat }))
    },
})

// ポケモン（種族値）や性格が変わった時，全ての実数値を再計算する
mainPokemonMiddleware.startListening({
    matcher: isAnyOf(actions.setMainPokemon, actions.setMainPokemonNature),
    effect: async (action, listenerApi) => {
        const stats: Stats[] = ['H', 'A', 'B', 'C', 'D', 'S']
        stats.forEach(stat => {
            listenerApi.dispatch(actions.calcActualValue({ stat }))
        })
    },
})

// 実数値が変わった時，ダメージ範囲を再計算する
mainPokemonMiddleware.startListening({
    matcher: isAnyOf(actions.setTerastalType, actions.calcActualValue),
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState() as RootState
        state.defencePokemon.forEach(pokemon => {
            listenerApi.dispatch(
                defActions.calcDamageRange({
                    id: pokemon.id,
                    mainPokemon: state.mainPokemon,
                }),
            )
        })
    },
})
