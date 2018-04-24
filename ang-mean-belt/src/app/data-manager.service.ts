import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";



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

  //TODO: Delete Request

  getAllThings() {
    return this._http.get('/belt_test_models');

  }

  getBeltTestModelById(id: any) {
    return this._http.get(`belt_test_models/${id}`);
  }
}
