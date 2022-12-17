import { FC, FormEventHandler } from 'react'

import { actions, mainPokemonSelector } from '../modules/mainPokemon'
import { useAppDispatch, useAppSelector } from '../modules/store'
import { allTypes } from '../modules/utils/types'

const BaseTypeBar: FC<{ className?: string }> = props => {
    const mainPokemon = useAppSelector(mainPokemonSelector)

    return (
        <div className={'form-floating ' + props.className}>
            <input
                className='form-control form-control-sm'
                style={{ background: 'none' }}
                type='text'
                disabled
                value={mainPokemon.types.join('  ')}
            />
            <label>
                <span>基本タイプ</span>
            </label>
        </div>
    )
}

const TerastalTypeSelect: FC<{ className?: string }> = props => {
    const dispatch = useAppDispatch()
    const mainPokemon = useAppSelector(mainPokemonSelector)

    const handleChange: FormEventHandler<HTMLSelectElement> = e => {
        const value = e.currentTarget.value as Types
        dispatch(actions.setTerastalType(value))
    }

    return (
        <div className={'form-floating ' + props.className}>
            <select
                className='form-control form-control-sm form-select'
                value={mainPokemon.terastalType}
                onChange={handleChange}
            >
                {allTypes.map((v, i) => {
                    return (
                        <option
                            value={v}
                            key={`main_terastal_type_${i}`}
                        >
                            {v}
                        </option>
                    )
                })}
            </select>
            <label>
                <span>テラスタイプ</span>
            </label>
        </div>
    )
}

const PokemonTypeBar: FC<{ className?: string }> = props => {
    return (
        <div className={'row ' + props.className}>
            <BaseTypeBar className='col col-6' />
            <TerastalTypeSelect className='col col-6' />
        </div>
    )
}

export default PokemonTypeBar
