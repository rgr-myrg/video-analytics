import {Receiver} from "../notifier/Receiver";
import {Event} from "../event/Event";
import {Config} from "../model/Config";
import {LiveSegmentDTO} from "../dto/LiveSegmentDTO";

export class Comscore extends Receiver {
	public static NAME: string = "ComscoreReceiver";

	constructor() {
		super(Comscore.NAME);

		this.notification.subscribe([
			{on: Event.CONFIG_READY, callback: this.onConfigReady},
			{on: Event.SDK_LOADED, callback: this.onSdkLoaded}
		]);
	}

	private onConfigReady(config: Config): void {

	}

	private onSdkLoaded(): void {
		this.startReceivingNotifications();
	}

	private onContentMetadata(metadata: any): void {
		LiveSegmentDTO.fromContentMetadata(metadata);
	}
}
