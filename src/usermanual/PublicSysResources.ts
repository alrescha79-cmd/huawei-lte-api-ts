import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class PublicSysResources extends ApiGroup {
    config(): Promise<GetResponseType> {
        return this.get('public_sys-resources/config.xml', {}, 'usermanual');
    }
}