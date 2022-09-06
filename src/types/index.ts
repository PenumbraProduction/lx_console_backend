export declare type UniverseData = {
	[key: number]: number;
};

//

export declare type Brand = {
	id: string;
	name: string;
};
export declare type Profile = {
	id: string;
	brand: string;
	name: string;
	channels: FixtureChannel[];
	channelModes: FixtureChannelMode[];
};

export declare type ProfileOptions = {
	channelMode: number;
};

export declare type DefinedProfile = Profile & { options: ProfileOptions };

export declare type FixtureChannel = {
	name: string;
	type: FixtureChannelType;
	bounds?: FixtureChannelBounds[];
	addressOffset?: number;
};

export const FixtureChannelTypes = [
	"GENERIC",
	"INTENSITY",
	"COLOUR-WHEEL",
	"COLOUR-RED",
	"COLOUR-GREEN",
	"COLOUR-BLUE",
	"COLOUR-CYAN",
	"COLOUR-YELLOW",
	"COLOUR-MAGENTA",
	"COLOUR-AMBER",
	"COLOUR-WHITE",
	"COLOUR-UV",
	"GOBO-WHEEL",
	"GOBO-WHEEL-MODIFIER",
	"PRISM",
	"PRISM-MODIFIER",
	"SHUTTER",
	"POS-PAN",
	"POS-PAN-FINE",
	"POS-TILT",
	"POS-TILT-FINE",
	"FUNCTION",
	"UNKNOWN"
] as const;

export declare type FixtureChannelType = typeof FixtureChannelTypes[number];

export declare type FixtureChannelBounds = {
	name: string;
	initial: number;
	final: number;
};

export declare type FixtureChannelMode = {
	count: number;
	channels: number[];
};

export declare type DmxAddressRange = {
	initial: number;
	final: number;
};

//

export declare type ChannelAddress = { channel: number; address: number };

export declare type CueOptions = {
	id: number;
	name?: string;
	channelData?: UniverseData;
};
