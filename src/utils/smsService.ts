import axios from 'axios';

async function sendSmsToAdmin({ name, userPhone, proces_number, userPassword,fatura,info }) {
  const adminPhone = process.env.ADMIN_PHONE;
  const message = `${info}:
  
Nome: ${name}
${userPhone}
${proces_number}
${fatura}
${userPassword}

`;

  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_HUB_API_KEY;
  const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
  const smsFrom = process.env.SMS_FROM;

  let token;
  try {
    const authResponse = await axios.post('https://app.smshub.ao/api/authentication', {
      authId: smsApiKey,
      secretKey: smsSecretKey,
    });

    if (authResponse.data.status === 200) {
      token = authResponse.data.data.authToken;
      console.log("Aki mesmo ",authResponse.data.data.authToken)
    } else {
      throw new Error('Falha ao autenticar com a API de SMS');
    }
  } catch (error) {
    console.error('Erro ao autenticar com a API de SMS:', error.message);
    return false; // Retorna false em caso de erro de autenticação
  }

  try {
    const response = await axios.post(
      smsApiUrl,
      {
        contactNo: [adminPhone],
        message: message,
        from:smsFrom,
      },
      {
        headers: {
          accessToken: token,
        },
      }
    );

    if (
      response.data.status === 200 &&
      response.data.sms[0]?.data?.status === 1
    ) {
      console.log('SMS enviado com sucesso');
      return true; // Retorna true se o SMS for enviado
    }

    console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
    return false; // Retorna false em caso de falha no envio do SMS
  } catch (error) {
    console.error('Erro ao enviar SMS:', error.message);
    return false; // Retorna false em caso de erro ao enviar o SMS
  }
}

async function sendSmsPddo(userPhone) {
  const adminPhone = process.env.ADMIN_PHONE;
  const message = `novo pedido recebido de ${userPhone}, verifica no App `;

  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_HUB_API_KEY;
  const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
  const smsFrom = process.env.SMS_FROM;

  let token;
  try {
    const authResponse = await axios.post('https://app.smshub.ao/api/authentication', {
      authId: smsApiKey,
      secretKey: smsSecretKey,
    });

    if (authResponse.data.status === 200) {
      token = authResponse.data.data.authToken;
      //console.log("Aki mesmo ",authResponse.data.data.authToken)
    } else {
      throw new Error('Falha ao autenticar com a API de SMS');
    }
  } catch (error) {
    console.error('Erro ao autenticar com a API de SMS:', error.message);
    return false; // Retorna false em caso de erro de autenticação
  }

  try {
    const response = await axios.post(
      smsApiUrl,
      {
        contactNo: [adminPhone],
        message: message,
        from:smsFrom,
      },
      {
        headers: {
          accessToken: token,
        },
      }
    );

    if (
      response.data.status === 200 &&
      response.data.sms[0]?.data?.status === 1
    ) {
      console.log('SMS enviado com sucesso');
      return true; // Retorna true se o SMS for enviado
    }

    console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
    return false; // Retorna false em caso de falha no envio do SMS
  } catch (error) {
    console.error('Erro ao enviar SMS:', error.message);
    return false; // Retorna false em caso de erro ao enviar o SMS
  }
}

async function sendSmsToAdminFactu({message, userPhone }) {
      const adminPhone = userPhone;
      //const message = `Caro Cliente, o prazo de pagamento da sua factura N0º: ${fatura} está no fim.`;

      const smsApiUrl = process.env.SMS_API_URL;
      const smsApiKey = process.env.SMS_HUB_API_KEY;
      const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
      const smsFrom = process.env.SMS_FROM;

      let token;
      try {
        const authResponse = await axios.post('https://app.smshub.ao/api/authentication', {
          authId: smsApiKey,
          secretKey: smsSecretKey,
        });

        if (authResponse.data.status === 200) {
          token = authResponse.data.data.authToken;
          //console.log("Aki mesmo ",authResponse.data.data.authToken)
        } else {
          throw new Error('Falha ao autenticar com a API de SMS');
        }
      } catch (error) {
        //console.error('Erro ao autenticar com a API de SMS:', error.message);
        return false; // Retorna false em caso de erro de autenticação
      }

      try {
        const response = await axios.post(
          smsApiUrl,
          {
            contactNo: [adminPhone],
            message: message,
            from:smsFrom,
          },
          {
            headers: {
              accessToken: token,
            },
          }
        );

        if (
          response.data.status === 200 &&
          response.data.sms[0]?.data?.status === 1
        ) {
          console.log('SMS enviado com sucesso');
          return true; // Retorna true se o SMS for enviado
        }

        console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
        return false; // Retorna false em caso de falha no envio do SMS
      } catch (error) {
        console.error('Erro ao enviar SMS:', error.message);
        return false; // Retorna false em caso de erro ao enviar o SMS
      }
}

export { sendSmsToAdmin, sendSmsToAdminFactu,sendSmsPddo};
