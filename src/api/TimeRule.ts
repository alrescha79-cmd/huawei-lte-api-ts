import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class TimeRule extends ApiGroup {
    timerule(): Promise<GetResponseType> {
        return this.get('time/timerule');
    }
}