import {Notification} from "../tracking/event/Notification";
import {NotificationType} from "../tracking/event/NotificationType";

export class TrackingAgent {
	private queueNormal: Notification[] = [];
	private queuePriority: Notification[] = [];
	public notify: Function = new Function();

	public subscribeForNotifications(callback: Function): void {
		this.notify = callback;
	}

	public scheduleNotification(notification: Notification): void {
		switch(notification.type) {
			case NotificationType.normal:
				this.queueNormal.unshift(notification);
				break;

			case NotificationType.priority:
				this.queuePriority.unshift(notification);
				break;

			case NotificationType.urgent:
				this.notify.call(this, notification);
				break;
		}
	}

	public postNotificatons(): void {
		this.processQueue(this.queuePriority);
		this.processQueue(this.queueNormal);
	}

	private processQueue(queue: Notification[]): void {
		// Reverse loop with implicit comparison
		for (let i = queue.length; i--;) {
			//this.queue.shift()!.emitSignal();
			this.notify.call(this, queue.shift());
		}
	}
}
