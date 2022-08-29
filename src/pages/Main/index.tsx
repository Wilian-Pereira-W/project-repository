import styles from './styles.module.scss';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
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
