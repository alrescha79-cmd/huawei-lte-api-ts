import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Wifi extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('wifi/config.xml', {}, 'config');
    }

    configure(): Promise<GetResponseType> {
        return this.get('wifi/configure.xml', {}, 'config');
    }

    country_channel(): Promise<GetResponseType> {
        return this.get('wifi/countryChannel.xml', {}, 'config');
    }

    channel_auto_match_hardware(): Promise<GetResponseType> {
        return this.get('wifi/channelAutoMatchHardware.xml', {}, 'config');
    }
}

