import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Network extends ApiGroup {
    netMode(): Promise<GetResponseType> {
        return this.get('network/net-mode.xml', {}, 'config');
    }

    networkmode(): Promise<GetResponseType> {
        return this.get('network/networkmode.xml', {}, 'config');
    }

    config(): Promise<GetResponseType> {
        return this.get('network/config.xml', {}, 'config');
    }

    networkbandNull(): Promise<GetResponseType> {
        return this.get('network/networkband_null.xml', {}, 'config');
    }

    setOnly4g(): Promise<GetResponseType> {
        return this.get('network/setOnly4g.xml', {}, 'config');
    }
}

