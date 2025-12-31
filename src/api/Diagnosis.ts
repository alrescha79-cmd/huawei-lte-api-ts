import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType, SetResponseType } from '../types';


export class Diagnosis extends ApiGroup {
    traceRouteResult(): Promise<GetResponseType> {
        return this.get('diagnosis/tracerouteresult');
    }

    diagnosePing(): Promise<GetResponseType> {
        return this.get('diagnosis/diagnose_ping');
    }

    setDiagnosePing(host: string, timeout: number = 4000): Promise<SetResponseType> {
        return this.postSet('diagnosis/diagnose_ping', {
            Host: host,
            Timeout: timeout,
        });
    }

    diagnoseTraceroute(): Promise<GetResponseType> {
        return this.get('diagnosis/diagnose_traceroute');
    }

    setDiagnoseTraceroute(host: string, timeout: number = 4000, maxHopCount: number = 30): Promise<SetResponseType> {
        return this.postSet('diagnosis/diagnose_ping', {
            Host: host,
            MaxHopCount: maxHopCount,
            Timeout: timeout,
        });
    }

    timeReboot(): Promise<GetResponseType> {
        return this.get('diagnosis/time_reboot');
    }
}


