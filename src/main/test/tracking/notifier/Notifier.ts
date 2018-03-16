import {Notifier} from "../../../ts/tracking/notifier/Notifier";
import {Notification} from "../../../ts/tracking/notifier/Notification";
import {NotificationType} from "../../../ts/tracking/notifier/NotificationType";

describe("Notifier Tests", () => {
	let agent: TestAgent;
	let onNotifySpy: any;
	let notification: Notification;
	let posted: Notification;
	let mockReceiver = {
		onReceive: function(notification: Notification) {
			posted = notification;
		},
		getNotification: function(): Notification {
			return posted;
		}
	};

	class TestAgent extends Notifier {
		constructor() {
			super();
			this.onNotify((notification: Notification) => {
				mockReceiver.onReceive(notification);
				// switch (notification.name) {
				// 	case "receive":
				// 		mockReceiver.onReceive(notification);
				// 		break;
				// }
			});
		}
	}

	beforeEach(() => {
		agent = new TestAgent();

		notification = {
			name: "test",
			body: {data: 555},
			type: NotificationType.standard
		};

		onNotifySpy = spyOn(mockReceiver, "onReceive").and.callThrough();
	});

	it("sendNotification should send urgent notifications immediately", () => {
		notification.name = "receive";
		notification.type = NotificationType.urgent;

		agent.sendNotification(notification);

		expect(mockReceiver.onReceive).toHaveBeenCalledWith(notification);
		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(1);
		expect(mockReceiver.getNotification().name).toEqual(notification.name);
	});

	it("sendNotification should send standard notifications", () => {
		agent.startWhenNotificationEquals("test3");
		for (let i = 0; i < 5; i++) {
			notification.name = "test" + i;
			notification.type = NotificationType.standard;
			agent.sendNotification(notification);
		}
		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(5);
	});
});
