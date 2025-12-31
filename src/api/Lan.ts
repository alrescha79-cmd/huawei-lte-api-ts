import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Lan extends ApiGroup{
    hostInfo(): Promise<GetResponseType> {
        return this.get('lan/HostInfo');
    }
}