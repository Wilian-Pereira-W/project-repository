import styles from './styles.module.scss';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import api from '../../service/api';
import { INameRepository } from '../../interface/nameRepository';

function Main() {
  const [newRepo, setNewRepo] = useState<string>('');
  const [repositories, setRepositories] = useState<INameRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<null | boolean>(null);

  useEffect(() => {
    const repoStorage: string | null = localStorage.getItem('repos');
    if (repoStorage) {
      console.log('oi');
      const respos: INameRepository[] = JSON.parse(repoStorage);
      setRepositories(respos);
    }
  }, []);

  useEffect(() => {
    if (repositories.length !== 0) {
      localStorage.setItem('repos', JSON.stringify(repositories));
    }
  }, [repositories]);

  const handleInputChange = (value: string) => {
    setNewRepo(value);
    setAlert(null);
  };

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      setAlert(null);
      api
        .get(`repos/${newRepo}`)
        .then((response) => {
          const hasRepo = repositories.find((r) => r.name === newRepo);

          if (hasRepo) {
            throw new Error('Repositório Duplicado');
          }

          setRepositories([...repositories, { name: response.data.full_name }]);
          setNewRepo('');
        })
        .catch((err: Error) => {
          setAlert(true);
          console.error('ops! ocorreu um erro' + err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [newRepo, repositories],
  );

  const handleDelete = useCallback(
    (repo: string) => {
      const find = repositories.filter((r) => r.name !== repo);
      setRepositories(find);
    },
    [repositories],
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
          className={alert ? styles.inputAlert : ''}
          onChange={({ target }) => handleInputChange(target.value)}
        />
        <button
          type="submit"
          className={styles.containsFormButton}
          disabled={loading}
        >
          {loading ? (
            <FaSpinner color="#FFF" size={14} className={styles.spinner} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </button>
      </form>

      <ul className={styles.containsList}>
        {repositories.map((repo, index) => (
          <li key={index}>
            <span>
              <button
                className={styles.buttonDelete}
                type="button"
                onClick={() => handleDelete(repo.name)}
              >
                <FaTrash size={14} />
              </button>
              {repo.name}
            </span>
            <a href="">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;
