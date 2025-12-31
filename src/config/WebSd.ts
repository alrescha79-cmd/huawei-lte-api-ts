import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class WebSd extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('websd/config.xml', {}, 'config');
    }
}

