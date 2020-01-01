import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Vehicle[] = [];
  centeredVehicle: string;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.subscription.subscribe(updatedVehicle => {
      if (updatedVehicle==null) return;
      let foundIndex = this.vehicles.findIndex(existingVehicle => existingVehicle.name == updatedVehicle.name);
      if (foundIndex == -1)
      {
          //Populate the arrray with current lat long
          updatedVehicle.historyofLatLong.push([updatedVehicle.lat,updatedVehicle.lng])
        
          this.vehicles.push(updatedVehicle);
        this.vehicles.sort( (a:Vehicle,b:Vehicle) => {
          return (a.name < b.name) ? -1 : 1;
        });
      }
      else
      {  //In existing Vehicle Array add the new lat/log values
        this.vehicles[foundIndex].historyofLatLong.push([updatedVehicle.lat,updatedVehicle.lng])
        
        //Assign the the complete existing array back to the updated obect since the updatedVehicle is the final object 
        updatedVehicle.historyofLatLong=this.vehicles[foundIndex].historyofLatLong;

        /********* TETS whether the array is being populated correctly 
        if(updatedVehicle.name == "Dronfield Round"){
        console.log("GODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD ARRAAYYYYYYY")
        console.log(updatedVehicle)}
        }*/



        this.vehicles[foundIndex] = updatedVehicle;
      }
    });
  }

  centerVehicle(vehicle: Vehicle) {
    // allow to "deselect"
    if (this.centeredVehicle == vehicle.name)
    {
      this.centeredVehicle = null
      this.vehicleService.updateCenterVehicle(null);
    }
    else
    {
      this.centeredVehicle = vehicle.name;
      this.vehicleService.updateCenterVehicle(vehicle);
    }
  }

}
