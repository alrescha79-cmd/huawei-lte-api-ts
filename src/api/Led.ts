import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Led extends ApiGroup {
    nightmode(): Promise<GetResponseType> {
        return this.get('led/nightmode');
    }
}