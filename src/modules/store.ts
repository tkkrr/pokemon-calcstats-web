import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { defencePokemonMiddleware, reducer as defencePokemonReducer } from './defencePokemon'
import { mainPokemonMiddleware, reducer as mainPokemonReducer } from './mainPokemon'

const store = configureStore({
    reducer: {
        mainPokemon: mainPokemonReducer,
        defencePokemon: defencePokemonReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().prepend([mainPokemonMiddleware.middleware, defencePokemonMiddleware.middleware]),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 型付きのDispatchとSelector
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
