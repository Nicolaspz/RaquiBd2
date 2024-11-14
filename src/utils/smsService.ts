import axios from 'axios'

async function sendSmsToAdmin({ userName, userEmail, userPhone, userRole, userPassword }) {
  const adminPhone = process.env.ADMIN_PHONE; // Número de telefone da área administrativa
  const message = `Novo usuário criado:\nNome: ${userName}\nEmail: ${userEmail}\nTelefone: ${userPhone}\nFunção: ${userRole}\nSenha: ${userPassword}`;

  // Configurações para a API do SMSHUB
  const response = await axios.post('https://api.smshub.com/sms/send', {
    to: adminPhone,
    message: message,
    // outros parâmetros necessários pela API do SMSHUB
    api_key: process.env.SMSHUB_API_KEY // Chave da API do SMSHUB
  });

  if (response.data.status !== 'success') {
    throw new Error('Erro ao enviar SMS para a administração');
  }
}

export { sendSmsToAdmin };
