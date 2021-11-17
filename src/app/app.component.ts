import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core'
import {GoogleMap, MapInfoWindow} from '@angular/google-maps'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mapSearchField') searchField: any;
  @ViewChild(GoogleMap) map: any;

  lat: any = 23.163401;
  lng: any = 89.218163;
  center: google.maps.LatLngLiteral = {lat: this.lat, lng: this.lng};
  zoom = 15;

  circleCenter: google.maps.LatLngLiteral = {lat: 23.163401, lng: 89.218163};
  radius = 200;

  // mapTypeId hybrid, roadmap, satellite, terrain
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    maxZoom: 15,
    minZoom: 8,
  }

  options: google.maps.CircleOptions = {
    fillColor: 'red',
    fillOpacity: 0.9,
    strokeColor: 'red',
    strokeOpacity: 0.3,
    strokeWeight: 100,
    draggable: true
  }

  circleDrag($event: google.maps.MapMouseEvent): void {
    this.lat = $event.latLng?.lat();
    this.lng = $event.latLng?.lng();

    this.displayLocation(this.lat, this.lng)
  }

  zoomIn() {
    if (!this.mapOptions.maxZoom) return;
    if (this.zoom < this.mapOptions.maxZoom) {
      this.zoom++
    }
  }

  zoomOut() {
    if (!this.mapOptions.minZoom) return;
    if (this.zoom > this.mapOptions.minZoom) this.zoom--
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(
      this.searchField.nativeElement
    )
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchField.nativeElement
    )
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places?.length === 0) {
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      places?.forEach(place => {
        if (!place.geometry || !place.geometry.location) {
          return;
        }
        if (place.geometry.viewport) {
          // only geocodes have viewport
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    })
  }

  displayLocation(latitude: number,longitude: number){
    let geocoder:any;
    geocoder = new google.maps.Geocoder();
    let latLng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode(
      {'latLng': latLng},
      function(results: any, status:any) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let add= results[0].formatted_address ;
            let  value=add.split(",");

            console.log(value);
            // count=value.length;
            // country=value[count-1];
            // state=value[count-2];
            // city=value[count-3];
            // x.innerHTML = "city name is: " + city;
          }
          else  {
            console.log("address not found");
          }
        }
        else {
          console.log("Geocoder failed due to: " + status)
        }
      }
    );
  }
}
