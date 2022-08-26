import styles from './styles.module.scss';
import { FaGithub, FaPlus } from 'react-icons/fa';
function Main() {
  return (
    <div className={styles.container}>
      <h1>
        <FaGithub size={25} />
        Meus Repositórios
      </h1>
      <form
        onSubmit={() => {
          console.log('oi');
        }}
        className={styles.contentForm}
      >
        <input type="text" id="Adicionar Repositórios" />
        <button type="submit" className={styles.contentFormButton}>
          <FaPlus color="#FFF" size={14} />
        </button>
      </form>
    </div>
  );
}

export default Main;
