import {Receiver} from "../notifier/Receiver";
import {Event} from "../event/Event";
import {Notification} from "../notifier/Notification";
import {NotificationInterest} from "../notifier/NotificationInterest";
import {Config} from "../model/Config";

export class Comscore extends Receiver {
	public static NAME: string = "Comscore Agent";

	constructor() {
		super();

		this.notification.subscribe([
			{on: Event.CONFIG_READY, callback: this.onConfigReady}
		]);

		this.setId(Comscore.NAME);
	}

	private onConfigReady(config: Config): void {

	}

	private onSdkLoaded(): void {
		this.startReceivingNotifications();
	}
}
