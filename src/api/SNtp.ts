import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class SNtp extends ApiGroup{
    getSettings(): Promise<GetResponseType> {
        return this.get('sntp/settings');
    }

    sntpswitch(): Promise<GetResponseType> {
        return this.get('sntp/sntpswitch');
    }

    serverinfo(): Promise<GetResponseType> {
        return this.get('sntp/serverinfo');
    }

    timeinfo(): Promise<GetResponseType> {
        return this.get('sntp/timeinfo');
    }
}
    
