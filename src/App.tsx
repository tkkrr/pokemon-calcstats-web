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
                    <div className='text-center'>
                        <span className='text-secondary'>※ 現在PC版のみの提供になります</span>
                        <br />
                        <a
                            className='btn btn-dark btn-sm'
                            href='https://github.com/tkkrr/pokemon-calcstats-web'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                className='bi bi-github'
                                viewBox='0 0 16 16'
                            >
                                <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
                            </svg>
                            <strong className='px-2'>Welcome PR !</strong>
                        </a>
                    </div>
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
