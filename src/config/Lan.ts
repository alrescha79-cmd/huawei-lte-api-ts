import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Lan extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('lan/config.xml', {}, 'config');
    }
}
    
