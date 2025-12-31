import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Time extends ApiGroup {
    timeout(): Promise<GetResponseType> {
        return this.get('time/timeout');
    }
}