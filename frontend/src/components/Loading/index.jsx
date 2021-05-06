import styles from './styles.module.scss'

const Loading = () => (
    <div className={styles.loadingContainer}>
        <img className={styles.loading} src="/images/loading.gif" alt="Carregando"/>
    </div>
)

export default Loading