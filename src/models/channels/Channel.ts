import { DefinedProfile, DmxAddressRange, FixtureChannel } from "../../../types/Types";

export default class Channel {
    id: number;
    name: string;
    profile: DefinedProfile;
    dmxAddressRange: DmxAddressRange;
    channelMap: FixtureChannel[]; // a list of the profiles channels with the channelMode applied
    
    output: Buffer; // * "-1" is considered "don't care"
    
    constructor(id: number, profile: DefinedProfile, dmxAddressStart: number) {
        this.id = id;
        this.name = profile.name;
        this.profile = profile;
        this.dmxAddressRange = {initial: dmxAddressStart, final: dmxAddressStart + profile.channelModes[profile.options.channelMode].count - 1};
        this.channelMap = profile.channelModes[profile.options.channelMode].channels.map((chNo) => this.profile.channels[chNo]);

        this.output = Buffer.from(new Array(profile.channelModes[profile.options.channelMode].count));
        this.output.fill(-1);
    }

    get masterChannel() {
        return this.channelMap.findIndex((ch) => ch.type == "INTENSITY");
    }
}
