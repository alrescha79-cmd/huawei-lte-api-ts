import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class DeviceInformation extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('deviceinformation/config.xml', {}, 'config');
    }
}