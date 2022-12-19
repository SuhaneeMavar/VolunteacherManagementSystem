import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kid } from 'src/app/core/model/kid';
import { authentication } from 'src/app/home/shared-services/authentication.service';

import { KidsService } from '../../shared-services/kids.service';

@Component({
  selector: 'app-kids-list',
  templateUrl: './kids-list.component.html',
  styleUrls: ['./kids-list.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class KidsListComponent implements OnInit {
  showSpinner: boolean = false
  groups: Array<string>
  villages: Array<string>
  userType: string

  heading: string = ''
  edit: boolean = false
  view: boolean = false
  create: boolean = false

  redirectToPart1: string
  redirectToPart2: string
  page: number = 0
  totalKidsPages: number
  filter: string

  selectedVillage: number
  selectedArea: number
  selectedGroup: number

  search: string = ''

  @Input() label: string

  kidslist: Array<Kid> = new Array()
  constructor(private kidsService: KidsService, private _auth: authentication, private router: Router) {

  }


  ngOnInit() {
    //this.getkids()
    this.userType = this.getUserType()
    this.getkids(this.page, "all")

    let array = this.router.url.split('/')


    if (array[3] === "edit-kids") {
      this.heading = "Edit Kids"
      this.edit = true
      this.create = false
      this.view = false
      this.redirectToPart1 = "/user/kids/edit-kids/kids-list/"
      this.redirectToPart2 = "/edit"
    }
    else if (array[3] === "create-report") {
      this.heading = "Create Reports"
      this.edit = false
      this.create = true
      this.view = false
      this.redirectToPart1 = "/user/kids/create-report/kids-list/"
      this.redirectToPart2 = "/create"
    }
    else {
      this.heading = "View Reports"
      this.edit = false
      this.create = false
      this.view = true
      this.redirectToPart1 = "/user/kids/kids-list/"
      this.redirectToPart2 = "/kids-report"
    }

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
  onScroll() {


    if (this.page < this.totalKidsPages - 1) {
      this.page += 1
      this.getPageableKids(this.page);
    }
  }
  getPageableKids(page: number) {
    if (this.filter === "all") {
      this.kidsService.getkidslist(page).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
    if (this.filter === "v") {
      this.kidsService.getAllKidsByVillage(this.page, this.selectedVillage).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
    if (this.filter === "g") {
      this.kidsService.getAllKidsByGroup(this.page, this.selectedGroup).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
    if (this.filter === "a") {
      this.kidsService.getAllKidsByArea(this.page, this.selectedArea).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
    if (this.filter === "vg") {
      this.kidsService.getAllKidsByVillageAndGroup(this.page, this.selectedVillage, this.selectedGroup).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
    if (this.filter === "vga") {
      this.kidsService.getAllKidsByAreaAndGroupAndVillage(this.page, this.selectedArea, this.selectedGroup, this.selectedVillage).subscribe(data => {
        data['content'].forEach(kid => {
          this.kidslist.push(this.calculate(kid))
        });
      })
    }
  }

  getkids(page: number, filter: string) {
    this.page = 0
    this.filter = filter
    this.showSpinner = true
    this.kidsService.getkidslist(page).subscribe(data => {
      this.kidslist = data['content'];
      this.totalKidsPages = data['totalPages']
      this.showSpinner = false
      this.kidslist = this.calculateAge(this.kidslist)


    }, error => {
      this.handleError(error)
    });
  }

  getKidsByTaluka(talukaId: number, filter: string) {
    this.page = 0
    this.filter = filter
    this.kidsService.getkidslist(0).subscribe(data => {
      for (var kid of this.kidslist) {
        if (kid.village.taluka.talukaId == talukaId) {
          this.kidslist.concat(kid)
          this.kidslist = this.calculateAge(this.kidslist)

        }
      }
    });
  }

  getKidsByVillage(villageId: number, filter: string) {
    this.selectedVillage = villageId
    this.page = 0
    this.filter = filter
    this.kidsService.getAllKidsByVillage(this.page, villageId).subscribe(data => {
      this.kidslist = data['content']
      this.totalKidsPages = data['totalPages']
      this.kidslist = this.calculateAge(this.kidslist)


    }, error => {
      this.handleError(error)
    })
  }

  getKidsByArea(areaId: number, filter: string) {
    this.selectedArea = areaId
    this.page = 0
    this.filter = filter
    this.kidsService.getAllKidsByArea(this.page, areaId).subscribe(data => {
      this.kidslist = data['content']
      this.totalKidsPages = data['totalPages']
      this.kidslist = this.calculateAge(this.kidslist)

    }, error => {
      this.handleError(error)
    })
  }

  getKidsByVillageAndGroup(villageId: number, groupId: number, filter: string) {
    this.selectedVillage = villageId
    this.selectedGroup = groupId
    this.page = 0
    this.filter = filter
    this.kidsService.getAllKidsByVillageAndGroup(this.page, villageId, groupId).subscribe(data => {
      this.kidslist = data['content']
      this.totalKidsPages = data['totalPages']
      this.kidslist = this.calculateAge(this.kidslist)

    }, error => {
      this.handleError(error)
    })
  }

  getKidsByAreaAndGroupAndVillage(areaId: number, groupId: number, villageId: number, filter: string) {
    this.selectedVillage = villageId
    this.selectedGroup = groupId
    this.selectedArea = areaId
    this.page = 0
    this.filter = filter
    this.kidsService.getAllKidsByAreaAndGroupAndVillage(this.page, areaId, groupId, villageId).subscribe(data => {
      this.kidslist = data['content']
      this.totalKidsPages = data['totalPages']
      this.kidslist = this.calculateAge(this.kidslist)

    }, error => {
      this.handleError(error)
    })
  }

  getKidsByGroup(groupId: number, filter: string) {
    this.selectedGroup = groupId
    this.page = 0
    this.filter = filter
    this.kidsService.getAllKidsByGroup(this.page, groupId).subscribe(data => {
      this.kidslist = data['content']
      this.totalKidsPages = data['totalPages']
    }, error => {
      this.handleError(error)
    })
  }

  calculateAge(kidsList: Array<Kid>): Array<Kid> {
    for (let k of kidsList) {
      k = this.calculate(k)
    }
    return kidsList

  }

  getUserType(): string {

    let array: Array<string> = new Array()
    array = this.router.url.split('/')

    return array[1]

  }

  calculate(kid: Kid): Kid {

    let currentDate = new Date()
    let bDate = new Date(kid.dob)

    let diffInSec = Math.abs(currentDate.getTime() - bDate.getTime())


    kid.age = (diffInSec / (1000 * 3600 * 24) / 365) + 1
    let array: Array<string> = kid.age.toString().split('.')
    kid.age = Number.parseInt(array[0])


    return kid

  }
}
