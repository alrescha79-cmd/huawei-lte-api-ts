import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class UsbPrinter extends ApiGroup {
    printerlist(): Promise<GetResponseType> {
        return this.get('usbprinter/printerlist');
    }
}
