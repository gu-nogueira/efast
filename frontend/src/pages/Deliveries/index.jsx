import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';

import api from '../../services/api';

import Loader from '../../components/Loader';
import Search from '../../components/Search';
import List from '../../components/List';
import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';

import { MdOutlineAdd } from 'react-icons/md';
import { Row, Wrapper, Content } from './styles';
import SignatureExample from '../../assets/images/signaature-example.png';

function ViewContent({ data }) {
  function formatCep(cep) {
    return (Number(cep) / 1000).toString().replace('.', '-');
  }

  function formatDate(date) {
    if (!date) {
      return <span className="pending">Pendente</span>;
    }
    const isoDate = parseISO(date);
    return isoDate.toLocaleDateString('pt-BR');
  }

  if (data)
    return (
      <Content>
        <strong>Informações da encomenda</strong>
        <p>
          {data.recipient.address}, {data.recipient.number}
        </p>
        <p>
          {data.recipient.city} - {data.recipient.state}
        </p>
        <p>{formatCep(data.recipient.cep)}</p>
        <hr />
        <strong>Datas</strong>
        <p>
          <b>Retirada:</b> {formatDate(data.start_date)}
        </p>
        <p>
          <b>Entrega:</b> {formatDate(data.end_date)}
        </p>
        <hr />
        <strong>Assinatura do destinatário</strong>
        <img
          src={data.signature?.url || SignatureExample}
          alt="Assinatura do destinatário"
        />
      </Content>
    );
}

function Deliveries() {
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [deliveriesTotal, setDeliveriesTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const headers = {
    id: 'ID',
    recipient: 'Destinatário',
    deliveryman: 'Entregador',
    city: 'Cidade',
    state: 'Estado',
    status: 'Status',
  };
  const options = ['view', 'edit', 'delete'];
  const apiRoute = '/deliveries';
  const params = {
    page: currentPage,
    perPage: 20,
    q: search,
  };

  async function fetchDeliveries() {
    setLoading(true);
    try {
      const response = await api.get(apiRoute, { params });
      const { rows, total } = response.data;
      setDeliveries(
        rows.map((delivery) => {
          delivery.raw = { ...delivery };
          delivery.id = `#${delivery.id.toString().padStart(2, 0)}`;
          delivery.name = `encomenda ${delivery.id}`;
          delivery.city = delivery.recipient.city;
          delivery.state = delivery.recipient.state;
          delivery.recipient = delivery.recipient.destiny_name;
          if (delivery.deliveryman) {
            delivery.deliveryman = (
              <Wrapper flex gap={10}>
                <Avatar
                  name={delivery.deliveryman.name}
                  imageUrl={delivery.deliveryman.avatar?.url}
                />
                <span>{delivery.deliveryman.name}</span>
              </Wrapper>
            );
          }
          delivery.status = (
            <span className={`status ${delivery.status}`}>
              {delivery.status}
            </span>
          );

          return delivery;
        })
      );
      setDeliveriesTotal(total);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar as encomendas');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  return (
    <>
      <h2>Gerenciando encomendas</h2>
      <Row mt={30}>
        <Wrapper flex gap={15}>
          <Search
            placeholder="Buscar por encomendas"
            onSearch={(value) => setSearch(value)}
          />
          <h4>{deliveriesTotal} registros encontrados</h4>
        </Wrapper>
        <Link className="button" to="/deliveries/new">
          <MdOutlineAdd size={20} />
          <span>Cadastrar</span>
        </Link>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <List
            category="deliveries"
            headers={headers}
            data={deliveries}
            options={options}
            apiRoute={apiRoute}
            fetchData={fetchDeliveries}
            viewContent={ViewContent}
          />
          <Pagination
            currentPage={currentPage}
            totalCount={deliveriesTotal}
            perPage={params.perPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
}

export default Deliveries;
