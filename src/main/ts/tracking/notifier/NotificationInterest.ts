export class NotificationInterest {
	private interests: Map<string, Function> = new Map();

	public subscribe(list: Interests[]):void {
		let i: number = list.length;

		for (let item of list) {
			this.interests.set(item.event, item.listener);
		}
	}

	public post(eventName: string):Function {
		return <Function> this.interests.get(eventName);
	}
}

export interface Interests {
	event: string;
	listener: Function;
}
