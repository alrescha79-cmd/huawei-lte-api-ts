import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Sms extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('sms/config.xml', {}, 'config');
    }
}

