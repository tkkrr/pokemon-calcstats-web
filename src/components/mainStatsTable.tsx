import { FC, FormEventHandler } from 'react'

import { mainPokemonSelector, actions } from '../modules/mainPokemon'
import { useAppDispatch, useAppSelector } from '../modules/store'
import { convertNatureEn2Ja, getStatsCoefFromNature, nature } from '../modules/utils/nature'
import { convertStatsEn2Ja } from '../modules/utils/stats'

const IVCounter: FC<{
    stat: Stats
    className?: string
}> = props => {
    const dispatch = useAppDispatch()
    const mainPokemon = useAppSelector(mainPokemonSelector)

    const id = `iv_stats_${props.stat}`

    const handleChange: FormEventHandler<HTMLSelectElement> = e => {
        const new_value = parseInt(e.currentTarget.value)
        dispatch(actions.setIndividualValue({ stat: props.stat, value: new_value }))
    }

    return (
        <div className={props.className}>
            <select
                id={id}
                className='form-control form-control-sm form-select'
                style={{ width: '4.5rem' }}
                value={mainPokemon.individualValue[props.stat]}
                onChange={handleChange}
            >
                {[...new Array(32)].map((_, i) => {
                    return (
                        <option
                            value={i}
                            key={`iv_option_${props.stat}_${i}`}
                        >
                            {i}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

const EVSlider: FC<{ stat: Stats; className?: string }> = props => {
    const dispatch = useAppDispatch()
    const mainPokemon = useAppSelector(mainPokemonSelector)

    const id = `ev_stats_${props.stat}`

    const handleSlide: FormEventHandler<HTMLInputElement> = e => {
        const new_value = parseInt(e.currentTarget.value)
        dispatch(actions.setEffectValue({ stat: props.stat, value: new_value }))
    }

    const handleIncrement = () => {
        dispatch(
            actions.setEffectValue({
                stat: props.stat,
                value: mainPokemon.effectValue[props.stat] + 4,
            }),
        )
    }

    const handleDecrement = () => {
        dispatch(
            actions.setEffectValue({
                stat: props.stat,
                value: mainPokemon.effectValue[props.stat] - 4,
            }),
        )
    }

    return (
        <div className={'input-group ' + props.className}>
            <div
                className='input-group-text justify-content-end'
                style={{ minWidth: '3.5rem' }}
            >
                {mainPokemon.effectValue[props.stat]}
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
                value={mainPokemon.effectValue[props.stat]}
                id={id}
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
    )
}

const natureOptions: { value: Nature; label: string }[] = nature.map(nature => {
    const coef = getStatsCoefFromNature(nature)
    const summaryCoef = ['AA', 'BB', 'CC', 'DD', 'SS'].includes(nature) ? '' : ` ${coef.upStat}↑ ${coef.downStat}↓`
    return {
        value: nature,
        label: convertNatureEn2Ja(nature) + summaryCoef,
    }
})

const NatureSelect: FC<{ className?: string }> = props => {
    const mainPokemon = useAppSelector(mainPokemonSelector)
    const dispatch = useAppDispatch()

    const handleChange: FormEventHandler<HTMLSelectElement> = e => {
        const new_value = e.currentTarget.value
        const option = natureOptions.find(nature => nature.value.includes(new_value))
        if (option) {
            dispatch(actions.setMainPokemonNature(option.value))
        }
    }

    return (
        <div className={props.className}>
            <select
                className='form-control form-control-sm form-select'
                style={{
                    fontSize: '0.8rem',
                    padding: '0 0.4rem',
                }}
                value={mainPokemon.nature}
                onChange={handleChange}
            >
                {natureOptions.map(option => {
                    return (
                        <option
                            value={option.value}
                            key={`nature_${option.value}`}
                        >
                            {option.label}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

const StatRow: FC<{ stat: Stats }> = props => {
    const mainPokemon = useAppSelector(mainPokemonSelector)
    const { upStat, downStat } = mainPokemon.statsCoef

    const statCoef = upStat === downStat ? '' : props.stat === upStat ? '↑' : props.stat === downStat ? '↓' : ''
    const tableClass = statCoef === '↑' ? 'table-danger' : statCoef === '↓' ? 'table-info' : ''

    return (
        <tr className={'align-middle ' + tableClass}>
            <td colSpan={2}>
                <div className={'form-floating my-1'}>
                    <div className='form-control d-flex align-items-center'>
                        <IVCounter
                            stat={props.stat}
                            className='me-2'
                        />
                        <EVSlider stat={props.stat} />
                    </div>
                    <label>
                        <span>{convertStatsEn2Ja(props.stat) + statCoef}</span>
                    </label>
                </div>
            </td>
        </tr>
    )
}

const MainStatsTable: FC<{ className?: string }> = props => {
    const {
        effectValue: { total },
    } = useAppSelector(mainPokemonSelector)

    const isMaxEVUsage = total >= 508

    return (
        <table className={'table table-sm ' + props.className}>
            <thead>
                <tr>
                    <th scope='col'>
                        個体値・
                        <span className={`text-center ${isMaxEVUsage ? 'text-danger' : ''}`}>
                            {isMaxEVUsage ? '努力値（これ以上振れません）' : '努力値'}
                        </span>
                    </th>
                    <th
                        scope='col'
                        className='text-center'
                    >
                        <NatureSelect />
                    </th>
                </tr>
            </thead>
            <tbody>
                <StatRow stat={'H'} />
                <StatRow stat={'A'} />
                <StatRow stat={'B'} />
                <StatRow stat={'C'} />
                <StatRow stat={'D'} />
                <StatRow stat={'S'} />
            </tbody>
        </table>
    )
}

export default MainStatsTable
