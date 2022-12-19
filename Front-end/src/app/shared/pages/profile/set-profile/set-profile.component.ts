import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UploadImgComponent } from 'src/app/core/components/upload-img/upload-img.component';
import { FileUpload } from 'src/app/core/model/file-upload';
import { User } from 'src/app/core/model/user';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { authentication } from 'src/app/home/shared-services/authentication.service';
import { ProfileService } from 'src/app/shared/shared-services/profile.service';
import { UsersService } from 'src/app/user/services/users.service';
import { ProfileComponent } from '../profile/profile.component';
@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css']
})
export class SetProfileComponent implements OnInit {

  //get User Id
  private userId: number
  baseUrl: string = "/vms/users/profile"
  imageURL: string = null

  percentage: number = 0
  croppedImage: any = ''
  @ViewChild(UploadImgComponent) uploadImageComponent: UploadImgComponent

  @ViewChild(ProfileComponent) profileComponent: ProfileComponent

  user: User = new User()
  oldImage: String = ''
  isPhotoUploaded: boolean = false
  showSpinner: boolean = false
  constructor(private router: Router, private fileService: FileUploadService, private authService: authentication, private userService: UsersService, private profileService: ProfileService) { }

  ngOnInit(): void {


    let user: Array<string>
    user = localStorage.getItem(this.authService.LOCAL_STORAGE_ATTRIBUTE_USERNAME).split(' ')
    this.userService.getUserByEmail(atob(user[0])).subscribe(data => {
      this.user = data
    })
  }



  handleError(error) {
    console.log(error);
    console.log(error.status);

    if (error.status === 500) {
      this.router.navigate(['internal-server-error'])
    }
    else {
      this.router.navigate(['error-page'])
    }
  }

  onShow(isShow) {
    if (isShow)
      this.uploadPhoto()
  }

  uploadPhoto() {
    this.showSpinner = true

    const file = this.uploadImageComponent.image;
    let image: string = 'https://firebasestorage.googleapis.com/v0/b/volunteachermanagementsystem.appspot.com/o/dummy%20user.png?alt=media&token=1f51578d-900d-42f5-b773-767295b3ce80'
    if (this.user.photo == image) {
      this.fileService.pushFileToStorage(new FileUpload(file), this.baseUrl).subscribe(
        percentage => {
          this.percentage = Math.round(percentage);

          if (this.percentage == 100) {


            this.fileService.imageUrl.subscribe(data => {
              this.imageURL = data

              if (this.imageURL != null && this.isPhotoUploaded == false) {
                let user: Array<string>
                user = localStorage.getItem(this.authService.LOCAL_STORAGE_ATTRIBUTE_USERNAME).split(' ')

                this.userService.getUserByEmail(atob(user[0])).pipe(finalize(() => {
                  this.profileService.setProfile(this.user.photo, this.userId).subscribe(data => {

                    this.showSpinner = false
                    if (this.user.type.typeId == 1)
                      this.router.navigate(['/admin/profile/posts'])
                    else
                      this.router.navigate(['/user/profile/posts'])
                  })
                })).subscribe(data => {
                  this.user = data
                  this.userId = data.userId
                  this.user.photo = this.imageURL

                  if (this.user.type.typeId == 1)
                    this.profileService.adminProfileImage.next(this.imageURL)
                  else
                    this.profileService.userProfileImage.next(this.imageURL)
                }, error => {
                  this.handleError(error)
                })
                this.isPhotoUploaded = true
              }
            })
          }
        }, error => {
          this.handleError(error)
        }
      ), error => {
        this.handleError(error)
      }
    }
    else {
      this.fileService.updateStorage(new FileUpload(file), this.user.photo.toString()).subscribe(percentage => {
        this.percentage = Math.round(percentage);
        if (this.percentage == 100) {
           this.showSpinner = false
          // if (this.user.type.typeId == 1)
          //   this.profileComponent.user.photo = this.user.photo
          // else
          //   this.profileComponent.volunteacher.user.photo=this.user.photo
          if (this.user.type.typeId == 1)
            this.router.navigate(['/admin/profile/posts'])
          else
            this.router.navigate(['/user/profile/posts'])

            setTimeout(()=>{
              window.location.reload();
            },1000)
        }

      }

      )
    }
  }

  getCroppedImage(image) {
    this.croppedImage = image
  }
}
