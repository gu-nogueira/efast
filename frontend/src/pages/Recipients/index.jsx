import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';

import Loader from '../../components/Loader';
import Search from '../../components/Search';
import List from '../../components/List';
import Pagination from '../../components/Pagination';

import { MdOutlineAdd } from 'react-icons/md';
import { Row, Wrapper } from './styles';

function Recipients() {
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [recipientsTotal, setRecipientsTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const headers = {
    id: 'ID',
    name: 'Nome',
    address: 'Endereço',
  };

  const options = ['edit', 'delete'];
  const apiRoute = '/recipients';
  const params = {
    page: currentPage,
    perPage: 20,
    q: search,
  };

  async function fetchRecipients() {
    setLoading(true);
    try {
      const response = await api.get(apiRoute, { params });
      const { rows, total } = response.data;
      setRecipients(
        rows.map((recipient) => {
          recipient.raw = { ...recipient };
          recipient.id = `#${recipient.id.toString().padStart(2, 0)}`;
          recipient.name = recipient.destiny_name;
          const { address, number, complement, city, state } = recipient;
          recipient.address = `${address}, ${number} ${
            complement ?? ''
          }, ${city} - ${state}`;

          return recipient;
        })
      );
      setRecipientsTotal(total);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar os destinatários');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRecipients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  return (
    <>
      <h2>Gerenciando destinatários</h2>
      <Row mt={30}>
        <Wrapper flex gap={15}>
          <Search
            placeholder="Buscar por destinatários"
            onSearch={(value) => setSearch(value)}
          />
          <h4>{recipientsTotal} registros encontrados</h4>
        </Wrapper>
        <Link className="button" to="/recipients/new">
          <MdOutlineAdd size={20} />
          <span>Cadastrar</span>
        </Link>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <List
            category="recipients"
            headers={headers}
            data={recipients}
            options={options}
            apiRoute={apiRoute}
            fetchData={fetchRecipients}
          />
          <Pagination
            currentPage={currentPage}
            totalCount={recipientsTotal}
            perPage={params.perPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
}

export default Recipients;
