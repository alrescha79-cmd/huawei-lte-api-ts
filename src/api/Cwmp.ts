import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Cwmp extends ApiGroup {
    basicInfo(): Promise<GetResponseType> {
        return this.get('cwmp/basic-info');
    }
}

