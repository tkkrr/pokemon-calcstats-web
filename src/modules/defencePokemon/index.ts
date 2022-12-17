import { createSlice, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { RootState } from '../store'
import {
    createDefencePokemon,
    setDefencePokemon,
    setDefencePokemonType,
    setTerastalMode,
    setIndividualValue,
    setEffectValue,
    setRankCoef,
    setDefenceMove,
    switchDefencePokemonIndex,
    removeDefencePokemon,
    calcActualValue,
    calcDamageRange,
} from './reducers'
import { initialState, selector, idSelector } from './state'

export const defencePokemonSlice = createSlice({
    name: 'defencePokemon',
    initialState,
    reducers: {
        createDefencePokemon,
        setDefencePokemon,
        setDefencePokemonType,
        setTerastalMode,
        setIndividualValue,
        setEffectValue,
        setRankCoef,
        setDefenceMove,
        switchDefencePokemonIndex,
        removeDefencePokemon,
        calcActualValue,
        calcDamageRange,
    },
})

// selector
export const defencePokemonSelector = selector
export const defencePokemonSelectorById = idSelector

// actions
export const actions = defencePokemonSlice.actions

// reducer
export const reducer = defencePokemonSlice.reducer

// middleware
export const defencePokemonMiddleware = createListenerMiddleware()

// 個体値 or 努力値が変わった時，対象の実数値を再計算する
defencePokemonMiddleware.startListening({
    matcher: isAnyOf(actions.setEffectValue, actions.setIndividualValue),
    effect: async (action, listenerApi) => {
        listenerApi.dispatch(
            actions.calcActualValue({
                id: action.payload.id,
                stat: action.payload.stat,
            }),
        )
    },
})

// ポケモン（種族値）が変わった時，全ての実数値を再計算する
defencePokemonMiddleware.startListening({
    matcher: isAnyOf(actions.setDefencePokemon),
    effect: async (action, listenerApi) => {
        const stats: Stats[] = ['H', 'A', 'B', 'C', 'D', 'S']
        stats.forEach(stat => {
            listenerApi.dispatch(
                actions.calcActualValue({
                    id: action.payload.id,
                    stat,
                }),
            )
        })
    },
})

// わざが変わった時，実数値が変化した時
// ダメージ範囲を再計算する
defencePokemonMiddleware.startListening({
    matcher: isAnyOf(
        actions.createDefencePokemon,
        actions.setDefenceMove,
        actions.setDefencePokemonType,
        actions.setTerastalMode,
        actions.setRankCoef,
        actions.calcActualValue,
    ),
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState() as RootState
        listenerApi.dispatch(
            actions.calcDamageRange({
                id: action.payload ? action.payload.id : state.defencePokemon[state.defencePokemon.length - 1].id,
                mainPokemon: state.mainPokemon,
            }),
        )
    },
})
