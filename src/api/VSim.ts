import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class VSim extends ApiGroup {
    operateswitchVsim(): Promise<GetResponseType> {
        return this.get('vsim/operateswitch-vsim');
    }
}
    
