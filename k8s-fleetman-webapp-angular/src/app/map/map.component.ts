import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { icon, latLng, Layer, Marker, marker, tileLayer, Map, point, polyline } from 'leaflet';

import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../vehicle';
//import L = require('leaflet');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private vehicleService: VehicleService) { }

  markers: Marker[] = [];
  latlngs = [];
  map: Map;
  centerVehicle: string;
  selectedVehicleHistory;
  vehicleHistory;

  options = {
    layers: [
       tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  { maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  })
    ],
    zoom: 16,
    center: latLng(53.375564, -1.506785)
  };

  onMapReady(map: Map) {
    this.map = map;
  }
  

  ngOnInit() {
    this.vehicleService.subscription.subscribe(vehicle => {
       if (vehicle == null) return;
       let foundIndex = this.markers.findIndex(existingMarker => existingMarker.options['title'] == vehicle.name);

       if (foundIndex == -1)
       {
         let newMarker = marker([vehicle.lat,vehicle.lng] ,
                                 {
                                   icon: icon( {
                                                 iconSize: [ 25, 41 ],
                                                 iconAnchor: [ 11, 41 ],
                                                 iconUrl: 'assets/marker-icon.png',
                                                 shadowUrl: 'assets/marker-shadow.png'
                                               }),
                                   title: vehicle.name
                                 }).bindTooltip(vehicle.name, {permanent:true,  offset: point({x: 0, y: 0})});
         this.markers.push(newMarker);
       }
       else
       {
        this.markers[foundIndex].setLatLng(latLng(vehicle.lat, vehicle.lng));
        this.latlngs = [ [vehicle.lat, vehicle.lng]];
       
     
      }
       
       if (this.centerVehicle == vehicle.name) {
      
      //This block is called whenever the centre vehicle's lat/long is updated.
      //And on the update the polyline is painted automatically i.e.it calls
      // ONLY the line : this.selectedVehicleHistory = polyline(myObject.godarray, {weight:10, opacity:0.5, color:'red'}).addTo(this.map);
      //from the last function of this page. 
      
      //  console.log("------------------------------inside---------"+ this.centerVehicle)
        
      this.selectedVehicleHistory.addLatLng(latLng(vehicle.lat, vehicle.lng));

         
       }
      
     });

     this.vehicleService.centerVehicle.subscribe(vehicle => {
       if (vehicle == null)
       {
         this.centerVehicle = null;
         return;
       }
       this.centerVehicle = vehicle.name;
       this.map.flyTo([vehicle.lat,vehicle.lng],
                         this.map.getZoom(), {
       				   	       "animate": true
       				  });
     });
       
     
     this.vehicleService.centerVehicleHistory.subscribe(newHistory => {
      
      
       if (this.selectedVehicleHistory != null) this.selectedVehicleHistory.remove(this.map);
       if (newHistory ==null) return;
      
     
     var myObject: Vehicle;
     myObject = <Vehicle> newHistory; 
    
     console.log(myObject);
     
     this.selectedVehicleHistory = polyline(myObject.godarray, {weight:10, opacity:0.5, color:'red'}).addTo(this.map);

     });
   }
}
