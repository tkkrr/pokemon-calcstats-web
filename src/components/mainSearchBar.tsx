import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useState } from 'react'

import { Pokemon, pokemonDb } from '../models/pokemonDb'
import { actions } from '../modules/mainPokemon'
import { useAppDispatch } from '../modules/store'

const mainSearchBar: FC<{ className?: string }> = props => {
    const dispatch = useAppDispatch()

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
        dispatch(actions.setMainPokemon({ pokemon, name }))
    }

    return (
        <div className={'form-floating ' + props.className}>
            <input
                type='text'
                id='main_pokemon_search_bar'
                className='form-control'
                onInput={handleInput}
                value={text}
            />
            <label htmlFor='main_pokemon_search_bar'>
                <span>ポケモン名</span>
            </label>
            <ul
                className='list-group'
                style={{ position: 'absolute', width: '100%', zIndex: 100 }}
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

export default mainSearchBar
