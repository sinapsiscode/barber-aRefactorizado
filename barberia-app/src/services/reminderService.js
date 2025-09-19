/**
 * SERVICIO DE RECORDATORIOS DE CITAS
 * 
 * Maneja la lógica para enviar recordatorios automáticos a los clientes
 * 1 día antes de su cita programada a las 6:00 PM
 */

/**
 * Obtiene las citas que necesitan recordatorio
 * Se envían recordatorios 1 día antes a las 6 PM
 * 
 * @param {Array} appointments - Lista de citas
 * @returns {Array} Citas que necesitan recordatorio hoy
 */
export const getAppointmentsNeedingReminder = (appointments) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];
  
  // Solo considerar si es después de las 6 PM del día anterior
  const isAfter6PM = now.getHours() >= 18;
  
  if (!isAfter6PM) {
    return []; // No enviar recordatorios antes de las 6 PM
  }
  
  // Buscar citas programadas para mañana que estén confirmadas
  return appointments.filter(appointment => {
    const appointmentDate = appointment.date;
    const isForTomorrow = appointmentDate === tomorrowDateString;
    const isConfirmed = appointment.status === 'confirmed';
    const notCancelled = appointment.status !== 'cancelled';
    
    // Verificar si ya se envió recordatorio
    const reminderAlreadySent = appointment.reminderSent || false;
    
    return isForTomorrow && isConfirmed && notCancelled && !reminderAlreadySent;
  });
};

/**
 * Genera el mensaje de recordatorio para una cita
 * 
 * @param {Object} appointment - Cita para la cual generar recordatorio
 * @returns {Object} Objeto con título, mensaje y detalles
 */
export const generateReminderMessage = (appointment) => {
  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    title: '🔔 Recordatorio de Cita - Barbería Michael',
    message: `Hola ${appointment.clientName}! Te recordamos que tienes una cita programada para mañana.`,
    details: {
      date: formattedDate,
      time: appointment.time,
      barber: appointment.barberName,
      services: appointment.services ? `Servicio(s): ${appointment.services.length} servicio(s)` : 'Corte',
      duration: `${appointment.duration || 30} minutos`,
      price: `S/${appointment.totalPrice?.toLocaleString()}`,
      paymentMethod: appointment.paymentMethod
    },
    instructions: [
      'Llega 10 minutos antes de tu hora programada',
      'Trae tu DNI o documento de identidad',
      appointment.paymentMethod === 'efectivo' 
        ? 'Puedes pagar directamente en la barbería'
        : 'Tu pago ya ha sido verificado',
      'Si necesitas reprogramar, contáctanos con anticipación'
    ]
  };
};

/**
 * Simula el envío de recordatorio (SMS/WhatsApp/Email)
 * En producción esto se conectaría con APIs reales
 * 
 * @param {Object} appointment - Cita
 * @param {Object} client - Cliente
 * @param {Object} reminderData - Datos del recordatorio
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendReminderNotification = async (appointment, client, reminderData) => {
  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular diferentes canales de envío
  const channels = [];
  
  // SMS (simulado)
  if (client.phone) {
    channels.push({
      type: 'sms',
      destination: client.phone,
      status: 'sent',
      timestamp: new Date().toISOString(),
      message: `${reminderData.title}\n${reminderData.message}\n\nFecha: ${reminderData.details.date}\nHora: ${reminderData.details.time}\nBarbero: ${reminderData.details.barber}`
    });
  }
  
  // Email (simulado)
  if (client.email) {
    channels.push({
      type: 'email',
      destination: client.email,
      status: 'sent',
      timestamp: new Date().toISOString(),
      subject: reminderData.title,
      body: generateEmailBody(reminderData)
    });
  }
  
  // WhatsApp (simulado)
  if (client.phone) {
    channels.push({
      type: 'whatsapp',
      destination: client.phone,
      status: 'sent',
      timestamp: new Date().toISOString(),
      message: generateWhatsAppMessage(reminderData)
    });
  }
  
  console.log(`📱 Recordatorio enviado a ${client.name}:`, {
    appointmentId: appointment.id,
    channels: channels.length,
    scheduledFor: reminderData.details.date + ' ' + reminderData.details.time
  });
  
  return {
    success: true,
    appointmentId: appointment.id,
    clientId: client.id,
    sentAt: new Date().toISOString(),
    channels,
    reminderData
  };
};

/**
 * Genera el cuerpo del email de recordatorio
 */
const generateEmailBody = (reminderData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D4AF37;">${reminderData.title}</h2>
      <p>${reminderData.message}</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Detalles de tu cita:</h3>
        <ul>
          <li><strong>📅 Fecha:</strong> ${reminderData.details.date}</li>
          <li><strong>⏰ Hora:</strong> ${reminderData.details.time}</li>
          <li><strong>💇 Barbero:</strong> ${reminderData.details.barber}</li>
          <li><strong>✂️ Servicios:</strong> ${reminderData.details.services}</li>
          <li><strong>⏱️ Duración:</strong> ${reminderData.details.duration}</li>
          <li><strong>💰 Precio:</strong> ${reminderData.details.price}</li>
        </ul>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
        <h4>📝 Instrucciones importantes:</h4>
        <ul>
          ${reminderData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ul>
      </div>
      
      <p style="margin-top: 20px; color: #666;">
        ¡Te esperamos en Barbería Michael!<br>
        Si tienes alguna pregunta, no dudes en contactarnos.
      </p>
    </div>
  `;
};

/**
 * Genera el mensaje de WhatsApp
 */
const generateWhatsAppMessage = (reminderData) => {
  return `${reminderData.title}

${reminderData.message}

📋 *Detalles de tu cita:*
📅 *Fecha:* ${reminderData.details.date}
⏰ *Hora:* ${reminderData.details.time}
💇 *Barbero:* ${reminderData.details.barber}
✂️ *Servicios:* ${reminderData.details.services}
⏱️ *Duración:* ${reminderData.details.duration}
💰 *Precio:* ${reminderData.details.price}

📝 *Instrucciones importantes:*
${reminderData.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

¡Te esperamos en Barbería Michael! 💈`;
};

/**
 * Procesa todos los recordatorios pendientes
 * Esta función se ejecutaría en un cron job o scheduler
 * 
 * @param {Array} appointments - Lista de citas
 * @param {Array} clients - Lista de clientes
 * @param {Function} updateAppointment - Función para actualizar cita
 * @returns {Promise<Object>} Resumen de recordatorios enviados
 */
export const processAllReminders = async (appointments, clients, updateAppointment) => {
  const appointmentsNeedingReminder = getAppointmentsNeedingReminder(appointments);
  
  if (appointmentsNeedingReminder.length === 0) {
    return {
      processed: 0,
      sent: 0,
      failed: 0,
      details: []
    };
  }
  
  const results = {
    processed: appointmentsNeedingReminder.length,
    sent: 0,
    failed: 0,
    details: []
  };
  
  for (const appointment of appointmentsNeedingReminder) {
    try {
      // Buscar cliente
      const client = clients.find(c => c.id === appointment.clientId);
      if (!client) {
        results.failed++;
        results.details.push({
          appointmentId: appointment.id,
          error: 'Cliente no encontrado'
        });
        continue;
      }
      
      // Generar recordatorio
      const reminderData = generateReminderMessage(appointment);
      
      // Enviar recordatorio
      const sendResult = await sendReminderNotification(appointment, client, reminderData);
      
      if (sendResult.success) {
        // Marcar recordatorio como enviado
        await updateAppointment(appointment.id, {
          reminderSent: true,
          reminderSentAt: new Date().toISOString(),
          reminderChannels: sendResult.channels.length
        });
        
        results.sent++;
        results.details.push({
          appointmentId: appointment.id,
          clientName: client.name,
          channels: sendResult.channels.length,
          success: true
        });
      } else {
        results.failed++;
        results.details.push({
          appointmentId: appointment.id,
          clientName: client.name,
          error: 'Error al enviar recordatorio'
        });
      }
      
    } catch (error) {
      results.failed++;
      results.details.push({
        appointmentId: appointment.id,
        error: error.message
      });
    }
  }
  
  return results;
};