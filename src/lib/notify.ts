import { AlertMessage } from '../types';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }

  return Notification.permission;
}

export async function notifyAlert(alert: AlertMessage): Promise<boolean> {
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return false;
  }

  new Notification(alert.title, {
    body: alert.message,
    tag: alert.id,
  });

  return true;
}
