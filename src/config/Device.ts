import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Device extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('device/config.xml', {}, 'config');
    }
}
    
