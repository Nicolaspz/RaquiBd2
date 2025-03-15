import { Request, Response } from 'express';
import { saveToken, getTokenByUserId } from '../services/notificationService';
//import fetch from 'node-fetch';

// 1️⃣ Salvar o token no banco
export const storeToken = async (req: Request, res: Response) => {
  const { userId, expoToken } = req.body;
  if (!userId || !expoToken) {
    return res.status(400).json({ error: 'userId e expoToken são obrigatórios' });
  }

  try {
    await saveToken(userId, expoToken);
    res.json({ message: 'Token salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar o token' });
  }
};

// 2️⃣ Enviar notificação para um usuário específico
export const sendNotification = async (req: Request, res: Response) => {
  const { userId, title, message } = req.body;

  try {
    console.log('📢 Iniciando envio de notificação...');
    console.log('🔍 Buscando token para userId:', userId);

    const userToken = await getTokenByUserId(userId);
    if (!userToken) {
      console.error('❌ Token não encontrado para o usuário:', userId);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Token encontrado:', userToken.expoToken);

    const notification = {
      to: userToken.expoToken,
      sound: 'default',
      title,
      body: message,
    };

    console.log('📨 Enviando notificação para Expo...');
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    const responseData = await response.json();
    console.log('📩 Resposta da API Expo:', responseData);

    if (!response.ok) {
      console.error('🚨 Erro ao enviar notificação:', responseData);
      return res.status(500).json({ error: 'Erro ao enviar notificação', details: responseData });
    }

    res.json({ message: 'Notificação enviada!' });
  } catch (error) {
    console.error('💥 Erro no servidor:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação', details: error.message });
  }
};

