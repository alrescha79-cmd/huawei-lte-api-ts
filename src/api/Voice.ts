import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Voice extends ApiGroup {
    featureswitch(): Promise<GetResponseType> {
        return this.get('voice/featureswitch');
    }

    sipaccount(): Promise<GetResponseType> {
        return this.get('voice/sipaccount');
    }

    sipadvance(): Promise<GetResponseType> {
        return this.get('voice/sipadvance');
    }

    sipserver(): Promise<GetResponseType> {
        return this.get('voice/sipserver');
    }

    speeddial(): Promise<GetResponseType> {
        return this.get('voice/speeddial');
    }

    functioncode(): Promise<GetResponseType> {
        return this.get('voice/functioncode');
    }

    voiceadvance(): Promise<GetResponseType> {
        return this.get('voice/voiceadvance');
    }

    voicebusy(): Promise<GetResponseType> {
        return this.get('voice/voicebusy');
    }

    /**
    * Endpoint found by reverse engineering B310s-22 firmware, unknown usage, probably not implemented by Huawei
    */
    codec(): Promise<GetResponseType> {
        return this.get('voice/codec');
    }
}
    
