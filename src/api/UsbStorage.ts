import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class UsbStorage extends ApiGroup {
    fsstatus(): Promise<GetResponseType> {
        return this.get('usbstorage/fsstatus');
    }

    usbaccount(): Promise<GetResponseType> {
        return this.get('usbstorage/usbaccount');
    }
}
