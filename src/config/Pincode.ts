import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Pincode extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('pincode/config.xml', {}, 'config');
    }
}
