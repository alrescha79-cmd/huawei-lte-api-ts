import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';

export class Bluetooth extends ApiGroup {
    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    settings(): Promise<GetResponseType> {
        return this.get('bluetooth/settings');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    scan(): Promise<GetResponseType> {
        return this.get('bluetooth/scan');
    }
}
