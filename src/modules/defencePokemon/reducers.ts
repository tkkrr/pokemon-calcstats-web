import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { Move, Pokemon } from '../../models/pokemonDb'
import { MainPokemonState } from '../mainPokemon/state'
import { calcPipeline, upRound } from '../utils/calc'
import { getTypeCoef } from '../utils/types'
import {
    DefencePokemonsState,
    defaultDefencePokemon,
    defaultDefenceMove,
    defaultDamageRanges,
    DamageRange,
} from './state'

export const createDefencePokemon: CaseReducer<DefencePokemonsState, PayloadAction<void>> = state => {
    const id = 'defence-' + Math.random().toFixed(5).slice(2,7)
    state.push({
        id,
        pokemon: Object.assign({}, { ...defaultDefencePokemon }),
        move: Object.assign({}, { ...defaultDefenceMove }),
        isTerastal: false,
        damegeRanges: new Array<DamageRange>().concat(defaultDamageRanges),
    })
}

export const setDefencePokemon: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; pokemon: Pokemon; name?: string }>
> = (state, action) => {
    const { id, pokemon, name } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    defenceItem.pokemon.name = name || pokemon.name
    defenceItem.pokemon.baseStats = {
        H: pokemon.H,
        A: pokemon.A,
        B: pokemon.B,
        C: pokemon.C,
        D: pokemon.D,
        S: pokemon.S,
        total: pokemon.total,
    }
    defenceItem.pokemon.types = pokemon.types
}

export const setDefencePokemonType: CaseReducer<DefencePokemonsState, PayloadAction<{ id: string; types: Types[] }>> = (
    state,
    action,
) => {
    const { id, types } = action.payload
    if (types.length > 3) return

    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    defenceItem.pokemon.types = types
}

export const setTerastalMode: CaseReducer<DefencePokemonsState, PayloadAction<{ id: string; mode: boolean }>> = (
    state,
    action,
) => {
    const { id, mode } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    defenceItem.isTerastal = mode
}

export const setDefenceMove: CaseReducer<DefencePokemonsState, PayloadAction<{ id: string; move: Move }>> = (
    state,
    action,
) => {
    const { id, move } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    defenceItem.move = move
}

export const setIndividualValue: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; stat: Stats; value: number }>
> = (state, action) => {
    const { id, stat, value } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    // 変更後の個体値が 0以上31以下 のときだけ更新する
    if (0 <= value && value <= 31) {
        defenceItem.pokemon.individualValue[stat] = value
    }
}

export const setEffectValue: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; stat: Stats; value: number }>
> = (state, action) => {
    const { id, stat, value } = action.payload
    const defenceItem = state.find(item => item.id === id)

    if (!defenceItem) return

    // 変更後の努力値が 0以上252以下 のときだけ更新する
    const diffValue = value - defenceItem.pokemon.effectValue[stat]
    if (0 <= value && value <= 252) {
        defenceItem.pokemon.effectValue[stat] = value
        defenceItem.pokemon.effectValue.total = defenceItem.pokemon.effectValue.total + diffValue
    }
}

export const setRankCoef: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; target: 'main' | 'def'; value: number }>
> = (state, action) => {
    const { id, target, value } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    if (target === 'main') defenceItem.pokemon.rankCoefAtk = value
    else defenceItem.pokemon.rankCoefDef = value
}

export const switchDefencePokemonIndex: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; direction: 'increment' | 'decrement' }>
> = (state, action) => {
    const { id, direction } = action.payload
    const defenceItemIndex = state.findIndex(item => item.id === id)
    const targetIndex = direction === 'increment' ? defenceItemIndex + 1 : defenceItemIndex - 1
    if (defenceItemIndex < 0 || targetIndex < 0 || targetIndex >= state.length) return

    const tmp = state[defenceItemIndex]
    state[defenceItemIndex] = state[targetIndex]
    state[targetIndex] = tmp
}

export const removeDefencePokemon: CaseReducer<DefencePokemonsState, PayloadAction<{ id: string }>> = (
    state,
    action,
) => {
    const { id } = action.payload
    return state.filter(item => item.id !== id)
}

///
/// For Middleware
///

export const calcActualValue: CaseReducer<DefencePokemonsState, PayloadAction<{ id: string; stat: Stats }>> = (
    state,
    action,
) => {
    const { id, stat } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    const base = defenceItem.pokemon.baseStats[stat]
    const EV = defenceItem.pokemon.effectValue[stat]
    const IV = defenceItem.pokemon.individualValue[stat]

    const LV = 50

    const baseAV =
        stat === 'H'
            ? Math.floor(((base * 2 + IV + EV / 4) * LV) / 100) + LV + 10
            : Math.floor(((base * 2 + IV + EV / 4) * LV) / 100) + 5

    defenceItem.pokemon.actualValue[stat] = baseAV
}

export const calcDamageRange: CaseReducer<
    DefencePokemonsState,
    PayloadAction<{ id: string; mainPokemon: MainPokemonState }>
> = (state, action) => {
    const { id, mainPokemon } = action.payload
    const defenceItem = state.find(item => item.id === id)
    if (!defenceItem) return

    // 攻守それぞれのレベル
    const mainPokemonLV = 50
    const defPokemonLV = 50

    // 能力ランク
    const rankCoefAtk =
        defenceItem.pokemon.rankCoefAtk >= 0
            ? (2 + defenceItem.pokemon.rankCoefAtk) / 2
            : 2 / (2 - defenceItem.pokemon.rankCoefAtk)
    const rankCoefDef =
        defenceItem.pokemon.rankCoefDef >= 0
            ? (2 + defenceItem.pokemon.rankCoefDef) / 2
            : 2 / (2 - defenceItem.pokemon.rankCoefDef)

    // 攻守それぞれの実数値
    const mainAV_Atk = Math.floor(
        rankCoefAtk * (defenceItem.move.kind === 'physics' ? mainPokemon.actualValue.A : mainPokemon.actualValue.C),
    )
    const defAV_Guards = [0.9, 1, 1.1].map(v =>
        calcPipeline(
            [
                defenceItem.move.kind === 'physics'
                    ? defenceItem.pokemon.actualValue.B
                    : defenceItem.pokemon.actualValue.D,
                v,
                rankCoefDef,
            ],
            Math.floor,
        ),
    )

    // タイプ一致 and テラスタイプ補正値
    const isMatchBaseType = mainPokemon.types.includes(defenceItem.move.type)
    const isMatchTerastalType = defenceItem.isTerastal && mainPokemon.terastalType === defenceItem.move.type
    const typeAdj = isMatchBaseType && isMatchTerastalType ? 2 : isMatchBaseType || isMatchTerastalType ? 1.5 : 1

    // タイプ相性補正値
    const typeCoef = getTypeCoef(defenceItem.move.type, defenceItem.pokemon.types)

    ///
    /// 計算開始
    ///

    // 基礎ダメージ
    const baseDamages = defAV_Guards.map(v => {
        return (
            calcPipeline(
                [(mainPokemonLV * 2) / 5 + 2, (defenceItem.move.power * mainAV_Atk) / v, 1 / defPokemonLV],
                Math.floor,
            ) + 2
        )
    })

    // 乱数補正 & タイプ一致補正 & タイプ相性補正の反映
    const baseDamageRanges = baseDamages.map(v => {
        return [0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.0].map(
            coef => {
                let base = Math.floor(v * coef)
                base = upRound(base * typeAdj)
                base = Math.floor(base * typeCoef)
                return base
            },
        )
    })

    // TODO: 持ち物補正etcはこちらに書く
    const damageRanges = baseDamageRanges

    defenceItem.damegeRanges = [0.9, 1, 1.1].map((v, index) => {
        return {
            natureCoef: v,
            min: damageRanges[index][0],
            max: damageRanges[index][damageRanges[index].length - 1],
            minPercentage: (damageRanges[index][0] / defenceItem.pokemon.actualValue.H) * 100,
            maxPercentage:
                (damageRanges[index][damageRanges[index].length - 1] / defenceItem.pokemon.actualValue.H) * 100,
        }
    })
}
