import { useLiveQuery } from 'dexie-react-hooks'
import { FC, Fragment, FormEventHandler, useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import Select, { ActionMeta, MultiValue } from 'react-select'

import { Move, Pokemon, pokemonDb } from '../models/pokemonDb'
import { actions, defencePokemonSelector, defencePokemonSelectorById } from '../modules/defencePokemon'
import { DamageRange } from '../modules/defencePokemon/state'
import { useAppDispatch, useAppSelector } from '../modules/store'
import { getDefeatIndicate } from '../modules/utils/calc'
import { convertStatsEn2Ja } from '../modules/utils/stats'
import { typeOptions } from '../modules/utils/types'

const MoveSearchBar: FC<{ id: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const [text, setText] = useState('リーフストーム')
    const [isInputting, setInputting] = useState(false)

    const suggestMoves = useLiveQuery(async () => {
        // テキストが空の時は負荷軽減のために空配列を返却
        if (!text) return []

        // 部分一致で検索。種族値順に10件返却
        return pokemonDb.Moves.orderBy('power')
            .reverse()
            .and(move => move.name.includes(text))
            .limit(5)
            .toArray()
    }, [text])

    const handleInput: React.FormEventHandler<HTMLInputElement> = e => {
        const inputText = e.currentTarget.value
        setInputting(true)
        setText(inputText)
    }

    const handleClick = (move: Move) => {
        setInputting(false)
        setText(move.name)
        dispatch(actions.setDefenceMove({ id: props.id, move }))
    }

    return (
        <div>
            <input
                type='text'
                className='form-control'
                style={{ height: 'calc(3rem + 2px)' }}
                onInput={handleInput}
                value={text}
            />
            <ul
                className='list-group'
                style={{ position: 'absolute', zIndex: 3000 }}
            >
                {isInputting &&
                    suggestMoves &&
                    suggestMoves.map(move => {
                        return (
                            <li
                                key={move.name}
                                className='list-group-item list-group-item-action'
                                onClick={() => handleClick(move)}
                            >
                                {move.name}
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}

const PokemonSearchBar: FC<{ id: string; className?: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const [text, setText] = useState('ヒマナッツ')
    const [isInputting, setInputting] = useState(false)

    const suggestPokemons = useLiveQuery(async () => {
        // テキストが空の時は負荷軽減のために空配列を返却
        if (!text) return []

        // 部分一致で検索。種族値順に10件返却
        return pokemonDb.Pokemons.orderBy('total')
            .reverse()
            .and(pokemon => pokemon.name.includes(text))
            .limit(5)
            .toArray()
    }, [text])

    const handleInput: React.FormEventHandler<HTMLInputElement> = e => {
        const inputText = e.currentTarget.value
        setInputting(true)
        setText(inputText)
    }

    const handleClick = (pokemon: Pokemon) => {
        const name = pokemon.region ? `${pokemon.name}（${pokemon.region}）` : pokemon.name
        setInputting(false)
        setText(name)
        dispatch(actions.setDefencePokemon({ id: props.id, pokemon, name }))
    }

    return (
        <div className={props.className}>
            <input
                type='text'
                className='form-control'
                style={{ height: 'calc(3rem + 2px)' }}
                onInput={handleInput}
                value={text}
            />
            <ul
                className='list-group'
                style={{ position: 'absolute', zIndex: '10' }}
            >
                {isInputting &&
                    suggestPokemons &&
                    suggestPokemons.map(pokemon => {
                        return (
                            <li
                                key={pokemon.name + pokemon.region}
                                className='list-group-item list-group-item-action'
                                onClick={() => handleClick(pokemon)}
                            >
                                {pokemon.name}
                                {pokemon.region && <small>（{pokemon.region}）</small>}
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}

const rank = [6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

const RankCounter: FC<{
    id: string
    target: 'main' | 'def'
    className?: string
}> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleChange: FormEventHandler<HTMLSelectElement> = e => {
        const new_value = parseInt(e.currentTarget.value)
        dispatch(
            actions.setRankCoef({
                id: props.id,
                target: props.target,
                value: new_value,
            }),
        )
    }

    return (
        <div className={'form-floating ' + props.className}>
            <select
                className='form-control form-control-sm form-select'
                value={props.target === 'main' ? defenceItem.pokemon.rankCoefAtk : defenceItem.pokemon.rankCoefDef}
                onChange={handleChange}
            >
                {rank.map((v, i) => {
                    return (
                        <option
                            value={v}
                            key={`defence_${props.target}_${props.id}_rank_option_${i}`}
                        >
                            {v > 0 ? `+${v}` : v}
                        </option>
                    )
                })}
            </select>
            <label>
                <span>能力変化</span>
            </label>
        </div>
    )
}

const IVCounter: FC<{
    id: string
    stat: Stats
    className?: string
}> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleChange: FormEventHandler<HTMLSelectElement> = e => {
        const new_value = parseInt(e.currentTarget.value)
        dispatch(
            actions.setIndividualValue({
                id: props.id,
                stat: props.stat,
                value: new_value,
            }),
        )
    }

    return (
        <div className={'me-2 ' + props.className}>
            <select
                className='form-control form-control-sm form-select'
                style={{ width: '4.5rem' }}
                value={defenceItem.pokemon.individualValue[props.stat]}
                onChange={handleChange}
            >
                {[...new Array(32)].map((_, i) => {
                    return (
                        <option
                            value={i}
                            key={`defence_${props.id}_iv_option_${props.stat}_${i}`}
                        >
                            {i}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

const EVSlider: FC<{ id: string; stat: Stats; className?: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleSlide: FormEventHandler<HTMLInputElement> = e => {
        const new_value = parseInt(e.currentTarget.value)
        dispatch(
            actions.setEffectValue({
                id: props.id,
                stat: props.stat,
                value: new_value,
            }),
        )
    }

    const handleIncrement = () => {
        dispatch(
            actions.setEffectValue({
                id: props.id,
                stat: props.stat,
                value: defenceItem.pokemon.effectValue[props.stat] + 4,
            }),
        )
    }

    const handleDecrement = () => {
        dispatch(
            actions.setEffectValue({
                id: props.id,
                stat: props.stat,
                value: defenceItem.pokemon.effectValue[props.stat] - 4,
            }),
        )
    }

    return (
        <div className={'form-floating ' + props.className}>
            <div className='form-control d-flex align-items-center'>
                <strong style={{ width: '3.5rem' }}>{defenceItem.pokemon.actualValue[props.stat]}</strong>
                <IVCounter
                    id={props.id}
                    stat={props.stat}
                />
                <div className={'input-group'}>
                    <div
                        className='input-group-text justify-content-end'
                        style={{ minWidth: '3.5rem' }}
                    >
                        {defenceItem.pokemon.effectValue[props.stat]}
                    </div>
                    <button
                        className='btn btn-light border'
                        type='button'
                        onClick={handleDecrement}
                    >
                        -
                    </button>
                    <input
                        type='range'
                        className='form-control form-range bg-white px-2'
                        style={{ height: '2.5rem' }}
                        min='0'
                        max='252'
                        step='4'
                        value={defenceItem.pokemon.effectValue[props.stat]}
                        onInput={handleSlide}
                    />
                    <button
                        className='btn btn-light border'
                        type='button'
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                </div>
            </div>
            <label>
                <span>{convertStatsEn2Ja(props.stat)}</span>
            </label>
        </div>
    )
}

const PokemonType: FC<{ id: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleChange = (option: MultiValue<TypeOption>, _: ActionMeta<TypeOption>) => {
        const types = option.map(item => item.value)
        dispatch(actions.setDefencePokemonType({ id: props.id, types }))
    }
    return (
        <Select<TypeOption, true>
            value={defenceItem.pokemon.types.map(item => ({
                label: item,
                value: item,
            }))}
            isMulti
            options={typeOptions}
            onChange={handleChange}
            isSearchable={false}
            isClearable={false}
            styles={{
                control: base => ({ ...base, padding: 0 }),
                dropdownIndicator: base => ({ ...base, padding: '0 2px' }),
                multiValue: base => ({ ...base, padding: 0 }),
                multiValueLabel: base => ({ ...base, maxHeight: '1.2rem', padding: 0, paddingLeft: 0 }),
                multiValueRemove: base => ({ ...base, padding: 0 }),
            }}
            formatOptionLabel={option => (
                <img
                    style={{ maxHeight: '1.2rem', verticalAlign: 'initial' }}
                    src={`/type_imgs/${option.value}.webp`}
                    alt={`${option.value}タイプ`}
                />
            )}
        />
    )
}

const TerastalSwitch: FC<{ id: string; className?: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleChange: FormEventHandler<HTMLInputElement> = e => {
        dispatch(
            actions.setTerastalMode({
                id: props.id,
                mode: e.currentTarget.checked,
            }),
        )
    }

    return (
        <div className={props.className}>
            <strong>テラスタル</strong>
            <div className='form-check form-switch align-middle'>
                <input
                    checked={defenceItem.isTerastal}
                    className='form-check-input'
                    style={{ height: '1.5rem', width: '2.5rem' }}
                    type='checkbox'
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

const AttackSettingRowContents: FC<{ id: string }> = props => {
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    return (
        <>
            <td className='pt-4'>
                <MoveSearchBar id={props.id} />
                <div className='row mt-2'>
                    <RankCounter
                        id={props.id}
                        target='main'
                        className='col-6'
                    />
                    <TerastalSwitch
                        id={props.id}
                        className='col-6'
                    />
                </div>
            </td>
            <td>→</td>
            <td className='pt-4'>
                <PokemonSearchBar
                    id={props.id}
                    className='mb-2'
                />
                <PokemonType id={props.id} />
            </td>
            <td className='pt-4'>
                <RankCounter
                    id={props.id}
                    target='def'
                    className='mb-2'
                />
                {/* <NatureCounter id={props.id} /> */}
            </td>
            <td className='pt-4'>
                <EVSlider
                    id={props.id}
                    stat='H'
                    className='mb-2'
                />
                {defenceItem.move.kind === 'physics' ? (
                    <EVSlider
                        id={props.id}
                        stat='B'
                    />
                ) : (
                    <EVSlider
                        id={props.id}
                        stat='D'
                    />
                )}
            </td>
        </>
    )
}

const PositionSwitch: FC<{ id: string }> = props => {
    const dispatch = useAppDispatch()
    const defenceItem = useAppSelector(defencePokemonSelectorById(props.id))
    if (!defenceItem) return null

    const handleDecrement = () => {
        dispatch(
            actions.switchDefencePokemonIndex({
                id: props.id,
                direction: 'decrement',
            }),
        )
    }

    const handleIncrement = () => {
        dispatch(
            actions.switchDefencePokemonIndex({
                id: props.id,
                direction: 'increment',
            }),
        )
    }

    const handleRemove = () => {
        dispatch(actions.removeDefencePokemon({ id: props.id }))
    }

    return (
        <div className='d-flex'>
            <div className='btn-group-vertical btn-group-sm'>
                <button
                    className='btn btn-light'
                    onClick={handleDecrement}
                >
                    ↑
                </button>
                <button
                    className='btn btn-light'
                    onClick={handleRemove}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-trash3'
                        viewBox='0 0 16 16'
                    >
                        <path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z' />
                    </svg>
                </button>
                <button
                    className='btn btn-light'
                    onClick={handleIncrement}
                >
                    ↓
                </button>
            </div>
        </div>
    )
}

const DamageIndicate: FC<{
    range: DamageRange
    kind: 'physics' | 'special'
    className?: string
}> = props => {
    return (
        <div className={props.className}>
            <strong>{getDefeatIndicate(props.range.minPercentage, props.range.maxPercentage)}</strong>：
            <span>
                {props.range.min}
                {' 〜 '}
                {props.range.max}
            </span>
            <span>
                （{props.range.minPercentage.toFixed(1)}%{' 〜 '}
                {props.range.maxPercentage.toFixed(1)}%）
            </span>
            <span>
                ※性格補正 {props.kind === 'physics' ? 'B' : 'D'} ×{props.range.natureCoef.toFixed(1)}
            </span>
        </div>
    )
}

const DamegeBar: FC<{ range: DamageRange; className?: string }> = props => {
    const barLeft = props.range.maxPercentage > 100 ? 0 : 100 - props.range.maxPercentage
    const barRight =
        props.range.minPercentage > 100 || 100 - props.range.minPercentage - barLeft < 0
            ? 0
            : 100 - props.range.minPercentage - barLeft

    const bgColor = barLeft > 50 ? 'bg-success' : barLeft > 25 ? 'bg-warning' : 'bg-danger'

    return (
        <div className={'progress ' + props.className}>
            <div
                className={'progress-bar ' + bgColor}
                role='progressbar'
                style={{ width: `${barLeft}%` }}
            ></div>
            <div
                className={'progress-bar ' + bgColor}
                role='progressbar'
                style={{ width: `${barRight}%`, opacity: 0.4 }}
            ></div>
        </div>
    )
}

const AttackTable: FC<{ className?: string }> = props => {
    const dispatch = useAppDispatch()
    const defencePokemons = useAppSelector(defencePokemonSelector)

    const handleClick = () => {
        dispatch(actions.createDefencePokemon())
    }

    return (
        <>
            <header>
                <h1 style={{ display: 'inline' }}>Attack</h1>
                <small className='mx-2'>(設定ポケモンが攻め)</small>
            </header>
            <table className={'table ' + props.className}>
                <thead>
                    <tr>
                        <th style={{ width: '15rem' }}>わざ</th>
                        <th style={{ width: '1rem' }}></th>
                        <th style={{ width: '18.5rem' }}>ポケモン</th>
                        <th style={{ width: '6.5rem' }}></th>
                        <th>個体値・努力値</th>
                        <th style={{ width: '1.5rem' }}></th>
                    </tr>
                </thead>
                <Flipper
                    element='tbody'
                    flipKey={defencePokemons.map(i => i.id).join('')}
                >
                    {defencePokemons.map(pokemon => (
                        <Fragment key={pokemon.id}>
                            <Flipped
                                key={pokemon.id + '_main'}
                                flipId={pokemon.id + '_main'}
                            >
                                <tr className='align-middle'>
                                    <AttackSettingRowContents id={pokemon.id} />
                                    <td
                                        rowSpan={2}
                                        className='border-bottom border-2'
                                    >
                                        <PositionSwitch id={pokemon.id} />
                                    </td>
                                </tr>
                            </Flipped>
                            <Flipped
                                key={pokemon.id + '_sub'}
                                flipId={pokemon.id + '_sub'}
                            >
                                <tr className='align-middle border-bottom border-2'>
                                    <td
                                        colSpan={5}
                                        className='align-middle pb-4'
                                    >
                                        {pokemon.damegeRanges.map((range, i) => (
                                            <Fragment key={`def_${pokemon.id}_damage_${i}`}>
                                                <DamageIndicate
                                                    range={range}
                                                    kind={pokemon.move.kind}
                                                />
                                                <DamegeBar range={range} />
                                            </Fragment>
                                        ))}
                                    </td>
                                </tr>
                            </Flipped>
                        </Fragment>
                    ))}
                    <tr>
                        <td colSpan={6}>
                            <button
                                className='btn btn-primary col-12'
                                onClick={handleClick}
                            >
                                ダメージ計算を追加する
                            </button>
                        </td>
                    </tr>
                </Flipper>
            </table>
        </>
    )
}

export default AttackTable
