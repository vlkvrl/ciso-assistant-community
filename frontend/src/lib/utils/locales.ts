import * as m from '../../paraglide/messages';

export const LOCALE_MAP = {
	en: {
		name: 'english',
		flag: '🇬🇧'
	},
	fr: {
		name: 'french',
		flag: '🇫🇷'
	},
	de: {
		name: 'german',
		flag: '🇩🇪'
	},
	ar: {
		name: 'arabic',
		flag: '🇸🇦'
	},
	pt: {
		name: 'portuguese',
		flag: '🇧🇷'
	},
	es: {
		name: 'spanish',
		flag: '🇪🇸'
	},
	nl: {
		name: 'dutch',
		flag: '🇳🇱'
	},
	it: {
		name: 'italian',
		flag: '🇮🇹'
	},
	pl: {
		name: 'polish',
		flag: '🇵🇱'
	},
	ro: {
		name: 'romanian',
		flag: '🇷🇴'
	},
	hi: {
		name: 'hindi'
	},
	ur: {
		name: 'urdu'
	},
	cs: {
		name: 'czech',
		flag: '🇨🇿'
	},
	sv: {
		name: 'swedish',
		flag: '🇸🇪'
	},
	id: {
		name: 'indonesian',
		flag: '🇮🇩'
	},
	da: {
		name: 'danish',
		flag: '🇩🇰'
	},
	hu: {
		name: 'hungarian',
		flag: '🇭🇺'
	},
	uk: {
		name: 'ukrainian',
		flag: '🇺🇦'
	},
	el: {
		name: 'greek',
		flag: '🇬🇷'
	}
};

export function toCamelCase(str: string) {
	if (typeof str !== 'string') return str;
	str = str.charAt(0).toLowerCase() + str.slice(1);
	return str.replace(/[_-\s]\w/g, (match) => match.charAt(1).toUpperCase());
}
