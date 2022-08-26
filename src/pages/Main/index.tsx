import styles from './styles.module.scss';
import { FaGithub, FaPlus } from 'react-icons/fa';
import { SyntheticEvent, useState } from 'react';
function Main() {
  const [newRepo, setNewRepo] = useState<string>('');

  const handleInputChange = (value: string) => {
    setNewRepo(value);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log(newRepo);
  };

  return (
    <div className={styles.container}>
      <h1>
        <FaGithub size={25} />
        Meus Repositórios
      </h1>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.contentForm}>
        <input
          type="text"
          id="Adicionar Repositórios"
          value={newRepo}
          onChange={({ target }) => handleInputChange(target.value)}
        />
        <button type="submit" className={styles.contentFormButton}>
          <FaPlus color="#FFF" size={14} />
        </button>
      </form>
    </div>
  );
}

export default Main;
