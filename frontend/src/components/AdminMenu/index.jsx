import React from 'react'

import { Link } from 'react-router-dom'
import { debounceEvent } from '../../utils/index'
import { Plus, ArrowLeft } from 'react-feather'

import './styles.css'

const AdminMenu = ({ type, total, onSearch }) => {
    const baseURL = type === 'combination' ? '/2054dbb5f81969e56eede7fa2078218c/calculator/combination' : '/2054dbb5f81969e56eede7fa2078218c/blog/post'

    return (
        <header className="admin-header">
            <div>
                <Link className="link-go-back" to="/2054dbb5f81969e56eede7fa2078218c">
                    <ArrowLeft color="#FFF" width={24} height={24} strokeWidth={1.5}/>
                </Link>
                <p className="total">{ type === 'combination' ? 'Total de combinações' : 'Total de publicações' }: {total}</p>
                <label htmlFor="name">
                    <input 
                        type="text" 
                        placeholder="Buscar por nome..." 
                        id="name" 
                        name="name" 
                        onKeyUp={debounceEvent(onSearch)} 
                        spellCheck={false
                    }/>
                </label>
                <Link className="add-new-combination" to={baseURL}>
                    <Plus color="#FFF" width={24} height={24} strokeWidth={1.5}/>
                </Link>  
            </div>
        </header>
    )
}

export default AdminMenu