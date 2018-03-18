import {Receiver} from "../notifier/Receiver";
import {Event} from "../event/Event";
import {Notification} from "../notifier/Notification";
import {NotificationInterest} from "../notifier/NotificationInterest";

export class Comscore extends Receiver {
	constructor() {
		super();

		this.notification.subscribe([
			{event: Event.CONFIG_READY, listener: this.onConfigReady}
		]);

		// this.onNotify((notification: Notification) => {
		// 	switch (notification.name) {
		// 		case Event.CONFIG_READY:
		// 			this.onConfigReady();
		// 			break;
		// 	}
		// });
	}

	private onConfigReady(): void {

	}
}
