import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kid } from 'src/app/core/model/kid';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { KidsService } from '../../shared-services/kids.service';
import { Area } from 'src/app/core/model/area';
import { AddressService } from 'src/app/shared/shared-services/address.service';
import { Country } from 'src/app/core/model/country';
import { State } from 'src/app/core/model/state';
import { District } from 'src/app/core/model/district';
import { Taluka } from 'src/app/core/model/taluka';
import { Village } from 'src/app/core/model/village';
import { KidsGroup } from 'src/app/core/model/kids-group';
import { finalize } from 'rxjs/operators';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { UploadImgComponent } from 'src/app/core/components/upload-img/upload-img.component';
import { FileUpload } from 'src/app/core/model/file-upload';


@Component({
  selector: 'app-add-kids',
  templateUrl: './add-kids.component.html',
  styleUrls: ['./add-kids.component.css']
})

@Injectable({
  providedIn:'root'
})
export class AddKidsComponent implements OnInit {

  baseUrl:string="/vms/kids/profiles"
  imageURL: string = null;

  @ViewChild(UploadImgComponent) uploadImageComponent: UploadImgComponent

  croppedImage: any = ''

  percentage: number = 0

  heading:string=''
  saveBtn:boolean=false
  submitBtn=false
  isEdit=false
  showProgressbar:boolean=false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  levels:Array<string>

  disabled:boolean=null

  standards:Array<number>=[1,2,3,4,5,6,7,8,9,10,11,12]
  area: Array<Area>
  isShow:boolean=true
  showForm:boolean=false
  
  isKidAdded:boolean=false

  countries:Array<Country>
  states:Array<State>
  districts:Array<District>
  talukas:Array<Taluka>
  villages:Array<Village>
  areas:Array<Area>
  groups:Array<KidsGroup>

  stateSelected:number;
  districtSelected:number;
  talukaSelected:number;
  villageSelected:number;
  areaSelected:number;
  groupSelected:number;

  kid:Kid=new Kid();

  namePattern:string="[a-zA-Z ]{3,20}"

  


  constructor(private fileService:FileUploadService,private route:ActivatedRoute,private router:Router,private _snackBar: MatSnackBar,private kidsService:KidsService,private addressService : AddressService) {}

  ngOnInit() {
   
    this.getkidsgroup()
    this.getAllCountries();
    this.getAllStates();
    this.getAllDistricts();
    this.getAllTalukas();
    this.getAllVillages();

    this.stateSelected = 7;
    this.districtSelected = 141;
    this.talukaSelected = 35;
    this.villageSelected = 0;
    this.areaSelected = 0;
    this.groupSelected = 0;
    

    this.levels=[
      "AatmaSiksha","AatmaShodh","AatmaVishesh"
    ]

  }

  handleError(error)
  {
    console.log(error);
    console.log(error.status);
    
    if(error.status===500)
    {
      this.router.navigate(['internal-server-error'])
    }
    else
    {
      this.router.navigate(['error-page'])
    }
  }

 
 
  show(isShow):void
  {
    this.showForm=isShow
  }
  
  addKid(form)
  {
    this.disabled=true
    this.showProgressbar = true
    const file = this.uploadImageComponent.image;
    this.fileService.pushFileToStorage(new FileUpload(file), this.baseUrl).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);

        if (this.percentage == 100) {

          this.fileService.imageUrl.subscribe(data => {
            this.imageURL = data
            if (this.imageURL != null && this.isKidAdded == false) {
              if(this.areaSelected > 0)
              { 
                this.kid.level = form.level
                this.kid.standard = form.standard
                this.showProgressbar=true
                let photoUrl = this.imageURL
                this.kid.photo = photoUrl;
                let dob:String = this.kid.dob
                let dobdate:String[] = dob.split("-")
                let dateofbirth = dobdate[1] + "-" +  dobdate[2] + "-" + dobdate[0]
                this.kid.dob = dateofbirth
                this.kidsService.getAreaById(this.areaSelected).subscribe(areadata=>{
                
                  this.kid.area = areadata
                  this.kidsService.kidGroupById(this.groupSelected).pipe(finalize(()=>{
                    this.kidsService.villageById(areadata.village.villageId).pipe(finalize(()=>{
                      this.kidsService.addKid(this.kid).subscribe(data=>{
                      
                       
                        this.showProgressbar=false
                       
                        this.openSnackBar();
                        
                        setTimeout(() => {
                          this.disabled=false
                          this.router.navigate(['/user'])
                        }, 1500);
                      },error=>{
                        this.handleError(error)
                      })
                    })).subscribe(data=>{
                      this.kid.village = data
                    })
                  })).subscribe(data=>{
                    this.kid.group = data
                  })    
                })
              }
               this.isKidAdded = true
            }
          })
        }
      }, error => {
        this.handleError(error)
      }
    ),error=>{
      this.handleError(error)
    }
   
  }

  

  getAllCountries()
  {
    this.addressService.getCountries().subscribe(data=>{
      this.countries = data
    },error=>{
      this.handleError(error)
    })
  }

  selectedCountry(event)
  {
    this.addressService.getStates(event.target.value).subscribe(data=>{
      this.states = data
    },error=>{
      this.handleError(error)
    })
  }

  getAllStates() 
  {
    this.addressService.getStates(8).subscribe(data=>{
      this.states = data;
    },error=>{
      this.handleError(error)
    })
  }

  selectedState(event)
  {
    this.stateSelected = event.target.value;
    this.isShow = false
    this.villageSelected = 0
    this.talukaSelected = 0
    this.districtSelected = 0
    this.areaSelected = 0
    this.talukas = []
    this.villages = []
    this.areas = []
    if(event.target.value > 0)
    {
      this.addressService.getDistricts(event.target.value).subscribe(data=>{
      this.districts = data
      },error=>{
        this.handleError(error)
      })
    }
  }

  getAllDistricts() 
  {
    this.addressService.getDistricts(7).subscribe(data=>{
    this.districts = data;
    },error=>{
      this.handleError(error)
    })
  }

  selectedDistrict(event)
  {
    this.villageSelected = 0
    this.talukaSelected = 0
    this.areaSelected = 0
    if(event.target.value > 0)
    {
      this.districtSelected = event.target.value;
      this.addressService.getTalukas(event.target.value).subscribe(data=>{
      this.talukas = data
      this.areas=[]
      this.villages = []
      },error=>{
        this.handleError(error)
      })
    }
    else{
      this.talukas = []
      this.villages = []
      this.areas = []
      this.districtSelected = 0
    }
  }

  getAllTalukas() 
  {
    this.addressService.getTalukas(141).subscribe(data=>{
    this.talukas = data
    },error=>{
      this.handleError(error)
    })
  }

  selectedTaluka(event)
  {
    this.talukaSelected = event.target.value;
    this.areaSelected = 0
   
    if(event.target.value != 0)
    {
        this.addressService.getVillages(event.target.value).subscribe(data=>{
        this.villages = data
        this.areas = []
        },error=>{
          this.handleError(error)
        })
    }
    else
    {
      this.villageSelected = 0
    }
  }

  getAllVillages() 
  {
    this.addressService.getVillages(35).subscribe(data=>{
    this.villages = data
    },error=>{
      this.handleError(error)
    })
  }

  selectedVillage(event)
  {
    this.villageSelected = event.target.value;
 
    if(event.target.value!=0)
    {
        this.addressService.getAreas(event.target.value).subscribe(data=>{
        this.areas = data
      },error=>{
        this.handleError(error)
      })
    }
    else
    {
      this.areas = []
    }
  }

  selectedArea(event)
  {
    this.areaSelected = event.target.value;
  }

  getkidsgroup()
  {
    this.kidsService.getkidsgrouplist().subscribe(data =>{
      this.groups=data;
    },error=>{
      this.handleError(error)
    });
    
  }
 

  
  getCroppedImage(image) {
    this.croppedImage = image
  }


  selectedGroup(event)
  {
    this.groupSelected = event.target.value;
  }

  openSnackBar() {
    this._snackBar.open('Kid is added successfully..', 'close', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
   


  
}
