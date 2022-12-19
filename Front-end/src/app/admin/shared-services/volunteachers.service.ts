import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Applicantrequest } from 'src/app/core/model/applicantrequest';
import { Kid } from 'src/app/core/model/kid';
import { User } from 'src/app/core/model/user';
import { Volunteacher } from 'src/app/core/model/volunteacher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteachersService {

  constructor(private http:HttpClient) { }
  
  downloadVolunteachers():Observable<Object>
  {

    let header = {
      responseType: 'blob' as 'json',
      headers:new HttpHeaders({
      })
    }
    return this.http.get(`${environment.url}${"vms/volunteachers-download"}`,header).pipe(retry(3))
  }
  getApplicantRequestById(id:number):Observable<Applicantrequest>
  {
    return this.http.get<Applicantrequest>(`${environment.url}${"vms/applicant-requests/"}${id}`).pipe(retry(3))
  }
  
  addVolunteacher(volunteacher:Volunteacher):Observable<Volunteacher>
  {
    return this.http.post<Volunteacher>(`${environment.url}${"vms/volunteachers"}`,volunteacher).pipe(retry(3))
  }

  getAllVolunteachers(page:number):Observable<Volunteacher[]>
  {
     return this.http.get<Volunteacher[]>(`${environment.url}${"vms/volunteachers?page="}${page}`)
     .pipe(retry(3))
  }

  getStatusVolunteachers():Observable<Object>
  {
     return this.http.get<Object>(`${environment.url}${"vms/volunteacher-status"}`)
     .pipe(retry(3))
  }

  getRemainingVolunteachers(projectId:number):Observable<User[]>
  {
    return this.http.get<User[]>(`${environment.url}${"vms/remaining-volunteachers?project="}${projectId}`)
     .pipe(retry(3))
  }

  getRemainingKids(projectId:number):Observable<Kid[]>
  {
    return this.http.get<Kid[]>(`${environment.url}${"vms/remaining-kids?project="}${projectId}`)
     .pipe(retry(3))
  }

  acceptRequest(requestId:number)
  {
    return this.http.post<Applicantrequest>(`${environment.url}${"vms/request-success/"}${requestId}`,null).pipe(retry(3))
  }

  deniedRequest(requestId:number)
  {
    return this.http.post<Applicantrequest>(`${environment.url}${"vms/request-denied/"}${requestId}`,null).pipe(retry(3))
  }
  //Users Requests

  getApplicantrequests(page:number):Observable<Applicantrequest[]>{
  
    return this.http.get<Applicantrequest[]>(`${environment.url}${"vms/applicant-requests?page="}${page}`)
    .pipe(retry(3));
  }

  getAllRejectedrequests():Observable<Applicantrequest[]>{
  
    return this.http.get<Applicantrequest[]>(`${environment.url}${"vms/reject-requests"}`)
    .pipe(retry(3));
  }

  getAllAcceptedrequests():Observable<Applicantrequest[]>{
  
    return this.http.get<Applicantrequest[]>(`${environment.url}${"vms/accept-requests"}`)
    .pipe(retry(3));
  }

  getVoluntecherByid(id:number):Observable<Volunteacher>
  {
    return this.http.get<Volunteacher>(`${environment.url}${"vms/volunteachers/"}${id}`).pipe(retry(3))
  }

  deleteVolunteacher(id:number)
  {
      return this.http.delete(`${environment.url}${"vms/volunteachers/"}${id}`).pipe(retry(3))
  }

  getVolunteachersByUserType(page:number, type:number):Observable<Volunteacher[]>
  {
    return this.http.get<Volunteacher[]>(`${environment.url}${"vms/volunteacher-type?page="}${page}${"&type="}${type}`).pipe(retry(3))
  }

  getVolunteachersByVillage(page:number,vid:number):Observable<Volunteacher[]>
  {
    return this.http.get<Volunteacher[]>(`${environment.url}${"vms/volunteacher-village?page="}${page}${"&village="}${vid}`).pipe(retry(3))
  }

  getVolunteachersByStatus(page:number,status:number):Observable<Volunteacher[]>
  {
    return this.http.get<Volunteacher[]>(`${environment.url}${"vms/volunteacher-by-status?page="}${page}${"&status="}${status}`).pipe(retry(3))
  }

  getVolunteachersByProject(page:number,project:number):Observable<Volunteacher[]>
  {
    return this.http.get<Volunteacher[]>(`${environment.url}${"vms/volunteacher-project?page="}${page}${"&project="}${project}`).pipe(retry(3))
  }

}
