import model from './model';

// we can extract an interface or super class here that has subscribe methods

class Reactive extends HTMLElement {
	constructor(boundTo) {
		super();
		this.boundTo = boundTo;
		this.subscriptions = [];
		this.subscribers = [];
	}

	subscribe(source, mapping) {
		source.addSubscription(this, mapping);
		// if it's a 2 way binding, we want the source to know when this object changes
		for (key in mapping) {
			if ((mapping[key] = 'twoWay')) {
				if (this[key]) {
					source[key].subscribeTo(this, key);
				} else {
					console.error(
						`Property ${key} does not exist on this Reactive component, so two-way binding is not possible`
					);
				}
			}
		}
	}

	addSubscriber(subscriber, property) {
		this.subscribers.push({ subscriber, property });
	}

	notifyChange(change) {
		this.subscribers.forEach((sub) => {
			if (sub.property === change.property) {
				sub.notify(change);
			}
		});
	}
}

customElements.define('popup-info', Reactive);
const reactor = document.createElement('popup-info');

reactor.subscribe(model, { instruments: 'twoWay' });
