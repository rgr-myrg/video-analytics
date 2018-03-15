import {NotificationType} from "../event/NotificationType";

export interface Notification {
	name: string;
	body: any;
	type: NotificationType;
}
