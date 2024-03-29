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
		public static NAME: string = "MockReceiver";
		constructor() {
			super(MockReceiver.NAME);

			this.notification.subscribe([
				{on: "receive", callback: this.onReceive},
				{on: "priority", callback: this.onPriority},
				{on: "urgent", callback: this.onUrgent}
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
			name: "receive",
			body: {data: 555},
			type: NotificationType.standard
		};

		onReceiveSpy  = spyOn(delegate, "onReceive").and.callThrough();
		onPrioritySpy = spyOn(delegate, "onPriority").and.callThrough();
		onUrgentSpy   = spyOn(delegate, "onUrgent").and.callThrough();
	});

	it("startReceivingNotifications should enable receiving notifications", () => {
		receiver.startReceivingNotifications();

		for (let i = 0; i < 5; i++) {
			receiver.sendNotification(notification);
		}

		expect(delegate.onReceive).toHaveBeenCalledTimes(5);
		expect(delegate.onReceive).toHaveBeenCalledWith(notification);
	});

	it("pauseReceivingNotifications should disable receiving notifications", () => {
		receiver.pauseReceivingNotifications();
		receiver.sendNotification(notification);

		expect(delegate.onReceive).toHaveBeenCalledTimes(0);
	});

	it("sendNotification should send urgent notifications immediately", () => {
		notification.name = "urgent";
		notification.type = NotificationType.urgent;

		receiver.sendNotification(notification);

		expect(delegate.onUrgent).toHaveBeenCalledWith(notification);
		expect(delegate.onUrgent).toHaveBeenCalledTimes(1);
	});

	it("sendNotification should send priority notifications ahead of the queue", () => {
		receiver.sendNotification({
			name: "receive",
			body: {},
			type: NotificationType.standard
		});

		receiver.sendNotification({
			name: "priority",
			body: {data: 1},
			type: NotificationType.priority
		});

		receiver.startReceivingNotifications();

		expect(delegate.onPriority).toHaveBeenCalledBefore(onReceiveSpy);
	});

	it("unsubscribe should delete the callback", () => {
		receiver.startReceivingNotifications();

		receiver.notification.unsubscribe("receive");
		receiver.sendNotification({
			name: "receive",
			body: {},
			type: NotificationType.standard
		});

		expect(receiver.notification.has("receive")).toBe(false);
		expect(delegate.onReceive).toHaveBeenCalledTimes(0);
	});

	it("subscribe should add the callback", () => {
		receiver.startReceivingNotifications();

		receiver.notification.subscribe([{on: "receive", callback: receiver.onReceive}]);
		receiver.sendNotification({
			name: "receive",
			body: {},
			type: NotificationType.standard
		});

		expect(receiver.notification.has("receive")).toBe(true);
		expect(delegate.onReceive).toHaveBeenCalledTimes(1);
	});

	it("getKey should return the receiver's key", () => {
		expect(receiver.getKey()).toEqual(MockReceiver.NAME);
	});
});
