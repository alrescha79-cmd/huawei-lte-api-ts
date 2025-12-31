import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Cradle extends ApiGroup {
    statusInfo(): Promise<GetResponseType> {
        return this.get('cradle/status-info');
    }

    featureSwitch(): Promise<GetResponseType> {
        return this.get('cradle/feature-switch');
    }

    basicInfo(): Promise<GetResponseType> {
        return this.get('cradle/basic-info');
    }

    factoryMac(): Promise<GetResponseType> {
        return this.get('cradle/factory-mac');
    }

    macInfo(): Promise<GetResponseType> {
        return this.get('cradle/mac-info');
    }
}


