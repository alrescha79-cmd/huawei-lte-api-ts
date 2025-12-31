import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class MLog extends ApiGroup {
    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    mobileLogger(): Promise<GetResponseType> {
        return this.get('mlog/mobile-logger');
    }
}
