const { EMAIL_ADDRESS, EMAIL_NAME } = process.env;

interface IMailConfig {
  driver: 'ethereal' | 'ses' | 'sandinblue';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

const mailConfig = {
  defaults: {
    from: {
      email: EMAIL_ADDRESS || 'suporte@mestresdaweb.io',
      name: EMAIL_NAME || 'Equipe Booat',
    },
  },
} as IMailConfig;

export { mailConfig };
