import {Receiver} from "../../../ts/tracking/notifier/Receiver";
import {Notification} from "../../../ts/tracking/notifier/Notification";
import {NotificationType} from "../../../ts/tracking/notifier/NotificationType";

describe("Receiver Tests", () => {
	let onReceiveSpy: any;
	let onPrioritySpy: any;
	let onUrgentSpy: any;
	let notification: Notification;
	let receiver: MockReceiver;

	let delegate = {
		onReceive: function(notification: Notification) {},
		onPriority: function(notification: Notification) {},
		onUrgent: function(notification: Notification) {}
	};

	class MockReceiver extends Receiver {
		constructor() {
			super();

			this.notification.subscribe([
				{event: "onReceive", listener: this.onReceive},
				{event: "onPriority", listener: this.onPriority},
				{event: "onUrgent", listener: this.onUrgent}
			]);
		}
		public onReceive(notification: Notification): void {
			delegate.onReceive(notification);
		}
		public onPriority(notification: Notification): void {
			delegate.onPriority(notification);
		}
		public onUrgent(notification: Notification): void {
			delegate.onUrgent(notification);
		}
	}

	beforeEach(() => {
		receiver = new MockReceiver();

		notification = {
			name: "onReceive",
			body: {data: 555},
			type: NotificationType.standard
		};

		onReceiveSpy  = spyOn(delegate, "onReceive").and.callThrough();
		onPrioritySpy = spyOn(delegate, "onPriority").and.callThrough();
		onUrgentSpy   = spyOn(delegate, "onUrgent").and.callThrough();
	});

	it("startReceiving should enable receiving notifications", () => {
		receiver.startReceiving();

		for (let i = 0; i < 5; i++) {
			receiver.sendNotification(notification);
		}

		expect(delegate.onReceive).toHaveBeenCalledTimes(5);
		expect(delegate.onReceive).toHaveBeenCalledWith(notification);
	});

	it("pauseReceiving should disable receiving notifications", () => {
		receiver.pauseReceiving();
		receiver.sendNotification(notification);

		expect(delegate.onReceive).toHaveBeenCalledTimes(0);
	});

	it("sendNotification should send urgent notifications immediately", () => {
		notification.name = "onUrgent";
		notification.type = NotificationType.urgent;

		receiver.sendNotification(notification);

		expect(delegate.onUrgent).toHaveBeenCalledWith(notification);
		expect(delegate.onUrgent).toHaveBeenCalledTimes(1);
	});

	it("sendNotification should send priority notifications ahead of the queue", () => {
		receiver.sendNotification({
			name: "onReceive",
			body: {},
			type: NotificationType.standard
		});

		receiver.sendNotification({
			name: "onPriority",
			body: {data: 1},
			type: NotificationType.priority
		});

		receiver.startReceiving();

		expect(delegate.onPriority).toHaveBeenCalledBefore(onReceiveSpy);
	});
});
