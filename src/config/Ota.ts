import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Ota extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('ota/config.xml', {}, 'config');
    }
}

