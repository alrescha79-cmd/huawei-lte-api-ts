import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Log extends ApiGroup {
    loginfo(): Promise<GetResponseType> {
        return this.get('log/loginfo');
    }
}