import {Notifier} from "./notifier/Notifier";
import {Event} from "./event/Event";
import {Config} from "./model/Config"
import {Comscore} from "./agent/Comscore";

export class VideoAnalytics extends Notifier {
	public onConfigReady(config: Config): void {
		if (config.comscore.enable) {
			this.addReceiver(new Comscore());
			//TODO Request SDK Loader w/Callback To Enable Receiver
			this.getReceiver(Comscore.NAME);
		}

		this.notifyUrgent(Event.CONFIG_READY, config);
	}
}
