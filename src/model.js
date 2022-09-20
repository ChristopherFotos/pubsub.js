export class ModelProperty {
	constructor(value, pubsub) {
		// an array of objects like {subscriber:Reactive, binding: 'twoWay' | 'oneWay}
		this.value = value;
		this.pubsub = pubsub || [];
	}

	addSubscription(subscriber, binding) {
		const sub = {
			subscriber,
			binding,
		};

		this.pubsub.push(sub);
	}

	subscribeTo(source, property) {
		source.addSubscriber(this, property);
	}

	notifySubs() {
		this.pubsub.forEach((sub) => {});
	}

	notify(change) {
		for (const key in change) {
			this[key] = change[key];
		}
	}
}

export class Model {
	constructor() {
		/* 
      Each key is an event name, its value is an array of functions that will 
      fire when the event is triggered 
    */
		this.events = {
			addInstrument: [],
		};
	}

	addInstrument = (instrument, name) => {
		this.instruments[name] = instrument;
		this.fireEvent({ name: 'addInstrument', data: this.instruments });
		return this.instruments;
	};

	removeInstrument = (instrument, name) => {
		delete this.instruments[name];
		this.fireEvent({ name: 'removeInstrument', data: this.instruments });
		return this.instruments;
	};

	addSubscription(subscriber, mapping) {
		for (const key in mapping) {
			this[key].addSubscription(subscriber, mapping[key]);
		}
	}

	addListener(event, callback) {
		this.events[event].push(callback);
	}

	fireEvent(event) {
		this.events[event.name].forEach((callback) => callback(event.data));
	}
}

export default model = new Model();
