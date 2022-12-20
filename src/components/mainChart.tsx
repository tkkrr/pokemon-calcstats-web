import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'

import { mainPokemonSelector } from '../modules/mainPokemon'
import { useAppSelector } from '../modules/store'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Legend)

const PokemonChart = () => {
    const { baseStats, actualValue } = useAppSelector(mainPokemonSelector)

    const data = {
        labels: [
            [`${actualValue.H} (${baseStats.H})`, 'HP'],
            [`${actualValue.A} (${baseStats.A})`, 'こうげき'],
            [`${actualValue.B} (${baseStats.B})`, 'ぼうぎょ'],
            [`${actualValue.S} (${baseStats.S})`, 'すばやさ'],
            [`${actualValue.D} (${baseStats.D})`, 'とくぼう'],
            [`${actualValue.C} (${baseStats.C})`, 'とくこう'],
        ],
        datasets: [
            {
                label: '実数値',
                data: [actualValue.H, actualValue.A, actualValue.B, actualValue.S, actualValue.D, actualValue.C],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                pointRadius: 0,
                hitRadius: 0,
            },
            {
                label: '(種族値)',
                data: [baseStats.H, baseStats.A, baseStats.B, baseStats.S, baseStats.D, baseStats.C],
                fill: true,
                backgroundColor: 'rgba(235, 54, 93, 0.2)',
                borderWidth: 0,
                pointRadius: 0,
                hitRadius: 0,
            },
        ],
    }

    return (
        <div
            className='text-center'
            style={{ maxHeight: '300px' }}
        >
            <Radar
                style={{ display: 'inline' }}
                data={data}
                options={{
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 180,
                            ticks: {
                                stepSize: 30,
                                font: {
                                    size: 10,
                                },
                            },
                            pointLabels: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    )
}

export default PokemonChart
