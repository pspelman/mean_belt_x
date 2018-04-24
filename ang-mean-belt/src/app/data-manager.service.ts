import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";



@Injectable()
export class RestaurantModel {
  restaurant_name: string;
  cuisine_type: string;
  description: string;
  reviews: Array<any>;
  // id: any;

  constructor(restaurant_name: string = "", cuisines_type: string = "", description: string = "") {
    this.restaurant_name = restaurant_name;
    this.cuisine_type = cuisines_type;
    this.description = description;
  }

}


@Injectable()
export class DataManagerService {

  constructor(private _http: HttpClient) { }



  //TODO: View Request
  getAllOffers() {
    //todo: update server file to contain this route, which will return a list of all active donation offers
    return this._http.get('/offers');

  }


  //TODO: Create Request
  createDonation(new_donation_offer: any) {
    return this._http.post('/donate', new_donation_offer)
  }



  //TODO: Update Request


  getAllRestaurants(){
    return this._http.get(`/restaurants`);
  }

  getRestaurantById(id) {
    return this._http.get(`/restaurants/${id}`);

  }

  getBeltTestModelById(id: any) {
    return this._http.get(`restaurants/${id}`);
  }


  deleteRestaurant(id: any) {
    return this._http.delete(`restaurants/${id}`);

  }

  createRestaurant(new_restaurant: RestaurantModel) {
    console.log(`trying to create new restaurant: `,new_restaurant);
    return this._http.post('/restaurants', new_restaurant);

  }

  createRestaurantReview(id, review) {

    console.log(`trying to add review for restaurant ${id}: `, review);
    //TODO: send put request to add review
    return this._http.put(`/reviews/${id}`, review);

  }

  updateRestaurantInfo(id, restaurant_info: RestaurantModel) {
    console.log(`trying to update restau id: `, id);
    return this._http.put(`/restaurants/${id}`, restaurant_info);
  }
}
