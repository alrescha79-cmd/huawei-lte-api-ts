import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class WebUICfg extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('webuicfg/config.xml', {}, 'config');
    }
}

