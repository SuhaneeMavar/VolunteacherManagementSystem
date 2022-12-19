import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DialogBoxComponent } from 'src/app/admin/components/dialog-box/dialog-box.component';
import { EventsService } from 'src/app/admin/shared-services/events/events.service';
import { ProjectsService } from 'src/app/admin/shared-services/projects.service';
import { UploadImgComponent } from 'src/app/core/components/upload-img/upload-img.component';
import { Activity } from 'src/app/core/model/activity';
import { Country } from 'src/app/core/model/country';
import { District } from 'src/app/core/model/district';
import { Event } from 'src/app/core/model/event';
import { FileUpload } from 'src/app/core/model/file-upload';
import { Notification } from 'src/app/core/model/notification';
import { Project } from 'src/app/core/model/project';
import { State } from 'src/app/core/model/state';
import { Taluka } from 'src/app/core/model/taluka';
import { Village } from 'src/app/core/model/village';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { authentication } from 'src/app/home/shared-services/authentication.service';
import { AddressService } from 'src/app/shared/shared-services/address.service';
import { NotificationsService } from 'src/app/user/services/notifications.service';
import { UsersService } from 'src/app/user/services/users.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  month: string
  year: number
  tab1: boolean
  tab2: boolean = true
  edit: boolean = false
  events: Array<any>
  isShow: boolean = false;
  Show: boolean = true;
  showForm: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  disabled: boolean = null

  showProgressbar: boolean = false

  event: Event = new Event()
  notification: Notification;
  countries: Array<Country>
  states: Array<State>
  districts: Array<District>
  talukas: Array<Taluka>
  villages: Array<Village>

  stateSelected: number;
  districtSelected: number;
  talukaSelected: number;
  villageSelected: number;
  projectSelected: number;
  activities: Array<Activity>
  selectedActivities: Array<Number> = []
  projects: Array<Project> = []

  isEventCreated: boolean = false

  page: number = 0

  baseUrl: string = "/vms/events"
  imageURL: string;


  croppedImage: any = null
  percentage: number = 0
  @ViewChild(UploadImgComponent) uploadImageComponent: UploadImgComponent

  showSpinner: boolean = false
  noEvents: boolean = false
  eLength: number



  constructor(private fileService: FileUploadService, private dialog: MatDialog, private router: Router, private notiService: NotificationsService, private userService: UsersService, private authService: authentication, private projectService: ProjectsService, private addressService: AddressService, private _snackBar: MatSnackBar, private eventService: EventsService) { }

  ngOnInit(): void {


    let date: Date = new Date()

    this.month = this.monthNames[date.getMonth()]
    //console.log("current"+ this.month)

    this.stateSelected = 7
    this.districtSelected = 141
    this.talukaSelected = 35
    this.year = date.getFullYear()
    this.getAllActivities()
    this.getAllCountries();
    this.getAllStates();
    this.getAllDistricts();
    this.getAllTalukas();
    this.getAllVillages();
    this.getProjects();
    this.getAllEvent(this.page);

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


  showTab1(show: boolean) {
    this.tab1 = show
  }
  showTab2(show: boolean) {

    this.tab2 = show
    this.tab1 = false
    this.edit = false
  }

  openAddSnackBar() {
    this._snackBar.open('Added successfully..', 'close', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }



  openDeleteSnackBar() {
    this._snackBar.open('Deleted successfully..', 'close', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openNotifySnackBar() {
    this._snackBar.open('Notified successfully..', 'close', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  


  getAllActivities() {
    this.eventService.getActivities().subscribe(data => {
      this.activities = data

    }, error => {
      this.handleError(error)
    })
  }



  getAllEvent(page: number) {

    this.showSpinner = true
    this.eventService.getAllEvents(page).subscribe(data => {
      this.events = data['content']
      this.showSpinner = false
      if (data != null) {
        this.eLength = data['content'].length
        this.noEvents = false
      }
      //this.eLength=0
      if (this.eLength == 0) {
        this.noEvents = true
      }


    }, error => {
      this.handleError(error)
    })
  }



  addEvent(form: NgForm) {
    this.disabled = true
    this.showProgressbar = true
    const file = this.uploadImageComponent.image;
    this.fileService.pushFileToStorage(new FileUpload(file), this.baseUrl).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);

        if (this.percentage == 100) {


          this.fileService.imageUrl.subscribe(data => {
            this.imageURL = data

            if (this.imageURL != null && this.isEventCreated == false) {
              if (this.villageSelected > 0 && this.projectSelected > 0) {
                this.event.photo = this.imageURL
                let eventdate: string = this.event.eventDate
                let sdate: string[] = eventdate.split("-")
                let eventDate = sdate[1] + "-" + sdate[2] + "-" + sdate[0]
                this.event.eventDate = eventDate
                this.event.notified = false

                this.event.eventStartingTime = this.event.eventStartingTime + ":00"
                this.event.eventEndingTime = this.event.eventEndingTime + ":00"

                this.projectService.getProject(this.projectSelected).pipe(finalize(() => {
                  this.addressService.getVillageByid(this.villageSelected).pipe(finalize(() => {
                    this.eventService.addEvent(this.event, this.selectedActivities).subscribe(data => {
                 
                      form.reset()
                      //localStorage.removeItem("imageURL")

                      setTimeout(() => {
                        this.getAllEvent(0)
                        this.openAddSnackBar()
                        this.showTab2(true)
                        this.disabled = false

                        this.showProgressbar = false

                      }, 2000)
                    }, error => {
                      this.handleError(error)
                    })
                  })).subscribe(data => {
                    this.event.village = data
                  }, error => {
                    console.log(error);
                  })
                })).subscribe(data => {
                  this.event.project = data
                }, error => {
                  console.log(error);
                })
              }
              this.isEventCreated = true
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

  getProjects() {
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = data
    }, error => {
      this.handleError(error)
    })
  }

  selectedProject(event) {
    if (event.target.value > 0) {
      this.projectSelected = event.target.value;
    }
  }

  getAllCountries() {
    this.addressService.getCountries().subscribe(data => {
      this.countries = data
    }, error => {
      this.handleError(error)
    })
  }

  selectedCountry(event) {
    this.addressService.getStates(event.target.value).subscribe(data => {
      this.states = data
    })
  }

  getAllStates() {
    this.addressService.getStates(8).subscribe(data => {
      this.states = data;
    }, error => {
      this.handleError(error)
    })
  }

  selectedState(event) {
    this.stateSelected = event.target.value;
    this.Show = false
    this.villageSelected = 0
    this.talukaSelected = 0
    this.districtSelected = 0
    this.talukas = []
    this.villages = []
    if (event.target.value > 0) {
      this.addressService.getDistricts(event.target.value).subscribe(data => {
        this.districts = data
      })
    }
  }

  getAllDistricts() {
    this.addressService.getDistricts(7).subscribe(data => {
      this.districts = data;
    }, error => {
      this.handleError(error)
    })
  }

  selectedDistrict(event) {
    this.villageSelected = 0
    this.talukaSelected = 0
    if (event.target.value > 0) {
      this.districtSelected = event.target.value;
      this.addressService.getTalukas(event.target.value).subscribe(data => {
        this.talukas = data
        this.villages = []
      })
    }
    else {
      this.talukas = []
      this.villages = []
      this.districtSelected = 0
    }
  }

  getAllTalukas() {
    this.addressService.getTalukas(141).subscribe(data => {
      this.talukas = data
    }, error => {
      this.handleError(error)
    })
  }

  selectedTaluka(event) {
    this.talukaSelected = event.target.value;
    console.log(event.target.value);
    if (event.target.value > 0) {
      this.addressService.getVillages(event.target.value).subscribe(data => {
        this.villages = data
      })
    }
  }

  getAllVillages() {
    this.addressService.getVillages(35).subscribe(data => {
      this.villages = data
    }, error => {
      this.handleError(error)
    })
  }

  selectedVillage(event) {
    this.villageSelected = event.target.value;
  }

  notifyEvent(eventId, value) {
    this.disabled = true
    this.showProgressbar = true
    this.notification = new Notification()
    let authUser: string[] = []
    this.notification = new Notification()
    if (value.target.value == 1) {
      this.notification.userType = "ALL"
    }

    if (value.target.value == 2) {
      this.notification.userType = "LOCAL VOLUNTEACHER"
    }

    if (value.target.value == 3) {
      this.notification.userType = "VOLUNTEACHER"
    }

    this.notification.notificationType = "event"
    this.eventService.getEventById(eventId).pipe(finalize(() => {
      authUser = localStorage.getItem(this.authService.LOCAL_STORAGE_ATTRIBUTE_USERNAME).split(' ')
      this.userService.getUserByEmail(atob(authUser[0])).pipe(finalize(() => {
        this.notiService.addNotification(this.notification).subscribe(data => {

          this.router.navigate['admin/events']
          setTimeout(() => {
            this.getAllEvent(0)
            this.showProgressbar = false
            this.openNotifySnackBar()
            this.disabled = false
          }, 1000);
        }, error => {
          this.handleError(error)
        })
      })).subscribe(data => {
        this.notification.createdBy = data
      })
    })).subscribe(data => {
      this.notification.event = data
    })
  }

  deleteEvent(id: number, image: string) {
    this.showProgressbar = true
    this.eventService.deleteEvent(id).subscribe(data => {
      this.fileService.delete(image)

      setTimeout(() => {
        this.getAllEvent(this.page)
        this.showProgressbar = false
        this.openDeleteSnackBar()
      }, 2000);
    }, error => {
      this.handleError(error)
    })
  }

  delete(id: number, image: string) {
    this.dialog.open(DialogBoxComponent).afterClosed().subscribe(data => {
      if (data.delete) {
        this.deleteEvent(id, image)
      }
    })
  }

  show(isShow): void {
    this.showForm = isShow
  }


  onScroll() {
    this.page += 1
    this.getPageableEvent(this.page);
  }
  getPageableEvent(page: number) {
    this.eventService.getAllEvents(page).subscribe(data => {
      data['content'].forEach(event => {
        this.events.push(event)
      });
    })
  }

  getCroppedImage(image) {
    this.croppedImage = image
  }
}
