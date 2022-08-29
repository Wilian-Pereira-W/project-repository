import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { IFilter } from '../../interface/filter';
import { IIssue } from '../../interface/issue';
import { IUserRepository } from '../../interface/userRepository';
import api from '../../service/api';
import styles from './styles.module.scss';
function Repository() {
  const params = useParams<{ repository: string }>();
  const [repository, setRepository] = useState<IUserRepository>({});
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filters] = useState<IFilter[]>([
    {
      id: 0,
      state: 'all',
      label: 'Todas',
      active: true,
    },
    {
      id: 1,
      state: 'open',
      label: 'Abertas',
      active: false,
    },
    {
      id: 2,
      state: 'closed',
      label: 'Fechadas',
      active: false,
    },
  ]);
  const [filterIndex, setFilterIndex] = useState<number>(0);

  useEffect(() => {
    const nameRepo = params.repository;

    async function load() {
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`/repos/${nameRepo}/issues`, {
          params: {
            state: filters.find((f) => f.active)?.state,
            per_page: 5,
          },
        }),
      ]);

      setRepository(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [filters, params]);

  useEffect(() => {
    const loadIssue = async () => {
      const nameRepo = params.repository;

      const response = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    };

    loadIssue();
  }, [filterIndex, filters, page, params.repository]);

  const handlePage = (action: string) => {
    setPage(action === 'back' ? page - 1 : page + 1);
  };

  const handleFilter = (index: number) => {
    setFilterIndex(index);
    filters.forEach((element) => {
      if (element.id === index) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <h1>Carregado...</h1>
      </div>
    );
  }
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
      <main>
        <section className={styles.filterList}>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              className={filter.active ? styles.enable : ''}
              onClick={() => handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </section>
        <ul className={styles.issuesList}>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />

              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>

                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <section className={styles.pageActions}>
        {}
        <button
          type="button"
          onClick={() => handlePage('back')}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage('next')}>
          Próxima
        </button>
      </section>
    </div>
  );
}

export default Repository;
