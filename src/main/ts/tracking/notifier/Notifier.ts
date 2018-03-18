import {Notification} from "./Notification";
import {NotificationType} from "./NotificationType";
import {Receiver} from "./Receiver";

export class Notifier {
	private receivers: Receiver[] = [];

	public addReceiver(receiver: Receiver): void {
		this.receivers.unshift(receiver);
	}

	public getReceiver(name: string): Receiver {
		let receiver: Receiver = undefined;

		for (let i = this.receivers.length; i--;) {
			if (this.receivers[i].getId() === name) {
				receiver = this.receivers[i];
				break;
			}
		}

		return receiver;
	}

	public notify(eventName: string, eventData: any): void {
		this.sendNotification(eventName, eventData, NotificationType.standard);
	}

	public notifyPriority(eventName: string, eventData: any): void {
		this.sendNotification(eventName, eventData, NotificationType.priority);
	}

	public notifyUrgent(eventName: string, eventData: any): void {
		this.sendNotification(eventName, eventData, NotificationType.urgent);
	}

	private sendNotification(eventName: string, eventData: any, eventType: NotificationType): void {
		for (let i = this.receivers.length; i--;) {
			this.receivers[i].sendNotification({
				name: eventName,
				body: eventData,
				type: eventType
			});
		}
	}
}
