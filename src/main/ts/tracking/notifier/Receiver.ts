import {Notification} from "./Notification";
import {NotificationType} from "./NotificationType";
import {NotificationInterest} from "./NotificationInterest";

export class Receiver {
	private standard: Notification[] = [];
	private priority: Notification[] = [];
	private shouldPostNotifications: boolean = false;
	private key: string | undefined;

	public notification: NotificationInterest = new NotificationInterest();

	constructor(key: string) {
		this.key = key;
	}

	public startReceivingNotifications(): void {
		this.shouldPostNotifications = true;
		this.postNotifications();
	}

	public pauseReceivingNotifications(): void {
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
				this.notification.post(notification.name).call(this, notification);
				break;
		}

		this.postNotifications();
	}

	public getKey(): string | undefined {
		return this.key;
	}

	public destroy(): void {
		delete this.standard;
		delete this.priority;
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

			if (this.notification.has(bundle.name)) {
				this.notification.post(bundle.name).call(this, bundle);
			}
		}
	}
}
