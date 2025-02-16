const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

export async function getTelegramUsername(botToken: string, userId: number): Promise<string | null> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${botToken}/getChat?chat_id=${userId}`);
    const data = await response.json();
    
    if (data.ok && data.result.username) {
      return '@' + data.result.username;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Telegram username:', error);
    return null;
  }
}
