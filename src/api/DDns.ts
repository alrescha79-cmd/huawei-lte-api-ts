import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class DDns extends ApiGroup {
    getDdnsList(): Promise<GetResponseType> {
        return this.get('ddns/ddns-list');
    }
        
    getStatus(): Promise<GetResponseType>{
        return this.get('ddns/status');
    }
}
    