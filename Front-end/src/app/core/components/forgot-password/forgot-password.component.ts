import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/user/services/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private userService:UsersService,private router:Router) { }

  invalidEmail:boolean = false
  showSpinner:boolean=false

  ngOnInit(): void {
    this.invalidEmail = false
  }

  sendOTP(val)
  {
    this.showSpinner=true
    this.userService.sendOTP(val.username).subscribe(data=>{
     
      this.showSpinner=false
      setTimeout(() => {
        this.router.navigate(['forgot-password/send-otp'])
      }, 1500); 
      this.invalidEmail = false
      localStorage.setItem("username",data.userId.toString() + " " + val.username);
    },
    (error) =>{

      if(error.status == 400)
      {
        this.invalidEmail = true
        this.showSpinner=false
        //this.router.navigate(['forgot-password'])
      }
      else if(error.status==500){
        this.router.navigate(['/internal-server-error'])
      }
      else
      {
        this.router.navigate(['/error-page'])
      }
     
    })
  }

}
