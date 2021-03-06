//Core Imports
    import {Component, Input, OnInit, Inject} from '@angular/core';
    import {MdDialog, MdDialogRef, MD_DIALOG_DATA, Sort} from '@angular/material';
    import {Router} from '@angular/router';
    import { Md2Dialog } from 'md2';

//External Components
    import {ActivityComponent} from '../../../Components/activities/activity.component';
    import {FoodAndDrinksComponent} from '../../../Components/food-and-drinks/food-and-drinks.component';
    import {AccommodationComponent} from '../../../Components/accomodation/accommodation.component';
//Objects
    import {Accommodation} from '../../../Objects/Accommodation/Accommodation';
    import {Room} from '../../../Objects/Accommodation/Room';
    import {Feature} from '../../../Objects/Accommodation/Feature';
    import {FoodAndDrinks} from '../../../Objects/FoodAndDrinks/FoodAndDrinks';
    import {Activity} from '../../../Objects/Activity/Activity';
    import {CustomPackage} from '../../../Objects/Packages/CustomPackage/CustomPackage';
    import {TravelInformation} from '../../../Objects/Packages/CustomPackage/TravelInformation';
    import {Image} from '../../../Objects/Image';
    import {BookingTime} from '../../../Objects/BookingTime';
    import {Tag} from '../../../Objects/Tag';
//Services
    import {AccommodationService} from '../../../Services/Accommodation/accommodation.service';
    import {FoodAndDrinksService} from '../../../Services/FoodAndDrinks/food-and-drinks.service';
    import {ImageService} from '../../../Services/image.service';
    import {ActivityService} from '../../../Services/Activity/activity.service';
    import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
    import {TagService} from '../../../Services/fetch-tags.service';
    import {CustomPackageService} from '../../../Services/Package/custom-package.service';
//PDF Creator
    import jsPDF from 'jspdf';
    // declare var jquery:any;
    declare var $ :any;

//Custom Package Component
@Component({
    moduleId: module.id,
    selector: 'custom-package',
    templateUrl: 'custom-package.component.html',
})
export class CustomPackageComponent implements OnInit{

    custom : CustomPackage; //CustomPackage object for storing all the package items
    public budget : number;

    //Package Items
    accommodationList : Accommodation[];//list of accomodation options in Newcastle
    foodAndDrinks   : FoodAndDrinks[];            //list of restaurants and bars in Newcastle
    activities  : Activity[];   //list of events and activities in Newcastle
    imageList   : Image[];

    //View variables
    selected : number;      //Tab selection, 1=Travel, 2=Accommodation, 3=Restauarants, 4=Activities, 5=Cart

    //Restaurants and Activities View
    days : number[] = [];       //Used to store the amount of days the user is staying
    selectedDay : number;   //The day that has been selected for input of the package item
    duration : number;          //The amount of days the user is staying in Newcastle

    //Travel Form
    travelValue : string = 'No';    //Option selected by the user
    travelOptions = ['Yes','No'];   //List of available travel options
    travelPickup : TravelInformation;   //holds the travel pickup information
    travelDropoff : TravelInformation;  //holds the travel dropoff information


    //Food and Drinks Form
    cartForm = [
        {display: 'foodanddrinks', condition: 'none', value: 1, eatingTime: 'Breakfast'},
        {display: 'displayL', condition: 'none', value: 2, eatingTime: 'Lunch'},
        {display: 'displayD', condition: 'none', value: 3, eatingTime: 'Dinner'},
        {display: 'displayO', condition: 'none', value: 4, eatingTime: 'Other'}
    ]   // this object will be in charge of iterating through the four times for food.

    //barcode
    elementType = 'svg';
    value = 'someValue12340987';
    format = 'CODE128';
    //format = 'upc';
    lineColor = '#000000';
    width = 2;
    height = 100;
    displayValue = true;
    fontOptions = '';
    font = 'monospace';
    textAlign = 'center';
    textPosition = 'bottom';
    textMargin = 2;
    fontSize = 20;
    background = 'transparent';
    margin = 10;
    marginTop = 10;
    marginBottom = 10;
    marginLeft = 10;
    marginRight = 10;


    //how to display items
    view : number  = 1;
    viewString : string = "List";
    sortValue : string = "Name";

    show : number = 1;
    showString : string = "All"

    //View Items
    
    sortedData;

    //loading variables
    private imagesLoaded : boolean = false;
    private accommodationLoaded : boolean = false;
    private activitiesLoaded : boolean = false;
    private foodAndDrinksLoaded : boolean = false;
    
    //declare services
    constructor(
        private accommodationService            :   AccommodationService,
        private foodAndDrinksService            :   FoodAndDrinksService,
        private activityService                 :   ActivityService,
        private imageService                    :   ImageService,
        private packageService                  :   CustomPackageService,
        private slimLoadingBarService           :   SlimLoadingBarService,
        private router                          :   Router,
        public dialog                           :   MdDialog,
        private tagService                      :   TagService,
        ) {

            
        }

    ngOnInit() {
        //Grab the data entered from the initial form (home page)
        this.custom = this.packageService.getPackage();

        //this.custom.checkin = new Date('February 4, 2016 10:13:00'); //TEMP While testing module
        //this.custom.checkout = new Date('February 6, 2016 10:13:00'); //as above

        if(this.custom.navigation == null) {
            this.selected = 1;
            this.selectedDay = 1;
            this.travelValue = 'No'
            this.budget = this.custom.budget;
            this.custom.packageCost = 0; 
        } else {
            this.selected = this.custom.navigation;
            this.selectedDay = this.custom.aSelectedDay;
            this.travelValue = this.custom.requireTravel;
            this.budget = this.custom.budget;
        }

        if(this.budget == null) {
            this.budget = 472;
        }

        if(this.custom.travel == null) {
            var temp : TravelInformation = {
                pickup: true,
                address: null,
                city: null,
                state: null,
                postcode: null,
                date: null,
                time: null,
            };

            this.custom.travel = [];
            this.custom.travel[0] = Object.assign({}, temp);
            this.custom.travel[1] = Object.assign({}, temp);
            
            this.custom.travel[1].pickup = false;
        }


        if(this.custom.accommodation == null) {
            var tempAcc : Accommodation = new Accommodation;
            this.custom.accommodation = tempAcc;
            this.custom.accommodation.accommodationName = "";
        }

        this.travelPickup = this.custom.travel[0];
        this.travelDropoff = this.custom.travel[1];
        
        //From this data, calculate the duration the user is staying in Newcastle
        this.calculateDuration(this.custom.checkin, this.custom.checkout);
        //Populate the days array with this value
        this.setDaysArray(this.duration);

        this.fetch();
    }

    //Calculates the duration of the selected holiday
    private calculateDuration(checkin : Date, checkout : Date) {
        /*  checks if the date has been entered or not. By Default it will be null, this will prevent
            acccess to the form via a refresh
        */
        if(checkin == null) {
            this.router.navigate(["/home"]);    //navigates back to the home page
        }

        var one_day=1000*60*60*24;  //used to convert the time calculated into days

        //duration is a temp variable which calculates the duration of the trip
        var duration = new Date(checkout).getTime() - new Date(checkin).getTime();
        this.duration = Math.round(duration/one_day);   //round to the nearest day

        this.custom.budget = this.custom.budget * this.duration;
    }


    /* Assigns each day to the days array
        This is required since angular cannot pass in a value in the *ngFor
          e.g cannot do *ngFor="let x = 1; x <= duration ..."
          ngFor can only loop through arrays.
    */
    private setDaysArray(duration : number) : void{
        for(let i = 1; i <= duration; i++) {
            this.days.push(i);
            this.custom.days.push(i);
        }
    }

    private changeView(value : number) : void {
        this.view = value;
        
        switch(value) {
            case 1: this.viewString = "List"; break;
            case 2: this.viewString = "Grid"; break;
        }
    }

    private  changeShow(value : number) {
        this.show = value;

        switch(value) {
            case 1: this.showString = "All"; break;
            case 2: this.showString = "Best Seller"; break;
            case 3: this.showString = "bar"; break;
            case 4: this.showString = "dining"; break;
            case 5: this.showString = "takeout"; break;
            case 6: this.showString = "cafe"; break;
        }
    }

    private checkShow(a : Accommodation, f : FoodAndDrinks, ac : Activity, select : number) : boolean{
        switch(select) {
            case 1: 
                //accommodation
                if(this.show == 1) {
                    return true;
                }
                else if(this.show == 2) {
                    if(a.bestSeller) {
                        return true;
                    } else {
                        return false;
                    }
                } 
                break;
            case 2:
                //food and drinks
                switch(this.show) {
                    case 1: return true;
                    case 3: 
                        if(f.diningStyle == "bar") return true;
                        else return false;
                    case 4:
                        if(f.diningStyle == "dining") return true;
                        else return false;
                    case 5: 
                        if(f.diningStyle == "takeout") return true;
                        else return false;
                    case 6:
                        if(f.diningStyle == "cafe") return true;
                        else return false;

                }
                break;
            case 3: 
                //activity
                if(this.show == 1) {
                    return true;
                }
                else if(this.show == 2) {
                    if(ac.bestSeller) {
                        return true;
                    } else {
                        return false;
                    }
                } 
                break;
        }

        return false;
    }

    private changeSort(value : string) : void {
        this.sortValue = value;
    }

    private open(dialog: Md2Dialog) {
        dialog.open();
    }

    private close(dialog: any) {
        dialog.close();
      }

    

      private startLoading() {
        this.slimLoadingBarService.start();
    }
    private stopLoading() {
        this.slimLoadingBarService.stop();
    }
    private completeLoading() {
        this.slimLoadingBarService.complete();
    }

    //Navigation
    private setNavigation(selection : number) {
        /*
            When the user has selected the tab, it will then load the data.
            This will prevent long waiting time initially while the page is loading
            since the actual data has not been loaded yet.
        */
        this.selected = selection;
        this.show = 1;
        this.showString = "All";
    }

    private setDays(selection : number) : void {
        this.selectedDay = selection;
    }

    private expand(value : number) : void {
        if(this.cartForm[value-1].condition == 'none') {
            this.cartForm[value-1].condition = 'block';
        } else {
            this.cartForm[value-1].condition = 'none';
        }
    }

    

    /**
     * LOADING DATA
    */

    private fetch() : void {
        this.imageList = this.imageService.getData();
        this.accommodationList = this.accommodationService.getAccommodation();
        this.activities = this.activityService.getData();
        this.foodAndDrinks = this.foodAndDrinksService.getData();

        this.custom.activity = [];
        this.custom.foodAndDrinks = [];
        this.custom.selectedActivities = [];
        this.custom.selectedFoodAndDrinks = [];
    }

    private checkLoad() : boolean {
        if
            (
                this.accommodationService.isAccommodationLoaded()
                && this.imageService.isLoaded()
                && this.foodAndDrinksService.isLoaded()
                && this.activityService.isLoaded()
            ) {
           // this.completeLoading();
            return true;
        } else {
            return false;
        }
    }

    canDeactivate(){ 
        //check if user wants to navigate away
        if(this.custom.checkin != null) {
            this.saveForm();
            return true;
        } else {
            return true;
        }
    }

    saveForm() {
        this.custom.aSelectedDay = this.selectedDay;
        this.custom.fSelectedDay = this.selectedDay;
        this.custom.navigation = this.selected;
        this.custom.requireTravel = this.travelValue;
        this.custom.travel[0] = this.travelPickup;
        this.custom.travel[1] = this.travelDropoff;
        this.custom.budget = this.budget;

        this.packageService.setPackage(this.custom);

        //sessionStorage.setItem('packageForm', JSON.stringify(this.custom));
    }

    fillDropOff() {
        this.travelDropoff = Object.assign({}, this.travelPickup);
    }

    changeBudget() {
        let dialogRef = this.dialog.open(BudgetChangeComponent, {
            data: this.budget,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.budget = result;
        });
    }

    // createPDF(){
    //     let printContents, popupWin;
    //     printContents = document.getElementById('cart').innerHTML;
    //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //     popupWin.document.open();
    //     popupWin.document.write(`
    //       <html>
    //         <head>
    //           <title>Print tab</title>
    //           <style>
    //           //........Customized style.......
    //           </style>
    //         </head>
    //     <body onload="window.print();window.close()">${printContents}</body>
    //       </html>`
    //     );
    //     popupWin.document.close();
    // }

    sortData(sort: Sort) {
    //     const data = this.viewAccommodation.room.slice();
    //     if (!sort.active || sort.direction == '') {
    //       this.sortedData = data;
    //       return;
    //     }
    
    //     this.sortedData = data.sort((a, b) => {
    //       let isAsc = sort.direction == 'asc';
    //       switch (sort.active) {
    //         case 'room': return compare(a.roomTitle, b.roomTitle, isAsc);
    //         case 'features': return compare(+a.features, +b.features, isAsc);
    //         case 'price': return compare(+a.roomPrice, +b.roomPrice, isAsc);
    //         default: return 0;
    //       }
    //     });
       }
}

// function compare(a, b, isAsc) {
//     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
//   }

/*
###################################################################################################################################
###################################################################################################################################
###################################################################################################################################
###################################################################################################################################
###################################################################################################################################


OTHER COMPONENTS

###################################################################################################################################
###################################################################################################################################
###################################################################################################################################

*/

@Component({
    moduleId: module.id,
    selector: 'budgetChangeComponent',
    templateUrl: 'BudgetChangeComponent.html'
})
export class BudgetChangeComponent{
    value : number;

    constructor (public dialogRef: MdDialogRef<BudgetChangeComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {
                    this.value = data;
                }
}
