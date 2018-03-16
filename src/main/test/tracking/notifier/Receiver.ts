import {Receiver} from "../../../ts/tracking/notifier/Receiver";
import {Notification} from "../../../ts/tracking/notifier/Notification";
import {NotificationType} from "../../../ts/tracking/notifier/NotificationType";

describe("Receiver Tests", () => {
	let receiver: TestReceiver;
	let onReceiveSpy: any;
	let onPrioritySpy: any;
	let notification: Notification;
	let posted: Notification;
	let mockReceiver = {
		onReceive: function(notification: Notification) {
			posted = notification;
		},
		onPriority: function(notification: Notification) {
			posted = notification;
		},
		getNotification: function(): Notification {
			return posted;
		}
	};

	class TestReceiver extends Receiver {
		constructor() {
			super();
			this.onNotify((notification: Notification) => {
				switch (notification.name) {
					case "onReceive":
						mockReceiver.onReceive(notification);
						break;
					case "onPriority":
						mockReceiver.onPriority(notification);
						break;
				}
			});
		}
	}

	beforeEach(() => {
		receiver = new TestReceiver();

		notification = {
			name: "onReceive",
			body: {data: 555},
			type: NotificationType.standard
		};

		onReceiveSpy = spyOn(mockReceiver, "onReceive").and.callThrough();
		onPrioritySpy = spyOn(mockReceiver, "onPriority").and.callThrough();
	});

	it("startReceiving should enable receiving notifications", () => {
		receiver.startReceiving();

		for (let i = 0; i < 5; i++) {
			receiver.sendNotification(notification);
		}

		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(5);
	});

	it("pauseReceiving should disable receiving notifications", () => {
		receiver.pauseReceiving();
		receiver.sendNotification(notification);
		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(0);
	});

	it("sendNotification should send urgent notifications immediately", () => {
		notification.type = NotificationType.urgent;

		receiver.sendNotification(notification);

		expect(mockReceiver.onReceive).toHaveBeenCalledWith(notification);
		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(1);
		expect(mockReceiver.getNotification().name).toEqual(notification.name);
	});

	it("sendNotification should send priority notifications ahead of the queue", () => {
		receiver.sendNotification({
			name: "onReceive",
			body: {},
			type: NotificationType.standard
		});

		receiver.sendNotification({
			name: "onPriority",
			body: {},
			type: NotificationType.priority
		});

		receiver.startReceiving();

		expect(mockReceiver.onPriority).toHaveBeenCalledBefore(onReceiveSpy);
	});
});
