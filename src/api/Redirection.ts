import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Redirection extends ApiGroup {
    homepage(): Promise<GetResponseType> {
        return this.get('redirection/homepage');
    }
}
    
