export class NotificationInterest {
	private interests: Map<string, Function> = new Map();

	public subscribe(list: Interests[]):void {
		let i: number = list.length;

		for (let item of list) {
			this.interests.set(item.on, item.callback);
		}
	}

	public unsubscribe(eventName: string): void {
		this.interests.delete(eventName);
	}

	public post(eventName: string):Function {
		return <Function> this.interests.get(eventName);
	}

	public has(eventName: string): boolean {
		return this.interests.has(eventName);
	}
}

export interface Interests {
	on: string;
	callback: Function;
}
