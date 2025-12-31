import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Sntp extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('sntp/config.xml', {}, 'config');
    }
}

