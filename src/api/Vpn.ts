import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Vpn extends ApiGroup {
    featureSwitch(): Promise<GetResponseType> {
        return this.get('vpn/feature-switch');
    }

    brList(): Promise<GetResponseType> {
        return this.get('vpn/br_list');
    }

    ipsecSettings(): Promise<GetResponseType> {
        return this.get('vpn/ipsec_settings');
    }

    l2tpSettings(): Promise<GetResponseType> {
        return this.get('vpn/l2tp_settings');
    }

    pptpSettings(): Promise<GetResponseType> {
        return this.get('vpn/pptp_settings');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    status(): Promise<GetResponseType> {
        return this.get('vpn/status');
    }
}

    
