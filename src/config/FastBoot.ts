import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class FastBoot extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('fastboot/config.xml', {}, 'config');
    }
}
