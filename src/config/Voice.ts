import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Voice extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('voice/config.xml', {}, 'config');
    }

    country(): Promise<GetResponseType> {
        return this.get('voice/country.xml', {}, 'config');
    }
}

