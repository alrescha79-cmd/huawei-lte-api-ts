import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Ntwk extends ApiGroup {
    lanUpnpPortmapping(): Promise<GetResponseType>{
        return this.get('ntwk/lan_upnp_portmapping');
    }
        

    celllock(): Promise<GetResponseType> {
        return this.get('ntwk/celllock');
    }
}