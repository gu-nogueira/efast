import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import api from '../../services/api';

import Loader from '../../components/Loader';
import Search from '../../components/Search';
import List from '../../components/List';
import Pagination from '../../components/Pagination';

import { MdOutlineAdd } from 'react-icons/md';
import { Content, Description, Row, Wrapper } from './styles';

function formatDate(date) {
  const isoDate = parseISO(date);
  return format(isoDate, "dd/MM/yyyy 'as' HH'h'mm", { locale: ptBR });
}

function ViewContent({ data }) {
  if (data)
    return (
      <Content>
        <strong>Informações da encomenda</strong>
        <p>Encomenda #{data.delivery_id.toString().padStart(2, 0)}</p>
        <hr />
        <strong>Descrição</strong>
        <Description>{data.description}</Description>
        <hr />
        <strong>Última atualização</strong>
        <p>{formatDate(data.updated_at)}</p>
      </Content>
    );
}

function Problems() {
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [problemsTotal, setProblemsTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const headers = {
    name: 'Encomenda',
    description: 'Problema',
    updated_at: 'Atualizado em',
  };

  const options = ['view', 'cancel'];
  const apiRoute = '/deliveries/problems';
  const params = {
    page: currentPage,
    perPage: 20,
    q: search,
  };

  async function fetchProblems() {
    setLoading(true);
    try {
      const response = await api.get(apiRoute, { params });
      const { rows, total } = response.data;
      setProblems(
        rows.map((problem) => {
          problem.raw = { ...problem };
          problem.name = `#${problem.delivery_id.toString().padStart(2, 0)}`;
          problem.description = (
            <Wrapper text width="30vw">
              {problem.description}
            </Wrapper>
          );
          problem.updated_at = formatDate(problem.updated_at);
          return problem;
        })
      );
      setProblemsTotal(total);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar os problemas de entregas');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  return (
    <>
      <h2>Problemas na entrega</h2>
      <Row mt={30}>
        <Wrapper flex gap={15}>
          <Search
            placeholder="Buscar por problemas de entrega"
            onSearch={(value) => setSearch(value)}
          />
          <h4>{problemsTotal} registros encontrados</h4>
        </Wrapper>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <List
            category="problems"
            headers={headers}
            data={problems}
            options={options}
            apiRoute={apiRoute}
            fetchData={fetchProblems}
            viewContent={ViewContent}
          />
          <Pagination
            currentPage={currentPage}
            totalCount={problemsTotal}
            perPage={params.perPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
}

export default Problems;
