import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import roles from '../../config/roles';

import api from '../../services/api';

import Loader from '../../components/Loader';
import Search from '../../components/Search';
import List from '../../components/List';
import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import MultiSelect from '../../components/MultiSelect';

import { MdOutlineAdd } from 'react-icons/md';
import { Row, Wrapper } from './styles';

function Deliverymen() {
  const [loading, setLoading] = useState(false);
  const [deliverymen, setDeliverymen] = useState([]);
  const [deliverymenTotal, setDeliverymenTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([
    { value: 'deliveryman', label: 'Entregador' },
  ]);

  // ** Allowed roles for this view

  const allowedRoles = useMemo(() => {
    return roles.filter(
      (role) => role.value !== 'admin' && role.value !== 'customer'
    );
  }, []);

  // ** Allowed selected roles

  const allowedSelectedRoles = useMemo(() => {
    return selectedRoles.length > 0 ? selectedRoles : allowedRoles;
  }, [selectedRoles, allowedRoles]);

  const headers = {
    id: 'ID',
    avatar: 'Foto',
    name: 'Nome',
    email: 'Email',
    role: 'Função',
  };
  const options = ['edit', 'delete'];
  const apiRoute = '/users';
  const params = {
    roles: allowedSelectedRoles.map((role) => role.value),
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
          deliveryman.id = deliveryman.id.split('-')[0];
          deliveryman.avatar = (
            <Avatar
              name={deliveryman.name}
              imageUrl={deliveryman.avatar?.url}
            />
          );
          deliveryman.role = (
            <span className={`role ${deliveryman.role}`}>
              {roles.find((role) => role.value === deliveryman.role)?.label ||
                'Desconhecido'}
            </span>
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
  }, [currentPage, search, selectedRoles]);

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
        <Wrapper flex gap={15}>
          <MultiSelect
            name="roles"
            options={allowedRoles}
            defaultValue={allowedRoles[0]}
            onChange={setSelectedRoles}
            placeholder="Filtrar por funções"
            multi
          />
          <Link className="button" to="/deliverymen/new">
            <MdOutlineAdd size={20} />
            <span>Cadastrar</span>
          </Link>
        </Wrapper>
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
