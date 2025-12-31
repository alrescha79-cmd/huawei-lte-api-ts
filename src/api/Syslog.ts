import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType, SetResponseType } from '../types';


export class Syslog extends ApiGroup {
    querylog(): Promise<GetResponseType> {
        return this.get('syslog/querylog');
    }

    clear(): Promise<SetResponseType> {
        return this.postSet('syslog/processlog', {
            'command': 'clear',
        });
    }
}
    
