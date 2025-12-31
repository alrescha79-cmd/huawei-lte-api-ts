import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Statistic extends ApiGroup {
    featureRoamStatistic(): Promise<GetResponseType> {
        return this.get('statistic/feature-roam-statistic');
    }
}
    
