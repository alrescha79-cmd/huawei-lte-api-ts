import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Ota extends ApiGroup {
    status(): Promise<GetResponseType> {
        return this.get('ota/status');
    }
}