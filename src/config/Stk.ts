import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Stk extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('stk/config.xml', {}, 'config');
    }
}

