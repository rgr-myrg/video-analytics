import {Receiver} from "../notifier/Receiver";
import {Event} from "../event/Event";
import {Notification} from "../notifier/Notification";
import {NotificationInterest} from "../notifier/NotificationInterest";

export class Comscore extends Receiver {
	constructor() {
		super();

		this.notification.subscribe([
			{on: Event.CONFIG_READY, callback: this.onConfigReady}
		]);
	}

	private onConfigReady(): void {

	}
}
