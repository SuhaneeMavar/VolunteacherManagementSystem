import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class authentication {

  LOCAL_STORAGE_ATTRIBUTE_USERNAME:string = "VMSAuthorizationUser"
  EXPIRE_TIME:string = "_expireTime"
  TOTAL_TAB:string = "_totalTab"
  public username:String;
  public passsword:String;

  constructor(private http:HttpClient) { }

  // handleError(error) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error
  //     errorMessage = `Client side Error: ${error.error.message}`;
  //   } else {
  //     // server-side error
  //     errorMessage = `Server side : Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   window.alert(errorMessage);
  //   return throwError(errorMessage);
  // }
  loginAuthentication(username:String,password:String)
  {
    let header = {headers:
      new HttpHeaders({
      //  'Content-Type':"application/json",
        'authorization':'Basic ' + btoa(username +":"+password)
      })
    } 

    return this.http.get(`${environment.url}${"vms/events?page=0"}`,header).pipe(map((res)=>{
      
     this.successfullyLogin(username,password)
    }
    )).pipe(retry(3));
  }

  createToken(username:String,password:String)
  {
    return 'Basic ' + btoa(username +":"+password)
  }

  successfullyLogin(username,password) 
  {
    localStorage.setItem(this.EXPIRE_TIME, ( Math.round(Date.now() / 1000) + (24 * 60 * 60)).toString());  
    localStorage.setItem(this.LOCAL_STORAGE_ATTRIBUTE_USERNAME,btoa(username) + " " +btoa(password))
  }

  isUserLogin(): boolean
  {
    var expire_time:number = +localStorage.getItem(this.EXPIRE_TIME);

    let user = localStorage.getItem(this.LOCAL_STORAGE_ATTRIBUTE_USERNAME)
  
    if(user == null || Math.round(Date. now() / 1000) > expire_time)
    {
      this.logout();
      return false;
    }
    return true;
  }

  logout()
  {
    this.username = null;
    this.passsword = null;
    localStorage.removeItem(this.LOCAL_STORAGE_ATTRIBUTE_USERNAME);
    localStorage.removeItem(this.EXPIRE_TIME);

  }
  
}
