import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { signOut } from '../../store/modules/auth/actions';

import { Container, Menu, Item, Profile } from './styles';
import { MdOutlineLogout } from 'react-icons/md';
import Logo from '../../assets/svgs/logo.svg';

function Header({ url }) {
  const navigation = [
    {
      name: 'Encomendas',
      route: '/deliveries',
    },
    {
      name: 'Entregadores',
      route: '/deliverymen',
    },
    {
      name: 'Destinatários',
      route: '/recipients',
    },
    {
      name: 'Problemas',
      route: '/problems',
    },
  ];
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <nav>
        <img src={Logo} alt="Logo" />
        <Menu>
          {navigation.map((nav, index) => (
            <Item key={index} route={nav.route} selected={url === nav.route}>
              {nav.name}
            </Item>
          ))}
        </Menu>
      </nav>
      <Profile>
        <span>{profile.name}</span>
        <button onClick={handleLogout}>
          Fazer Logout <MdOutlineLogout />
        </button>
      </Profile>
    </Container>
  );
}

export default Header;
