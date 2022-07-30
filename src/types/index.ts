export declare type USB_Device = {
	path: string; // path: 'COM9',
	manufacturer: string; // manufacturer: 'FTDI',
	serialNumber: string; // serialNumber: 'AL05O8JJ',
	pnpId: string; // pnpId: 'FTDIBUS\\VID_0403+PID_6001+AL05O8JJA\\0000',
	locationId: string; // locationId: undefined,
	friendlyName?: string; // friendlyName: 'USB Serial Port (COM9)',
	vendorId: string; // vendorId: '0403',
	productId: string; // productId: '6001'
};

//

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


export declare type DefinedProfile = Profile & {options: ProfileOptions};

export declare type FixtureChannel = {
	name: string;
	type: FixtureChannelType;
	bounds?: FixtureChannelBounds[];
};

export declare type FixtureChannelType =
	| "GENERIC"
	| "INTENSITY"
	| "COLOUR_WHEEL"
	| "COLOUR-RED"
	| "COLOUR-GREEN"
	| "COLOUR-BLUE"
	| "COLOUR-CYAN"
	| "COLOUR-YELLOW"
	| "COLOUR-YELLOW"
	| "GOBO-WHEEL"
	| "SHUTTER"
	| "POS-PAN"
	| "POS-PAN-FINE"
	| "POS-TILT"
	| "POS-TILT-FINE"
	| "FUNCTION";

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

export declare type GroupOptions = {
	id: number;
	name?: string;
	channels?: Set<number>;
};

export declare type CueOptions = {
	id: number;
	name?: string;
	channelData?: UniverseData;
};
