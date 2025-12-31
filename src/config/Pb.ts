import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Pb extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('pb/config.xml', {}, 'config');
    }
}

