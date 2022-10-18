import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Route from './Route';

import ScrollToTop from './ScrollToTop';

import Login from '../pages/Login';
import Register from '../pages/Register';

import Deliveries from '../pages/Deliveries';
import DeliveriesNew from '../pages/Deliveries/new';
import DeliveriesEdit from '../pages/Deliveries/edit';

import Deliverymen from '../pages/Deliverymen';
import DeliverymenNew from '../pages/Deliverymen/new';
import DeliverymenEdit from '../pages/Deliverymen/edit';

import Recipients from '../pages/Recipients';
import RecipientsNew from '../pages/Recipients/new';
import RecipientsEdit from '../pages/Recipients/edit';

import Problems from '../pages/Problems';

function Routes() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />

        <Route path="/deliveries" exact component={Deliveries} isPrivate />
        <Route path="/deliveries/new" component={DeliveriesNew} isPrivate />
        <Route path="/deliveries/:id" component={DeliveriesEdit} isPrivate />

        <Route path="/deliverymen" exact component={Deliverymen} isPrivate />
        <Route path="/deliverymen/new" component={DeliverymenNew} isPrivate />
        <Route path="/deliverymen/:id" component={DeliverymenEdit} isPrivate />

        <Route path="/recipients" exact component={Recipients} isPrivate />
        <Route path="/recipients/new" component={RecipientsNew} isPrivate />
        <Route path="/recipients/:id" component={RecipientsEdit} isPrivate />

        <Route path="/problems" exact component={Problems} isPrivate />

        {/* 404 Page */}

        <Route path="*" component={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
}

export default Routes;
