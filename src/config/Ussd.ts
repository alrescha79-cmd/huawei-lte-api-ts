import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';



export class Ussd extends ApiGroup {
    prepaidussd(): Promise<GetResponseType> {
        return this.get('ussd/prepaidussd.xml', {}, 'config');
    }

    postpaidussd(): Promise<GetResponseType> {
        return this.get('ussd/postpaidussd.xml', {}, 'config');
    }
}
    
