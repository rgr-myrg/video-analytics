export class SdkLoader {
	private sdks: Map<string, string> = new Map();
	private key: string | undefined;
	private onready: Function = new Function();
	private onerror: Function = new Function();

	constructor() {
		this.sdks.set("Comscore", "/lib/streamsense.js");
	}

	public withKey(key: string): SdkLoader {
		this.key = key;
		return this;
	}

	public onReady(callback: Function): SdkLoader {
		this.onready = callback;
		return this;
	}

	public onError(callback: Function): SdkLoader {
		this.onerror = callback;
		return this;
	}

	public load(): void {
		if (this.key && !this.sdks.has(this.key)) {
			this.onerror.call(this, {err: "Sdk Key Not Found"});
			return;
		}
	}
}

export interface SdkError {
	err: string;
}
