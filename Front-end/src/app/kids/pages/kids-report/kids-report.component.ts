import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js';
import { Area } from 'src/app/core/model/area';
import { Kid } from 'src/app/core/model/kid';
import { Kidsreport } from 'src/app/core/model/kidsreport';
import { authentication } from 'src/app/home/shared-services/authentication.service';
import { colors, chartOptions, parseOptions } from 'src/app/variables/charts';
import { KidsService } from '../../shared-services/kids.service';

@Component({
  selector: 'app-kids-report',
  templateUrl: './kids-report.component.html',
  styleUrls: ['./kids-report.component.css']
})
export class KidsReportComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  n: number

  kidReport: Kidsreport = new Kidsreport()
  showSpinner: boolean = false

  kidReports: Kidsreport[] = new Array()
  showkidsReportComparision: boolean = true


  isKidReport: boolean = false

  constructor(private kidsService: KidsService, private router: Router, private kidService: KidsService, private route: ActivatedRoute) { }

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

  personalityChart: any

  getKidReportByKid(id: number) {

    this.showSpinner = true
    this.kidsService.getLatestKidReport(id).subscribe(data => {
      this.kidReport = data


      if (this.kidReport == null) {
        this.isKidReport = true;
      }
      else {
        this.getAllKidsReport()
        this.kidReport.kid = this.calculateAge(this.kidReport.kid)
      }

      this.showSpinner = false


    }, error => {
      this.handleError(error)
    })
  }


  ngOnInit(): void {
    this.kidReport.kid = new Kid()
    this.kidReport.kid.area = new Area()
    this.getKidReportByKid(this.route.snapshot.params['id'])




    this.n = 25

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];




    parseOptions(Chart, chartOptions());




    var chartPie = document.getElementById('chart-pie');

    parseOptions(Chart, chartOptions());





  }
  getAllKidsReport() {
    this.kidService.getKidReport(this.route.snapshot.params['id']).subscribe(data => {
      this.kidReports = data


      var chartPie = document.getElementById('chart-pie');
      this.personalityChart = new Chart(chartPie, {
        type: 'pie',
        options: {

        },
        data: {
          labels: ["Discipline", "Goshthi", "Abhivyakti"],
          datasets: [
            {
              data: [this.kidReports[0].discipline, this.kidReports[0].goshthi, this.kidReports[0].abhivyakti],
              backgroundColor: [
                "#fff200",
                "hotpink ",
                "#5e72e4"
              ]
            }
          ],

        }
      })
      var chartOrders = document.getElementById('chart-perfomance');

      var performanceChart = new Chart(chartOrders, {
        type: 'bar',
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function (value) {
                   
                    if (!(value % 10)) {
                      return value;
                    }
                  }
                }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label: function (item, data) {
                var label = data.datasets[item.datasetIndex].label || "";
                var yLabel = item.yLabel;
                var content = "";
                if (data.datasets.length > 1) {
                  content += label;
                }
                content += yLabel;
                return content;
              }
            }
          }
        },
        data: {
          labels: ["Prayer", "Games", "Sports", "Science", "Art", "Volunteaching"],
          datasets: [
            {
              label: "Performance",
              data: [this.kidReports[0].prayer, this.kidReports[0].games, this.kidReports[0].sports, this.kidReports[0].science, this.kidReports[0].artCraft, this.kidReports[0].volunteaching]
            }
          ]
        }
      })
      var chartProgress = document.getElementById('chart-progress')
      if (this.kidReports.length >= 3) {


        this.showkidsReportComparision = true

        let totalReport1: number = ((this.kidReports[0].abhivyakti + this.kidReports[0].artCraft + this.kidReports[0].discipline + this.kidReports[0].english + this.kidReports[0].games
          + this.kidReports[0].goshthi + this.kidReports[0].gujarati + this.kidReports[0].science + this.kidReports[0].maths + this.kidReports[0].prayer + this.kidReports[0].sports + this.kidReports[0].volunteaching) * 100) / 120

        let totalReport2: number = ((this.kidReports[1].abhivyakti + this.kidReports[1].artCraft + this.kidReports[1].discipline + this.kidReports[1].english + this.kidReports[1].games
          + this.kidReports[1].goshthi + this.kidReports[1].gujarati + this.kidReports[1].science + this.kidReports[1].maths + this.kidReports[1].prayer + this.kidReports[1].sports + this.kidReports[1].volunteaching) * 100) / 120

        let totalReport3: number = ((this.kidReports[2].abhivyakti + this.kidReports[2].artCraft + this.kidReports[2].discipline + this.kidReports[2].english + this.kidReports[2].games
          + this.kidReports[2].goshthi + this.kidReports[2].gujarati + this.kidReports[2].science + this.kidReports[2].maths + this.kidReports[2].prayer + this.kidReports[2].sports + this.kidReports[2].volunteaching) * 100) / 120





        let progressChart = new Chart(chartProgress, {
          type: 'line',
          options: {
            scales: {
              yAxes: [{
                gridLines: {
                  color: colors.gray[900],
                  zeroLineColor: colors.gray[900]
                },
                ticks: {
                  callback: function (value) {
                    if (!(value % 10)) {
                      return value;
                    }
                  }
                }
              }]
            }
          },
          data: {
            labels: ['Report1', 'Report2', 'Report3'],
            datasets: [{
              label: 'Performance',
              data: [Math.round(totalReport1), Math.round(totalReport2), Math.round(totalReport3)]
              //data: [25,25,25]
            }]
          }
        })
      }
      else {
        this.showkidsReportComparision = false
      }
    })
  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  calculateAge(kid: Kid): Kid {

    let currentDate = new Date()
    let bDate = new Date(kid.dob)

    let diffInSec = Math.abs(currentDate.getTime() - bDate.getTime())


    kid.age = (diffInSec / (1000 * 3600 * 24) / 365) + 1
    let array: Array<string> = kid.age.toString().split('.')
    kid.age = Number.parseInt(array[0])


    return kid

  }
  
  printDiv(divName) {
    //  var printContents = document.getElementById(divName).innerHTML;
    // var originalContents = document.body.innerHTML;

    // document.body.innerHTML = printContents;
    // window.open();
    // document.write(printContents);
    window.print();
    // window.close();
    // document.body.innerHTML = originalContents;
  }
}
