import Dexie, { Table } from 'dexie'

export interface Pokemon {
    name: string
    region?: string
    types: Types[]
    H: number
    A: number
    B: number
    C: number
    D: number
    S: number
    total: number
}

export interface Move {
    name: string
    type: Types
    kind: 'physics' | 'special'
    power: number
}

class PokemonDatabase extends Dexie {
    public Pokemons!: Table<Pokemon, string>
    public Moves!: Table<Move, string>

    public constructor() {
        super('PokemonDB')
        this.version(2).stores({
            Pokemons: '[name+region], total',
            Moves: 'name, power',
        })
    }
}

export const pokemonDb = new PokemonDatabase()
