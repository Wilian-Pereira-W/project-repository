import styles from './styles.module.scss';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { SyntheticEvent, useCallback, useState } from 'react';
import api from '../../service/api';
import { INameRepository } from '../../interface/nameRepository';

function Main() {
  const [newRepo, setNewRepo] = useState<string>('');
  const [repositories, setRepositories] = useState<INameRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (value: string) => {
    setNewRepo(value);
  };

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      api
        .get(`repos/${newRepo}`)
        .then((response) => {
          setRepositories([...repositories, { name: response.data.full_name }]);
          setNewRepo('');
        })
        .catch((err: Error) => {
          console.error('ops! ocorreu um erro' + err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [newRepo, repositories],
  );

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
        <button
          type="submit"
          className={styles.contentFormButton}
          disabled={loading}
        >
          {loading ? (
            <FaSpinner color="#FFF" size={14} className={styles.spinner} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </button>
      </form>
    </div>
  );
}

export default Main;
