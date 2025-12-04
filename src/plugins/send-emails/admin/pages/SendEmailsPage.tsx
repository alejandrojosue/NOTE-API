import React, { useState } from 'react';
import { Button, Box, TextInput, Typography } from '@strapi/design-system';

const SendEmailsPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const phone = "50433971213";
  const msg = "Hola Susan, aqui comparto tu factura para que la puedas imprimir cuando gustes\n\nhttps://ccilp-sistema.com";
  const encodedMessage = encodeURIComponent(msg);

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  const handleSend = async () => {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      setStatus(`¡Enviados ${data.total} correos!`);
    } catch (err) {
      setStatus('Error al enviar correos');
      console.error(err);
    }
  };

  return (
    <Box padding={4} style={{ gap: 4 }}>
      <Box style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="beta">Asunto</Typography>
        <TextInput
          placeholder="Escribe el asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Box>

      <Box style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="beta">Mensaje</Typography>
        <textarea
          placeholder="Escribe el mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
      </Box>

      <Button onClick={handleSend}>Enviar a todos los usuarios</Button>

      <a href={url} target="_blank">Enviar whatsapp</a>
      {status && <p>{status}</p>}
    </Box>
  );
};

export default SendEmailsPage;
