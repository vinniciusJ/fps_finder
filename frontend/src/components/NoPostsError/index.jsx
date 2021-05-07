import { AlertCircle } from "react-feather"

import styles from './styles.module.scss'

const NoPostsError = (props) => (
    <div className={styles.noPostsFound}>
        <AlertCircle width={96} height={96} color='#E7E6E6'/>
        <p> Nenhuma postagem {props?.type ?? ''} foi encontrada</p>
    </div>
)

export default NoPostsError