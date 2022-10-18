import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Modal from '../Modal';

import api from '../../services/api';

import { MdMoreHoriz, MdEdit, MdDelete, MdCancel } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import { HiEmojiSad } from 'react-icons/hi';
import { Container, DropBox, DeleteWarning, Content } from './styles';

function List({
  category,
  headers,
  data,
  options,
  apiRoute,
  fetchData,
  viewContent: ViewContent,
}) {
  const [active, setActive] = useState();
  const dropDownRef = useRef(new Array(data.length));

  /*
   *  Options behavior
   */

  async function handleDelete(id, name) {
    try {
      await api.delete(`${apiRoute}/${id}`);
      toast.success(`${name} excluído com sucesso`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        `Não foi possível excluir ${name}, tente novamente mais tarde`
      );
    }
  }

  async function handleCancel(id, name) {
    try {
      await api.delete(`/deliveries/${id}/cancel`);
      toast.success(`Encomenda ${name} cancelada com sucesso`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        `Não foi possível cancelar a encomenda ${name}, tente novamente mais tarde`
      );
    }
  }

  const handleClickOutside = useCallback(
    (e) => {
      if (
        dropDownRef.current[active] &&
        !dropDownRef.current[active].contains(e.target)
      ) {
        return setActive(null);
      }
    },
    [active]
  );

  /*
   *  useEffect listener for dropDown
   */

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Container>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.values(headers).map((header, index) => (
                <th key={index} scope="col">
                  {header}
                </th>
              ))}
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((registry, index) => (
              <tr key={registry + index}>
                {Object.keys(headers).map((column, index) => (
                  <td key={column + index} data-label={headers[column]}>
                    {registry[column]}
                  </td>
                ))}
                <td data-label="Ações">
                  <button
                    title="Ações"
                    onClick={() => {
                      setActive(index);
                    }}
                  >
                    <MdMoreHoriz size={22} />
                    <DropBox
                      ref={(el) => (dropDownRef.current[index] = el)}
                      active={active === index ? true : false}
                    >
                      {options.map((option, index) => {
                        switch (option) {
                          case 'view':
                            return (
                              <li key={index}>
                                <button
                                  onClick={async () =>
                                    Modal.show({
                                      title: `Dados de ${registry.name}`,
                                      content: (
                                        <ViewContent data={registry.raw} />
                                      ),
                                      resolver: () => 0,
                                    })
                                  }
                                >
                                  <AiFillEye className={option} /> Visualizar
                                </button>
                              </li>
                            );

                          case 'delete': {
                            return (
                              <li key={index}>
                                <button
                                  onClick={async () =>
                                    Modal.show({
                                      title: `Excluir ${registry.name}`,
                                      content: (
                                        <>
                                          <DeleteWarning />
                                          <span>
                                            <b>Atenção:</b> esta ação é
                                            irreverrsível! Deseja continuar?
                                          </span>
                                        </>
                                      ),
                                      cta: 'Excluir',
                                      resolver: () =>
                                        handleDelete(
                                          registry.raw.id,
                                          registry.name
                                        ),
                                    })
                                  }
                                >
                                  <MdDelete className={option} /> Deletar
                                </button>
                              </li>
                            );
                          }

                          case 'cancel': {
                            return (
                              <li key={index}>
                                <button
                                  onClick={async () =>
                                    Modal.show({
                                      title: `Cancelar encomenda ${registry.name}`,
                                      content: (
                                        <>
                                          <DeleteWarning />
                                          <span>
                                            <b>Atenção:</b> esta ação é
                                            irreverrsível! Deseja continuar?
                                          </span>
                                        </>
                                      ),
                                      cta: 'Excluir',
                                      resolver: () =>
                                        handleCancel(
                                          registry.raw.delivery_id,
                                          registry.name
                                        ),
                                    })
                                  }
                                >
                                  <MdCancel className={option} /> Cancelar
                                  encomenda
                                </button>
                              </li>
                            );
                          }

                          default:
                            return (
                              <li key={index}>
                                <Link
                                  to={{
                                    pathname: `/${category}/${registry.id}`,
                                    state: registry.raw,
                                  }}
                                >
                                  <MdEdit className={option} /> Editar
                                </Link>
                              </li>
                            );
                        }
                      })}
                    </DropBox>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Content>
          <span className="badge purple">
            Nenhum resultado encontrado <HiEmojiSad size={16} />
          </span>
        </Content>
      )}
    </Container>
  );
}

export default List;
