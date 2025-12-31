import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class UPnp extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('upnp/config.xml', {}, 'config');
    }
}
    
