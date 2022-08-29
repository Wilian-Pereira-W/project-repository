import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { IUserRepository } from '../../interface/userRepository';
import api from '../../service/api';
import styles from './styles.module.scss';
function Repository() {
  const params = useParams<{ repository: string }>();
  const [repository, setRepository] = useState<IUserRepository>({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const nameRepo = params.repository;

    async function load() {
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`/repos/${nameRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5,
          },
        }),
      ]);

      setRepository(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <h1>Carregado...</h1>
      </div>
    );
  }

  console.log(issues);

  return (
    <div className={styles.container}>
      <Link to="/">
        <FaArrowLeft color="#000" size={35} />
      </Link>
      <header className={styles.owner}>
        <img src={repository.owner?.avatar_url} alt={repository.owner?.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </header>
    </div>
  );
}

export default Repository;
