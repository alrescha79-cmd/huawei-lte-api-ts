import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class IPv6 extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('ipv6/config.xml', {}, 'config');
    }
}