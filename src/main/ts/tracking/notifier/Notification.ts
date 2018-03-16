import {NotificationType} from "../notifier/NotificationType";

export interface Notification {
	name: string;
	body: any;
	type: NotificationType;
}
