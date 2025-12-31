import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class PcAssistant extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('pcassistant/config.xml', {}, 'config');
    }

    updateautorun(): Promise<GetResponseType> {
        return this.get('pcassistant/updateautorun.xml', {}, 'config');
    }
}

