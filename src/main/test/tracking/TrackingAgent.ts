import {TrackingAgent} from "../../ts/tracking/TrackingAgent";
import {Notification} from "../../ts/tracking/event/Notification";
import {NotificationType} from "../../ts/tracking/event/NotificationType";

describe("TrackingAgent Tests", () => {
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

	class TestAgent extends TrackingAgent {
		constructor() {
			super();
			this.subscribeForNotifications((notification: Notification) => {
				switch (notification.name) {
					case "receive":
						mockReceiver.onReceive(notification);
						break;
				}
			});
		}
	}

	beforeEach(() => {
		agent = new TestAgent();

		notification = {
			name: "test",
			body: {data: 555},
			type: NotificationType.normal
		};

		onNotifySpy = spyOn(mockReceiver, "onReceive").and.callThrough();
	});

	it("scheduleNotification should send urgent notifications immediately", () => {
		notification.name = "receive";
		notification.type = NotificationType.urgent;

		agent.scheduleNotification(notification);

		expect(mockReceiver.onReceive).toHaveBeenCalledWith(notification);
		expect(mockReceiver.onReceive).toHaveBeenCalledTimes(1);
		expect(mockReceiver.getNotification().name).toEqual(notification.name);
	});
});
