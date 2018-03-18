import {Notifier} from "./notifier/Notifier";
import {NotificationType} from "./notifier/NotificationType";
import {Receiver} from "./notifier/Receiver";
import {Event} from "./event/Event";
import {Config} from "./model/Config"
import {SdkLoader, SdkError} from "./util/SdkLoader";
import {Comscore} from "./agent/Comscore";

export class VideoAnalytics extends Notifier {
	private sdkLoader: SdkLoader = new SdkLoader();

	public onConfigReady(config: Config): void {
		if (config.comscore.enable) {
			this.addReceiver(new Comscore());
			this.loadSdk(Comscore.NAME);
		}

		this.notifyPriority(Event.CONFIG_READY, config);
	}

	private loadSdk(key: string): void {
		this.sdkLoader.withKey(key)
			.onReady(() => {
				let receiver: Receiver | undefined = this.getReceiver(key);

				if (receiver) {
					receiver.sendNotification({
						name: Event.SDK_LOADED,
						body: {},
						type: NotificationType.urgent
					});
				}
			})
			.onError((m: SdkError) => {})
			.load();
	}
}
