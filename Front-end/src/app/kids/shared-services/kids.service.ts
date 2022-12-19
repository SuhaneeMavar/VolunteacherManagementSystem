import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Area } from 'src/app/core/model/area';
import { Attendance } from 'src/app/core/model/attendance';
import { Kid } from 'src/app/core/model/kid';
import { KidsGroup } from 'src/app/core/model/kids-group';
import { Kidsreport } from 'src/app/core/model/kidsreport';
import { Session } from 'src/app/core/model/session';
import { Village } from 'src/app/core/model/village';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KidsService {

  constructor(private _httpclient: HttpClient) { }



  addParticipants(kidIds: Number[], eventId: number): Observable<Event> {
    let header = {
      headers: new HttpHeaders({
        'kidsIds': kidIds.toString(),
        'eventId': eventId.toString()
      })
    }
    return this._httpclient.post<Event>(`${environment.url}${"vms/kids-participants"}`, null, header).pipe(retry(3))
  }
  getkidsgrouplist(): Observable<KidsGroup[]> {

    return this._httpclient.get<KidsGroup[]>(`${environment.url}${"vms/kids-groups"}`)
      .pipe(retry(3));

  }

  getkidslist(page: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/kids?page="}${page}`).pipe(retry(3));
  }

  getAllKidsByVillage(page: number, villageId: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/village-kids?page="}${page}${"&village="}${villageId}`).pipe(retry(3))
  }

  getAllKidsByArea(page: number, areaId: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/area-kids?page="}${page}${"&area="}${areaId}`).pipe(retry(3))
  }

  getAllKidsByVillageAndGroup(page: number, villageId: number, groupId: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/village-group-kids?page="}${page}${"&village="}${villageId}${"&group="}${groupId}`).pipe(retry(3))
  }

  getAllKidsByAreaAndGroupAndVillage(page: number, areaId: number, groupId: number, villageId: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/area-group-village-kids?page="}${page}${"&area="}${areaId}${"&group="}${groupId}${"&village="}${villageId}`).pipe(retry(3))
  }

  getKidReport(kidId: number): Observable<Kidsreport[]> {
    return this._httpclient.get<Kidsreport[]>(`${environment.url}${"vms/kids/"}${kidId}${"/kids-reports"}`).pipe(retry(3))
  }

  kidById(kidId: number): Observable<Kid> {
    return this._httpclient.get<Kid>(`${environment.url}${"vms/kids/"}${kidId}`).pipe(retry(3))
  }
  addKidReport(kidReport: Kidsreport): Observable<Kidsreport> {
    return this._httpclient.post<Kidsreport>(`${environment.url}${"vms/kids-reports"}`, JSON.stringify(kidReport)).pipe(retry(3))
  }

  getAreaById(areaId: number): Observable<Area> {
    return this._httpclient.get<Area>(`${environment.url}${"vms/areas/"}${areaId}`).pipe(retry(3))
  }

  addKid(kid: Kid): Observable<Kid> {
    return this._httpclient.post<Kid>(`${environment.url}${"vms/kids"}`, JSON.stringify(kid)).pipe(retry(3))
  }

  kidGroupById(groupId: number): Observable<KidsGroup> {
    return this._httpclient.get<KidsGroup>(`${environment.url}${"vms/kids-groups/"}${groupId}`).pipe(retry(3))
  }


  villageById(villageId: number): Observable<Village> {
    return this._httpclient.get<Village>(`${environment.url}${"vms/villages/"}${villageId}`).pipe(retry(3))
  }

  addKidsAttendance(attendance: Attendance, kidsids: Number[]): Observable<Attendance> {
    let header = {
      headers: new HttpHeaders({
        'kidsIds': kidsids.toString()
      })
    }
    return this._httpclient.post<Attendance>(`${environment.url}${"vms/add-kids-attendance"}`, attendance, header).pipe(retry(3))
  }

  sessionById(sessionId: number): Observable<Session> {
    return this._httpclient.get<Session>(`${environment.url}${"vms/sessions/"}${sessionId}`).pipe(retry(3))
      .pipe(retry(1));
  }

  getAllKidsByGroup(page: number, groupId: number): Observable<Kid[]> {
    return this._httpclient.get<Kid[]>(`${environment.url}${"vms/group-kids?page="}${page}${"&group="}${groupId}`).pipe(retry(3))
  }

  kidReportById(id: number): Observable<Kidsreport> {
    return this._httpclient.get<Kidsreport>(`${environment.url}${"vms/kids-reports/"}${id}`).pipe(retry(3))
  }

  editKidsGroup(groupId: number, KidsGroup: KidsGroup): Observable<KidsGroup> {
    return this._httpclient.put<KidsGroup>(`${environment.url}${"vms/kids-groups/"}${groupId}`, KidsGroup).pipe(retry(3))
  }

  getLatestKidReport(id: number): Observable<Kidsreport> {
    return this._httpclient.get<Kidsreport>(`${environment.url}${"vms/latest-kid-report?kid="}${id}`).pipe(retry(3))
  }


}
