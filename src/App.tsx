import { useEffect } from 'react'

import pkgJson from '../package.json'
import AttackTable from './components/attackTable'
import PokemonChart from './components/mainChart'
import SearchBar from './components/mainSearchBar'
import MainStatsTable from './components/mainStatsTable'
import PokemonTypeBar from './components/mainTypeBar'
import { pokemonDb } from './models/pokemonDb'

const dataHost = import.meta.env.VITE_S3_HOST
const isDev = import.meta.env.DEV

// db更新までの時間．7日をmsに直す
const dbUpdateDelta = 1000 * 60 * 60 * 24 * 7

const App = () => {
    useEffect(() => {
        const lastUpdated = localStorage.getItem('lastUpdated')
        const isNeedUpdate = !lastUpdated || Date.now() - parseInt(lastUpdated) > dbUpdateDelta

        pokemonDb
            .transaction('rw', pokemonDb.Pokemons, pokemonDb.Moves, async () => {
                if (isNeedUpdate) {
                    // 更新が必要なので，現時点のデータを全削除する
                    localStorage.removeItem('lastUpdated')
                    await pokemonDb.Pokemons.clear()
                    await pokemonDb.Moves.clear()
                }

                const poke_count = await pokemonDb.Pokemons.count()
                if (isNeedUpdate || poke_count === 0) {
                    const data = await fetch(new URL('sv_base_stats.json', dataHost).href, {
                        cache: 'no-store',
                    }).then(res => res.json())
                    pokemonDb.Pokemons.bulkAdd(data)
                }

                const move_count = await pokemonDb.Moves.count()
                if (isNeedUpdate || move_count === 0) {
                    const data = await fetch(new URL('sv_moves.json', dataHost).href, {
                        cache: 'no-store',
                    }).then(res => res.json())
                    pokemonDb.Moves.bulkAdd(data)
                }

                if (isNeedUpdate) {
                    // 更新が成功したので，タイムスタンプを更新する
                    localStorage.setItem('lastUpdated', Date.now().toString())
                }
            })
            .catch(e => console.log(e))
    }, [])

    useEffect(() => {
        if (window) {
            // @ts-ignore
            window.adsbygoogle = window.adsbygoogle || []
            // @ts-ignore
            window.adsbygoogle.push({})
        }
    })

    return (
        <>
            <header
                className={'bg-light bg-gradient'}
                style={{ height: '60px' }}
            >
                <nav className='navbar container h-100'>
                    <a
                        className='navbar-brand'
                        href='#'
                    >
                        <strong className='fs-3'>ポケモン育成用計算機</strong>
                        <span className='text-secondary'> v{pkgJson.version}</span>
                    </a>
                    <span className='text-secondary'>※ 現在PC版のみの提供になります</span>
                </nav>
            </header>
            <main
                className='App container'
                style={{ height: 'calc(100vh - 120px)' }}
            >
                <div className='row'>
                    <div
                        className='col col-3'
                        style={{
                            height: 'calc(100vh - 120px)',
                            overflow: 'scroll',
                        }}
                    >
                        <SearchBar className='my-3' />
                        <PokemonTypeBar />
                        <PokemonChart />
                        <MainStatsTable className='col mt-4' />
                    </div>
                    <div
                        className='col col-9'
                        style={{
                            height: 'calc(100vh - 136px)',
                            overflow: 'scroll',
                        }}
                    >
                        <AttackTable />
                        <div className='d-flex justify-content-center'>
                            <ins
                                className='adsbygoogle'
                                style={{
                                    display: 'inline-block',
                                    width: '728px',
                                    height: '90px',
                                }}
                                data-ad-client={import.meta.env.VITE_AD_CLIENT_ID}
                                data-ad-slot={import.meta.env.VITE_AD_SLOT_1}
                                data-adtest={isDev ? 'on' : 'off'}
                            ></ins>
                        </div>
                    </div>
                </div>
            </main>
            <footer
                className='bg-secondary bg-gradient d-flex flex-column align-items-center justify-content-center'
                style={{ height: '60px', position: 'relative', zIndex: 2000 }}
            >
                <strong className='text-white'>
                    Twitter:{' '}
                    <a
                        className='text-white'
                        href='https://twitter.com/Acid1012'
                    >
                        @Acid1012
                    </a>
                </strong>
                <strong className='text-white'>
                    HP:{' '}
                    <a
                        className='text-white'
                        href='https://ticktuck.tech'
                    >
                        https://ticktuck.tech
                    </a>
                </strong>
            </footer>
        </>
    )
}

export default App
