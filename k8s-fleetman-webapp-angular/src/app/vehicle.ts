export class Vehicle {
  name: string;
  lat: number;
  lng: number;
  dateAndTime: string;
  speed: number;
  
  //This contains all the lat longs of this Object - entire history
    historyofLatLong = [];

  constructor(name: string, lat:number, lng:number, dateAndTime:string, speed: number) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.dateAndTime = dateAndTime;
    this.speed = speed;
  }

}
