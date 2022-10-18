const formatters = {
  currency: (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  },

  date: (value) => {
    return value.toLocaleDateString('pt-BR');
  },

  cep: (value) => {
    return value.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  phone: (value) => {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },

  cpf: (value) => {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  cnpj: (value) => {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  },
};

export default formatters;
