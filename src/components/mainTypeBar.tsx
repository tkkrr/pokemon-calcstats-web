import { FC } from 'react'
import Select, { ActionMeta, SingleValue, ContainerProps, ControlProps, GroupBase, components } from 'react-select'

import { actions, mainPokemonSelector } from '../modules/mainPokemon'
import { useAppDispatch, useAppSelector } from '../modules/store'
import { typeOptions } from '../modules/utils/types'

const BaseTypeBar: FC<{ className?: string }> = props => {
    const mainPokemon = useAppSelector(mainPokemonSelector)

    return (
        <div className={'form-floating ' + props.className}>
            <div className='form-control form-control-sm d-flex align-items-center justify-content-around'>
                {mainPokemon.types.map(type => {
                    return (
                        <img
                            style={{ maxWidth: 'calc(50% - 2px)', maxHeight: '1.2rem' }}
                            key={type}
                            src={`/type_imgs/${type}.webp`}
                            alt={`${type}タイプ`}
                        />
                    )
                })}
            </div>
            <label>
                <span>基本タイプ</span>
            </label>
        </div>
    )
}

// For <TerastalTypeSelect />
const SelectContainer = ({ children, ...props }: ContainerProps<TypeOption>) => {
    return (
        <div className={'form-floating ' + props.className}>
            {children}
            <label>
                <span>テラスタイプ</span>
            </label>
        </div>
    )
}

// For <TerastalTypeSelect />
const ControlComponent = (props: ControlProps<TypeOption, false, GroupBase<TypeOption>>) => (
    <components.Control
        {...props}
        className='form-control form-control-sm p-0'
    />
)

const TerastalTypeSelect: FC<{ className?: string }> = props => {
    const dispatch = useAppDispatch()
    const mainPokemon = useAppSelector(mainPokemonSelector)

    const handleChange = (option: SingleValue<TypeOption>, _: ActionMeta<TypeOption>) => {
        const new_value = option?.value || 'ノーマル'
        dispatch(actions.setTerastalType(new_value))
    }

    return (
        <Select<TypeOption, false>
            value={{
                label: mainPokemon.terastalType,
                value: mainPokemon.terastalType,
            }}
            className={props.className}
            options={typeOptions}
            onChange={handleChange}
            isSearchable={false}
            isClearable={false}
            components={{ SelectContainer, Control: ControlComponent }}
            styles={{ dropdownIndicator: base => ({ ...base, padding: '0 2px' }) }}
            formatOptionLabel={option => (
                <img
                    style={{ maxHeight: '1.2rem' }}
                    src={`/type_imgs/${option.value}.webp`}
                    alt={`${option.value}タイプ`}
                />
            )}
        />
    )
}

const PokemonTypeBar: FC<{ className?: string }> = props => {
    return (
        <div className={'row ' + props.className}>
            <BaseTypeBar className='col col-7' />
            <TerastalTypeSelect className='col col-5' />
        </div>
    )
}

export default PokemonTypeBar
