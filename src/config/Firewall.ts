import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Firewall extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('firewall/config.xml', {}, 'config');
    }
}

