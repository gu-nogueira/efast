// ** Translate error message to Pt-BR

export default function errorParser(message) {
  const error = {
    // ** Order withdraw and delivery errors

    'Order not found': 'Encomenda não encontrada',
    'Order already exists': 'Encomenda já existe',
    'The delivery has already been withdrawn': 'A encomenda já foi retirada',
    'You do not have permission to deliver this delivery':
      'Você não tem permissão para entregar esta encomenda',
    'Exceeded limit of 5 orders per day':
      'Excedido o limite de 5 encomendas por dia',
    'The start date must be between 08:00 and 18:00':
      'A data de início deve estar entre 08:00 e 18:00',
    'The end date cannot be before start date':
      'A data de término não pode ser antes da data de início',
    'Cannot create new orders with past date':
      'Não é possível criar novas encomendas com data passada',
    'Cannot delivery orders in the future':
      'Não é possível entregar encomendas no futuro',
    'Cannot withdraw orders in the future':
      'Não é possível retirar encomendas no futuro',

    // * Problems errors

    'There is no problems for this delivery':
      'Não há problemas para esta encomenda',

    // ** Recipient errors

    'Recipient not found': 'Destinatário não encontrado',
    'Recipient already exists': 'Destinatário já existe',
    'Recipient name is required': 'Nome do destinatário é obrigatório',
    'Recipient street is required': 'Rua do destinatário é obrigatório',
    'Recipient number is required': 'Número do destinatário é obrigatório',
    'Recipient city is required': 'Cidade do destinatário é obrigatório',
    'Recipient state is required': 'Estado do destinatário é obrigatório',
    'Recipient zip code is required': 'CEP do destinatário é obrigatório',

    // ** Deliveryman errors

    'Deliveryman not found': 'Entregador não encontrado',
    'Deliveryman already exists': 'Entregador já existe',
    'Deliveryman name is required': 'Nome do entregador é obrigatório',
    'Deliveryman email is required': 'Email do entregador é obrigatório',
    'Deliveryman email is invalid': 'Email do entregador é inválido',

    // ** File errors

    'File not found': 'Arquivo não encontrado',
    'File already exists': 'Arquivo já existe',
    'File name is required': 'Nome do arquivo é obrigatório',
    'File path is required': 'Caminho do arquivo é obrigatório',

    // ** Session errors

    'User not found': 'Usuário não encontrado',
    'User already exists': 'Usuário já existe',
    'User name is required': 'Nome do usuário é obrigatório',
    'User email is required': 'Email do usuário é obrigatório',
    'User email is invalid': 'Email do usuário é inválido',
    'User password is required': 'Senha do usuário é obrigatório',
    'User password must be at least 6 characters':
      'Senha do usuário deve ter pelo menos 6 caracteres',
    'User password does not match': 'Senha do usuário não confere',
    'User password is incorrect': 'Senha do usuário está incorreta',
  };
  return error[message] || message;
}
