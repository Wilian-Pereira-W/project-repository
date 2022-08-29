import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import styles from './styles.module.scss';
function Repository() {
  const params = useParams<{ repository: string }>();
  const [repository, setRepository] = useState({});
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
  return (
    <div className={styles.container}>
      <h1>Repository</h1>
    </div>
  );
}

export default Repository;
