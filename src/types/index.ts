/* 
 *  Copyright (C) 2022  Daniel Farquharson
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 (GPLv3)
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  See https://github.com/LordFarquhar/lx_console_app/blob/main/LICENSE an 
 *  implementation of GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 */

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
export declare type ProfileTypeIdentifier = {id: string, options: ProfileOptions};

export declare type FixtureChannel = {
	name: string;
	type: FixtureChannelType;
	bounds?: FixtureChannelBounds[];
	range?: FixtureChannelRange;
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
	"FILTER",
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
	range?: FixtureChannelRange;
};

export const FixtureChannelRangeUnitTypes = ["ANGLE", "MAGNITUDE"];
export declare type FixtureChannelRangeUnit = typeof FixtureChannelRangeUnitTypes[number];

export declare type FixtureChannelRange = {
	unit: FixtureChannelRangeUnit;
	initial: number;
	final: number;
};

export declare type FixtureChannelMode = {
	name?: string;
	count: number;
	channels: number[];
};

export declare type DmxAddressRange = {
	initial: number;
	final: number;
};

//

export declare type ChannelAddress = { channel: number; address: number };
