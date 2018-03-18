import {Notification} from "./Notification";
import {NotificationType} from "./NotificationType";
import {NotificationInterest} from "./NotificationInterest";

export class Receiver {
	private standard: Notification[] = [];
	private priority: Notification[] = [];
	private shouldPostNotifications: boolean = false;

	public notification: NotificationInterest = new NotificationInterest();

	public startReceiving(): void {
		this.shouldPostNotifications = true;
		this.postNotifications();
	}

	public pauseReceiving(): void {
		this.shouldPostNotifications = false;
	}

	public sendNotification(notification: Notification): void {
		switch(notification.type) {
			case NotificationType.standard:
				this.standard.unshift(notification);
				break;

			case NotificationType.priority:
				this.priority.unshift(notification);
				break;

			case NotificationType.urgent:
				//this.notify.call(this, notification);
				this.notification.post(notification.name).call(this, notification);
				break;
		}

		this.postNotifications();
	}

	private postNotifications(): void {
		if (!this.shouldPostNotifications) {
			return;
		}

		this.process(this.priority);
		this.process(this.standard);
	}

	private process(queue: Notification[]): void {
		/* Reverse loop with implicit comparison */
		for (let i = queue.length; i--;) {
			let bundle: Notification = <Notification>queue.shift();
			this.notification.post(bundle.name).call(this, bundle);
		}
	}
}
