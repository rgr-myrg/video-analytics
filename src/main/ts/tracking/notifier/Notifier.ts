import {Notification} from "./Notification";
import {NotificationType} from "./NotificationType";

export class Notifier {
	private standard: Notification[] = [];
	private priority: Notification[] = [];
	private notify: Function = new Function();
	private shouldPostNotifications: boolean = false;
	private whenNotificationName: string | undefined;

	public onNotify(callback: Function): void {
		this.notify = callback;
	}

	public startWhenNotificationEquals(name: string): void {
		this.whenNotificationName = name;
	}

	public sendNotification(notification: Notification): void {
		if (this.whenNotificationName === notification.name) {
			this.shouldPostNotifications = true;
		}

		switch(notification.type) {
			case NotificationType.standard:
				this.standard.unshift(notification);
				break;

			case NotificationType.priority:
				this.priority.unshift(notification);
				break;

			case NotificationType.urgent:
				this.notify.call(this, notification);
				break;
		}

		this.process(this.priority);
		this.process(this.standard);
	}

	private process(queue: Notification[]): void {
		if (!this.shouldPostNotifications) {
			return;
		}

		// Reverse loop with implicit comparison
		for (let i = queue.length; i--;) {
			this.notify.call(this, queue.shift());
		}
	}
}
