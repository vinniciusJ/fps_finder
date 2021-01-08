import React from 'react'
import { useParams } from 'react-router-dom'
import { X, Plus } from 'react-feather'

import Input from '../../components/Input/Input'

import { debounceEvent } from '../../utils/index'

import './styles.css'

const Combination = (props) => {
    const { id } = useParams()

    return (
        <div className="Combination">
            <header className="combination-header">
                <h2>{id ? 'Editar combinação: ' : 'Criar uma combinação: '}</h2>
            </header>
            <main className="combination-data-container">
                <form className='combination-form'>
                    <Input 
                        label='Nome da combinação' 
                        name='name'
                        isRequired={true}
                        onKeyUp={(event) => console.log(event)}
                    />
                    <Input 
                        label='Placa de Vídeo' 
                        name='graphic_card'
                        isRequired={true}
                        onKeyUp={(event) => console.log(event)}
                    />
                    <Input 
                        label='Processador' 
                        name='processor'
                        isRequired={true}
                        onKeyUp={(event) => console.log(event)}
                    />
                    <Input 
                        label='Memória RAM' 
                        name='ram_memory'
                        isRequired={true}
                        onKeyUp={(event) => console.log(event)}
                    />
                    <Input 
                        label='Placa Mãe' 
                        name='motherboard'
                        isRequired={true}
                        onKeyUp={(event) => console.log(event)}
                    />
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>
                        <div className="fps-input">
                            <select name="game" id="game">
                                <option value="League Of Legends">LOL</option>
                                <option value="Valorant">Valorant</option>
                            </select>
                            <Input name='fps_average' type='number' isRequired={true} placeholder='FPS' onKeyUp={() => ''}/>
                            <button type='button' className="delete-fps-average">
                                <X width={24} strokeWidth={2} height={24}/>
                            </button>
                        </div>
                        <div className="fps-input">
                            <select name="game" id="game">
                                <option value="League Of Legends">LOL</option>
                                <option value="Valorant">Valorant</option>
                            </select>
                            <Input name='fps_average' isRequired={true} placeholder='FPS' onKeyUp={() => ''}/>
                            <button type='button' className="delete-fps-average">
                                <X width={24} strokeWidth={2} height={24}/>
                            </button>
                        </div>

                        <button type="button" className="add-new-fps-average">
                            <Plus color='#FFF' height={48} width={48} strokeWidth={1}/>
                        </button>
                    </div>
                </form>
            </main>
            <footer className="combination-options">
                <button className="btn main">Salvar</button>
                <button className="btn">Cancelar</button>
            </footer>
        </div>
    )
}

export default Combination