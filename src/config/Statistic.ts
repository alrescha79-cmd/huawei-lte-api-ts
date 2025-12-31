import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Statistic extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('statistic/config.xml', {}, 'config');
    }
}

