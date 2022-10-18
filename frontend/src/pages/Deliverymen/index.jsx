import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';

import Loader from '../../components/Loader';
import Search from '../../components/Search';
import List from '../../components/List';
import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';

import { MdOutlineAdd } from 'react-icons/md';
import { Row, Wrapper } from './styles';

function Deliverymen() {
  const [loading, setLoading] = useState(false);
  const [deliverymen, setDeliverymen] = useState([]);
  const [deliverymenTotal, setDeliverymenTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const headers = {
    id: 'ID',
    avatar: 'Foto',
    name: 'Nome',
    email: 'Email',
  };

  const options = ['edit', 'delete'];
  const apiRoute = '/deliverymen';
  const params = {
    page: currentPage,
    perPage: 20,
    q: search,
  };

  async function fetchDeliverymen() {
    setLoading(true);
    try {
      const response = await api.get(apiRoute, { params });
      const { rows, total } = response.data;
      setDeliverymen(
        rows.map((deliveryman) => {
          deliveryman.raw = { ...deliveryman };
          deliveryman.id = `#${deliveryman.id.toString().padStart(2, 0)}`;
          deliveryman.avatar = (
            <Avatar
              name={deliveryman.name}
              imageUrl={deliveryman.avatar?.url}
            />
          );

          return deliveryman;
        })
      );
      setDeliverymenTotal(total);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar os entregadores');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDeliverymen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  return (
    <>
      <h2>Gerenciando entregadores</h2>
      <Row mt={30}>
        <Wrapper flex gap={15}>
          <Search
            placeholder="Buscar por entregadores"
            onSearch={(value) => setSearch(value)}
          />
          <h4>{deliverymenTotal} registros encontrados</h4>
        </Wrapper>
        <Link className="button" to="/deliverymen/new">
          <MdOutlineAdd size={20} />
          <span>Cadastrar</span>
        </Link>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <List
            category="deliverymen"
            headers={headers}
            data={deliverymen}
            options={options}
            apiRoute={apiRoute}
            fetchData={fetchDeliverymen}
          />
          <Pagination
            currentPage={currentPage}
            totalCount={deliverymenTotal}
            perPage={params.perPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
}

export default Deliverymen;
