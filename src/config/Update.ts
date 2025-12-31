import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Update extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('update/config.xml', {}, 'config');
    }
}

